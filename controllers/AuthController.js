const bcrypt = require('bcrypt');
const validator = require('validator');
const pool = require('../config/database');

exports.register = async (req, res) => {
  console.log("=== REGISTER START ===");
  console.log(req.body);

  try {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const phoneNumber = (req.body.phoneNumber || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !password ||
    !confirmPassword
    ) {
        return res.status(400).send('All fields are required.');
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send('Please enter a valid email address.');
    }

    if (password.length < 6) {
      return res.status(400).send('Password must be at least 6 characters long.');
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
      console.log("Transaction started");

      console.log("About to insert account...");
      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, 'adopter', 'active', 1]
      );
      const [rows] = await connection.query(
          "SELECT * FROM adopters WHERE account_id = ?",
          [accountResult.insertId]
      );

      console.log(rows);
      console.log("Account inserted!", accountResult);

      const [adopterResult] = await connection.execute(
          `INSERT INTO adopters
          (account_id, first_name, last_name, phone_number)
          VALUES (?, ?, ?, ?)`,
          [
              accountResult.insertId,
              firstName,
              lastName,
              phoneNumber
          ]
      );

      console.log(adopterResult);

      const [check] = await connection.query(
          "SELECT * FROM adopters WHERE account_id = ?",
          [accountResult.insertId]
      );

      console.log("Inserted adopter:", check);

      await connection.commit();
        // Redirect user back to login page after successful registration
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

    const [rows] = await pool.query(
      'SELECT account_id, email, password_hash, status, role FROM accounts WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).send('Email does not exist.');
    }

    const account = rows[0];

    // Pending organization accounts
if (
    account.role === "organization" &&
    account.status === "pending"
) {

    req.session.accountId = account.account_id;
    req.session.role = account.role;

    const [orgRows] = await pool.query(
        `SELECT organization_name
         FROM organizations
         WHERE account_id = ?
         LIMIT 1`,
        [account.account_id]
    );

    req.session.displayName =
        orgRows.length > 0
            ? orgRows[0].organization_name
            : account.email;

    return res.redirect("/org/pending");
}

// Rejected / Disabled accounts
if (account.status !== "active") {
    return res.status(403).send("This account is not active.");
}

    const isValidPassword = await bcrypt.compare(password, account.password_hash);

    if (!isValidPassword) {
      return res.status(401).send('Incorrect password.');
    }

    req.session.accountId = account.account_id;
    req.session.role = account.role;

    // Admin
    if (account.role === "admin") {
    return res.redirect("/admin/dashboard");
    }

    // Adopter
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

    // Organization
    if (account.role === "organization") {
        const [orgRows] = await pool.query(
            "SELECT organization_name FROM organizations WHERE account_id = ? LIMIT 1",
            [account.account_id]
        );

        req.session.displayName = orgRows.length
            ? orgRows[0].organization_name
            : account.email;

        return res.redirect("/org/dashboard");
    }

    return res.status(403).send("Unknown account role.");

  } catch (error) {
    console.error('login error:', error);
    return res.status(500).send('Unable to sign in right now.');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login.html');
  });
};

exports.registerOrganization = async (req, res) => {

    try {

        const {
            email,
            password,
            confirmPassword,
            organizationName,
            organizationType,
            contactPerson,
            contactNumber,
            address,
            city,
            province,
            description
        } = req.body;

        if (
            !email ||
            !password ||
            !confirmPassword ||
            !organizationName ||
            !organizationType ||
            !contactPerson ||
            !contactNumber ||
            !address ||
            !city ||
            !province
        ) {

            return res.status(400).send("Please complete all required fields.");

        }

        if (password !== confirmPassword) {

            return res.status(400).send("Passwords do not match.");

        }

        const [existing] = await pool.query(

            "SELECT account_id FROM accounts WHERE email=?",

            [email]

        );

        if (existing.length > 0) {

            return res.status(400).send("Email already exists.");

        }

        const passwordHash = await bcrypt.hash(password,10);

        const connection = await pool.getConnection();

        try{

            await connection.beginTransaction();

            // ===========================
            // accounts table
            // ===========================

            const [accountResult] = await connection.query(

                `INSERT INTO accounts
                (email,password_hash,role,status,email_verified)
                VALUES (?,?,?,?,?)`,

                [
                    email,
                    passwordHash,
                    "organization",
                    "pending",
                    0
                ]

            );

            const accountId = accountResult.insertId;

// ===========================
// organizations table
// ===========================

const [organizationResult] = await connection.query(

    `INSERT INTO organizations
    (
        account_id,
        organization_name,
        organization_type,
        contact_person,
        contact_number,
        address,
        city,
        province,
        description,
        verification_status
    )
    VALUES (?,?,?,?,?,?,?,?,?,?)`,

    [
        accountId,
        organizationName,
        organizationType,
        contactPerson,
        contactNumber,
        address,
        city,
        province,
        description,
        "Pending"
    ]

);
const organizationId = organizationResult.insertId;

// ===========================
// organization_documents table
// ===========================

if (req.file) {

    await connection.query(

        `INSERT INTO organization_documents
        (
            organization_id,
            document_name,
            file_path
        )
        VALUES (?, ?, ?)`,

        [
            organizationId,
            req.file.originalname,
            req.file.filename
        ]

    );

}    

            await connection.commit();

            res.send("Organization registered successfully.");

        }

        catch(err){

            await connection.rollback();

            throw err;

        }

        finally{

            connection.release();

        }

    }

    catch(err){

        console.error(err);

        res.status(500).send("Registration failed.");

    }

};