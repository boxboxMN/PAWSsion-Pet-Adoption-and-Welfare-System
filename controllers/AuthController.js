const bcrypt = require('bcrypt');
const validator = require('validator');
const pool = require('../config/database');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
const phoneRegex = /^(09\d{9}|\+639\d{9})$/;
const zipRegex = /^\d{4}$/; //for zip code
const crypto = require("crypto");
const transporter = require("../config/email");
const { logActivity } = require("./adminController");

exports.register = async (req, res) => {
  console.log("=== REGISTER START ===");
  console.log(req.body);

  try {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const birthday = (req.body.birthday || '').trim();
    const civilStatus = (req.body.civilStatus || '').trim() || null;
    const occupation = (req.body.occupation || '').trim() || null;

    const streetAddress = (req.body.streetAddress || '').trim();
    const region = (req.body.region || '').trim();
    const barangay = (req.body.barangay || '').trim();
    const city = (req.body.city || '').trim();
    const province = (req.body.province || '').trim();
    const zipCode = (req.body.zipCode || '').toString().trim().replace(/\D/g, '');
    const phoneNumber = (req.body.phoneNumber || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';
    

    if (!firstName || !lastName || !birthday || !streetAddress || !region || !barangay || !city || !province || !zipCode || !phoneNumber || !email || !password || !confirmPassword) {
        return res.status(400).send('Please fill out all required fields.');
    }

    // ZIP Code format validation
    if (!zipRegex.test(zipCode)) {
        return res.status(400).send('Please enter a valid 4-digit Philippine ZIP code.');
    }

    // Birthday validation & 18+ calculation
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      return res.status(400).send('Please enter a valid birthday.');
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(400).send('You must be at least 18 years old to create an account.');
    }
    if (age > 120) {
      return res.status(400).send('Please enter a realistic birth date.');
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send('Please enter a valid email address.');
    }

    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).send('Please enter a valid Philippine mobile number.');
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send('Password does not meet complexity requirements.');
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    const [existingAccounts] = await pool.query(
      'SELECT account_id FROM accounts WHERE email = ? LIMIT 1',
      [email]
    );

    if (existingAccounts.length > 0) {
      return res.status(409).send('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, 'adopter', 'active', 1]
      );

      await connection.execute(
          `INSERT INTO adopters (
            account_id, first_name, last_name, birthday, civil_status, occupation,
            street_address, region, barangay, city, province, zip_code, phone_number
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            accountResult.insertId, firstName, lastName, birthday, civilStatus, occupation,
            streetAddress, region, barangay, city, province, zipCode, phoneNumber
          ]
      );

      await connection.commit();

      await logActivity(accountResult.insertId, "account_registered", "user", accountResult.insertId, `Adopter: ${firstName} ${lastName}`);

      return res.redirect('/auth/login.html?success=1');
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('register error:', error);
    return res.status(500).send('Unable to create account right now.');
  }
};

exports.login = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).send('Email and password are required.');
    }

    // Check for suspicious patterns in email and password to detect potential SQL injection attempts
    const suspiciousPattern = /('|--|;|\bor\b\s+\d+\s*=\s*\d+|\bunion\b\s+\bselect\b)/i;
    if (suspiciousPattern.test(email) || suspiciousPattern.test(password)) {
      await logActivity(null, "suspicious_login_input", "auth", null, `Email: ${email}`);
    }

    const [rows] = await pool.query(
      'SELECT account_id, email, password_hash, status, role FROM accounts WHERE email = ? LIMIT 1',
      [email]
    );
    const genericAuthError = 'Invalid email or password.';

    if (rows.length === 0) {
      await logActivity(null, "login_failed", "auth", null, `Unknown email: ${email}`);
      return res.status(401).send(genericAuthError);
    }

    const account = rows[0];

if (account.role === "organization" && account.status === "pending") {
    req.session.accountId = account.account_id;
    req.session.role = account.role;

    const [orgRows] = await pool.query(
        `SELECT organization_name FROM organizations WHERE account_id = ? LIMIT 1`,
        [account.account_id]
    );

    req.session.displayName = orgRows.length > 0
        ? orgRows[0].organization_name
        : account.email;

    return res.redirect("/org/pending");
    }


    if (account.status === "disabled") {
        await logActivity(account.account_id, "login_blocked", "auth", account.account_id, "Account disabled");
        return res.status(403).send("This account has been disabled.");
    }

    if (account.status === "suspended") {
        await logActivity(account.account_id, "login_blocked", "auth", account.account_id, "Account suspended");
        return res.status(403).send("This account has been suspended.");
    }

    if (account.status === "banned") {
        await logActivity(account.account_id, "login_blocked", "auth", account.account_id, "Account banned");
        return res.status(403).send("This account has been permanently banned.");
    }

    if (account.status === "rejected") {
        await logActivity(account.account_id, "login_blocked", "auth", account.account_id, "Account rejected");
        return res.status(403).send("Your account has been rejected.");
    }

    // Password check
    const isValidPassword = await bcrypt.compare(password, account.password_hash);
        if (!isValidPassword) {
            await logActivity(account.account_id, "login_failed", "auth", account.account_id, "Wrong password");
            return res.status(401).send(genericAuthError);
        }

    // ✅ Update last login
    await pool.query(
        `
        UPDATE accounts
        SET last_login = NOW()
        WHERE account_id = ?
        `,
        [account.account_id]
    );

    // Create session
    req.session.accountId = account.account_id;
    req.session.role = account.role;

    await logActivity(account.account_id, "login_success", "auth", account.account_id);

    if (account.role === "admin") {
        return res.redirect("/admin/dashboard");
    }
    if (account.role === "adopter") {
        const [adopterRows] = await pool.query(
            "SELECT first_name, last_name FROM adopters WHERE account_id = ? LIMIT 1",
            [account.account_id]
        );

        req.session.displayName = adopterRows.length
            ? `${adopterRows[0].first_name} ${adopterRows[0].last_name}`.trim()
            : account.email;

        return res.redirect("/dashboard");
    }
    if (account.role === "organization") {
        const [orgRows] = await pool.query(
            "SELECT organization_name FROM organizations WHERE account_id = ? LIMIT 1",
            [account.account_id]
        );

        req.session.displayName = orgRows.length ? orgRows[0].organization_name : account.email;
        return res.redirect("/org/dashboard");
    }

    return res.status(403).send("Unknown account role.");

  } catch (error) {
    console.error('login error:', error);
    return res.status(500).send('Unable to sign in right now.');
  }
};

exports.logout = (req, res, ) => {
    const accountId = req.session?.accountId;

    req.session.destroy(async (err) => {
        if (err) {
            console.error("Logout error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to logout."
            });
        }

        res.clearCookie("connect.sid");

        await logActivity(accountId, "logout", "auth", accountId);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    });
};

exports.registerOrganization = async (req, res) => {
    try {
        // Sanitize and validate inputs on the server-side
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';
        const confirmPassword = req.body.confirmPassword || '';
        const organizationName = (req.body.organizationName || '').trim();
        const organizationType = (req.body.organizationType || '').trim();
        const contactPerson = (req.body.contactPerson || '').trim();
        const contactNumber = (req.body.contactNumber || '').trim();
        const streetAddress = (req.body.streetAddress || req.body.address || '').trim();
        const region = (req.body.region || '').trim();
        const province = (req.body.province || '').trim();
        const city = (req.body.city || '').trim();
        const barangay = (req.body.barangay || '').trim();
        const zipCode = (req.body.zipCode || '').toString().trim().replace(/\D/g, '');
        const description = (req.body.description || '').trim();

        if (
            !email || !password || !confirmPassword || !organizationName || 
            !organizationType || !contactPerson || !contactNumber || 
            !streetAddress || !region || !province || !city || !barangay || !zipCode
        ) {
            return res.status(400).send("Please complete all required fields.");
        }
        if (!zipRegex.test(zipCode)) {
            return res.status(400).send("Please enter a valid 4-digit Philippine ZIP code.");
        }
        if (!validator.isEmail(email)) {
            return res.status(400).send("Please enter a valid email address.");
        }
        if (!phoneRegex.test(contactNumber)) {
            return res.status(400).send("Please enter a valid Philippine mobile number.");
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password does not meet complexity requirements.");
        }

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }
        if (!req.file) {
            return res.status(400).send("Verification document is required.");
        }

        const [existing] = await pool.query(
            "SELECT account_id FROM accounts WHERE email=?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).send("An account with this email already exists.");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const [accountResult] = await connection.query(
                `INSERT INTO accounts (email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?)`,
                [email, passwordHash, "organization", "pending", 0]
            );

            const accountId = accountResult.insertId;

            const [organizationResult] = await connection.query(
                `INSERT INTO organizations (
                    account_id, organization_name, organization_type, contact_person, 
                    contact_number, address, region, province, city, 
                    barangay, zip_code, description, verification_status
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    accountId, organizationName, organizationType, contactPerson,
                    contactNumber, streetAddress, region, province, city, barangay, 
                    zipCode, description, "Pending"
                ]
            );
            
            const organizationId = organizationResult.insertId;

            await connection.query(
                `INSERT INTO organization_documents (organization_id, document_name, file_path) VALUES (?, ?, ?)`,
                [organizationId, req.file.originalname, req.file.filename]
            );

            await connection.commit();

            await logActivity(accountId, "account_registered", "user", accountId, `Organization: ${organizationName}`);

            res.send("Organization registered successfully.");

        } catch(err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

    } catch(err) {
        console.error(err);
        res.status(500).send("Registration failed. Please try again later.");
    }
};
exports.checkEmailAvailability = async (req, res) => {
    try {
        const email = (req.query.email || '').trim().toLowerCase();

        if (!email) {
            return res.status(400).send("Email parameter is required.");
        }
        const [existingAccounts] = await pool.query(
            'SELECT account_id FROM accounts WHERE email = ?',
            [email]
        );

        if (existingAccounts.length > 0) {
            return res.status(409).send("Email is already registered.");
        }
        return res.status(200).send("Email is available.");
    } catch (err) {
        console.error("Error sa checkEmailAvailability:", err);
        return res.status(500).send("Internal server error.");
    }
};

exports.checkOrgNameAvailability = async (req, res) => {
    try {
        const orgName = (req.query.orgName || '').trim();

        if (!orgName) {
            return res.status(400).send("Organization name parameter is required.");
        }
        const [existingOrg] = await pool.query(
            'SELECT organization_id FROM organizations WHERE LOWER(organization_name) = LOWER(?)',
            [orgName]
        );

        if (existingOrg.length > 0) {
            
            return res.status(409).send("Organization name is already taken.");
        }
        return res.status(200).send("Organization name is available.");
    } catch (err) {
        console.error("Error sa checkOrgNameAvailability:", err);
        return res.status(500).send("Internal server error.");
    }
};
//FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    try {
        const email = (req.body.email || "").trim().toLowerCase();

        if (!email) {
            return res.status(400).send("Email is required.");
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send("Please enter a valid email address.");
        }

        const [accounts] = await pool.query(
            `
            SELECT account_id, email
            FROM accounts
            WHERE email = ?
            LIMIT 1
            `,
            [email]
        );

        // Do not reveal whether the email exists
        if (accounts.length === 0) {
            return res.status(200).send(
                "If an account with that email exists, a password reset link has been sent."
            );
        }

        const account = accounts[0];

        // Generate secure random token
        const rawToken = crypto.randomBytes(32).toString("hex");

        // Store only the hash of the token
        const tokenHash = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");

        // Token expires after 30 minutes
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        // Delete previous unused tokens for this account
        await pool.query(
            `
            DELETE FROM password_reset_tokens
            WHERE account_id = ?
            `,
            [account.account_id]
        );

        // Store new reset token
        await pool.query(
            `
            INSERT INTO password_reset_tokens
            (
                account_id,
                token_hash,
                expires_at
            )
            VALUES (?, ?, ?)
            `,
            [
                account.account_id,
                tokenHash,
                expiresAt
            ]
        );

        const resetLink =
            `${process.env.APP_URL}/auth/reset-password.html?token=${rawToken}`;

        await transporter.sendMail({
            from: `"Pawpon Support" <${process.env.EMAIL_USER}>`,
            to: account.email,
            subject: "Pawpon Password Reset",
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    color: #334155;
                ">
                    <h2 style="color:#1656ff;">
                        Pawpon Password Reset
                    </h2>

                    <p>
                        We received a request to reset your Pawpon account password.
                    </p>

                    <p>
                        Click the button below to create a new password.
                    </p>

                    <div style="margin:30px 0;">
                        <a
                            href="${resetLink}"
                            style="
                                background:#1656ff;
                                color:white;
                                padding:12px 22px;
                                border-radius:8px;
                                text-decoration:none;
                                font-weight:bold;
                                display:inline-block;
                            "
                        >
                            Reset My Password
                        </a>
                    </div>

                    <p style="font-size:13px;color:#64748b;">
                        This link will expire in 30 minutes.
                    </p>

                    <p style="font-size:13px;color:#64748b;">
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                </div>
            `
        });

        return res.status(200).send(
            "If an account with that email exists, a password reset link has been sent."
        );

    } catch (error) {
        console.error("forgotPassword error:", error);

        return res.status(500).send(
            "Unable to process password reset right now."
        );
    }
};

//CHANGE PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const token = (req.body.token || "").trim();
        const password = req.body.password || "";
        const confirmPassword = req.body.confirmPassword || "";

        if (!token || !password || !confirmPassword) {
            return res.status(400).send("All fields are required.");
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send(
                "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
            );
        }

        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match.");
        }

        // Hash token so the raw token is never stored in DB
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const [rows] = await pool.query(
            `
            SELECT
                reset_id,
                account_id
            FROM password_reset_tokens
            WHERE token_hash = ?
              AND used_at IS NULL
              AND expires_at > NOW()
            LIMIT 1
            `,
            [tokenHash]
        );

        if (rows.length === 0) {
            return res.status(400).send(
                "This password reset link is invalid or has expired."
            );
        }

        const resetRequest = rows[0];

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update actual account password
        await pool.query(
            `
            UPDATE accounts
            SET password_hash = ?
            WHERE account_id = ?
            `,
            [
                passwordHash,
                resetRequest.account_id
            ]
        );

        // Mark reset token as used
        await pool.query(
            `
            UPDATE password_reset_tokens
            SET used_at = NOW()
            WHERE reset_id = ?
            `,
            [resetRequest.reset_id]
        );

        return res.status(200).send(
            "Password changed successfully."
        );

    } catch (error) {
        console.error("resetPassword error:", error);

        return res.status(500).send(
            "Unable to reset password right now."
        );
    }
};