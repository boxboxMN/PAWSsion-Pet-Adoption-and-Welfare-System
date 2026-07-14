const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const pool = require('./config/database');
const { uploadOrgPic } = require('./config/upload'); //for org profile pic upload

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'pawpon-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ROUTES
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orgRoutes = require("./routes/orgRoutes");
const authRoutes = require("./routes/auth");

const bcrypt = require('bcrypt');
const Organization = require('./models/organizationModel');

app.use("/auth", authRoutes);
app.use(userRoutes);
app.use("/admin", adminRoutes);
app.use("/org", orgRoutes);



app.get('/api/current-user', async (req, res) => {
  try {
    const accountId = req.session?.accountId || req.session?.userId || req.query.accountId || req.query.userId;
    let displayName = req.session?.displayName || req.session?.userName || 'User';

    if (accountId) {
      const [rows] = await pool.query(
        `SELECT a.account_id, a.email, ad.first_name, ad.last_name
         FROM accounts a
         LEFT JOIN adopters ad ON ad.account_id = a.account_id
         WHERE a.account_id = ?
         LIMIT 1`,
        [accountId]
      );

      if (rows[0]) {
        const firstName = rows[0].first_name || '';
        const lastName = rows[0].last_name || '';
        displayName = [firstName, lastName].filter(Boolean).join(' ') || rows[0].email || 'User';
        req.session.displayName = displayName;
      }
    } else {
      const [rows] = await pool.query(
        `SELECT first_name, last_name FROM adopters ORDER BY adopter_id LIMIT 1`
      );

      if (rows[0]) {
        const firstName = rows[0].first_name || '';
        const lastName = rows[0].last_name || '';
        displayName = [firstName, lastName].filter(Boolean).join(' ') || 'User';
        req.session.displayName = displayName;
      }
    }

    res.json({ name: displayName });
  } catch (error) {
    console.error('current-user error:', error);
    res.json({ name: req.session?.displayName || 'User' });
  }
});

app.get("/api/organization/pending", async (req, res) => {

    if (!req.session.accountId) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    try {

        const [rows] = await pool.query(

            `SELECT
                organization_name,
                verification_status,
                accounts.created_at
            FROM organizations
            JOIN accounts
            ON organizations.account_id = accounts.account_id
            WHERE organizations.account_id = ?`,

            [req.session.accountId]

        );

        if (!rows.length) {
            return res.status(404).json({
                error: "Organization not found"
            });
        }

        res.json(rows[0]);

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            error:"Server Error"
        });

    }

});

//org profile
app.get("/api/organization/profile", async (req, res) => {

  if (!req.session.accountId) {
    return res.status(401).json({
        error: "Unauthorized"
    });
}

try {
    // GINAGAMIT NA NATIN ANG BAGONG MODEL MO DITO:
    const orgData = await Organization.getProfileByAccountId(req.session.accountId);

    if (!orgData) {
        return res.status(404).json({
            error: "Organization not found"
        });
    }

    // Ipapasa na ang BUONG object (kasama name, contact, address, pic, etc.) sa frontend
    res.json(orgData);

} catch (err) {
    console.error(err);
    res.status(500).json({
        error: "Server Error"
    });
}
});

//FOR CHANGE PASSWORD

// MODAL CURRENT PASSWORD VERIFICATION: 
app.post("/api/organization/verify-password", async (req, res) => {
  if (!req.session.accountId) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  // 1. CHECK KUNG NAKA-LOCKOUT ANG USER
  if (req.session.lockoutUntil && Date.now() < req.session.lockoutUntil) {
      const remainingTime = Math.ceil((req.session.lockoutUntil - Date.now()) / 60000);
      return res.status(429).json({ 
          message: `Too many failed attempts. Try again after ${remainingTime} minute(s).` 
      });
  }

  const { currentPassword } = req.body;

  try {
      // Siguraduhin na ang tawag mo sa Model ay tugma (Organization)
      const storedHashedPassword = await Organization.getPasswordById(req.session.accountId);

      if (!storedHashedPassword) {
          return res.status(404).json({ message: "Account not found." });
      }

      const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);

      if (!isMatch) {
          if (!req.session.passwordAttempts) {
              req.session.passwordAttempts = 5;
          }
          
          req.session.passwordAttempts -= 1;

          if (req.session.passwordAttempts <= 0) {
              req.session.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
              req.session.passwordAttempts = 5;
              
              return res.status(429).json({ 
                  message: "Too many failed attempts. You are locked out from changing password for 15 minutes." 
              });
          }

          return res.status(400).json({ 
              message: `Incorrect password. You have ${req.session.passwordAttempts} attempt(s) remaining.` 
          });
      }

      // I-reset pag tama
      req.session.passwordAttempts = 5;
      req.session.lockoutUntil = null;

      res.status(200).json({ message: "Identity verified. Proceed to next step." });

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error during verification." });
  }
});

//MODAL NEW PASSWORD UPDATE
app.put("/api/organization/update-password", async (req, res) => {
  if (!req.session.accountId) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  const { currentPassword, newPassword } = req.body;

  try {
      // Double-check security: I-verify ulit ang current password para hindi ma-bypass gamit ang API tools (Postman)
      const storedHashedPassword = await Organization.getPasswordById(req.session.accountId);
      const isMatch = await bcrypt.compare(currentPassword, storedHashedPassword);

      if (!isMatch) {
          return res.status(400).json({ message: "Verification failed. Action blocked." });
      }

      // 1. I-hash ang bagong password ng user (10 rounds ng salt)
      const saltRounds = 10;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // 2. I-save sa database gamit ang Model natin
      const success = await Organization.updatePassword(req.session.accountId, hashedNewPassword);

      if (success) {
          res.status(200).json({ message: "Password updated successfully!" });
      } else {
          res.status(500).json({ message: "Failed to update database record." });
      }

  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error while updating password." });
  }
});

//org edit profile
app.put("/api/organization/update-profile", uploadOrgPic.single('profile_pic'), async (req, res) => {
  // 1. Siguraduhing naka-login ang user via session
  if (!req.session.accountId) {
      return res.status(401).json({ message: "Unauthorized" });
  }

  try {
      // Kunin ang text fields na pinadala ng FormData mula sa frontend
      const { organization_name, contact_number, contact_person, address, city, province, description } = req.body;

      // Ihanda ang object na ipapasa sa ating Model
      const profileData = {
          organization_name,
          contact_number,
          contact_person,
          address,
          city,
          province,
          description,
          profile_pic: null // Naka-null muna by default
      };

      // 2. Kung may piniling bagong larawan ang user at sinalo ito ng Multer
      if (req.file) {
          // Ito ang web path na ise-save sa DB para ma-access ng <img src="...">
          profileData.profile_pic = `/uploads/orgs/${req.file.filename}`;
      }

      // 3. Tawagin ang model function natin para mag-execute ng UPDATE query sa DB
      const success = await Organization.updateProfile(req.session.accountId, profileData);

      if (success) {
          res.status(200).json({ message: "Profile updated successfully!", 
          profile_pic: profileData.profile_pic
          });
      } else {
          // Pwedeng pumasok dito kung pinindot ang save pero wala namang binagong text or image ang user
          res.status(400).json({ message: "No changes were made or update failed." });
      }

  } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ message: "Server error while updating profile." });
  }
});

// Endpoint para makuha ang active session profile pic
app.get("/api/organization/session-data", async (req, res) => {
  // 1. Siguraduhing naka-login
  if (!req.session.accountId) {
      return res.status(401).json({ message: "Unauthorized" });
  }
  try {
      // 2. Kunin ang organization data mula sa MySQL gamit ang accountId ng session
      const currentOrg = await Organization.getById(req.session.accountId); 
      
      // 3. Ibalik ang profile_pic
      res.status(200).json({ 
          profile_pic: currentOrg ? currentOrg.profile_pic : null 
      });
  } catch (err) {
      console.error("Error fetching session data:", err);
      res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
