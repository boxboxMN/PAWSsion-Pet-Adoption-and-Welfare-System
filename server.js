const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const pool = require('./config/database');

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

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orgRoutes = require("./routes/orgRoutes");
const authRoutes = require("./routes/auth");


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
app.get("/api/organization/profile", async (req, res) => {

    if (!req.session.accountId) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    try {

        const [rows] = await pool.query(
            `
            SELECT organization_name
            FROM organizations
            WHERE account_id = ?
            `,
            [req.session.accountId]
        );

        if (!rows.length) {
            return res.status(404).json({
                error: "Organization not found"
            });
        }

        res.json(rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Server Error"
        });

    }

});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
