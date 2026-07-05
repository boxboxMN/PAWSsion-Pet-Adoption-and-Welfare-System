const bcrypt = require('bcrypt');
const validator = require('validator');
const pool = require('../config/database');

exports.register = async (req, res) => {
  try {
    const firstName = (req.body.firstName || '').trim();
    const lastName = (req.body.lastName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
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

      const [accountResult] = await connection.execute(
        'INSERT INTO accounts (email, password_hash, role, status, email_verified) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, 'adopter', 'active', 1]
      );

      await connection.execute(
        'INSERT INTO adopters (account_id, first_name, last_name) VALUES (?, ?, ?)',
        [accountResult.insertId, firstName, lastName]
      );

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
      'SELECT account_id, email, password_hash, status FROM accounts WHERE email = ? LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).send('Email does not exist.');
    }

    const account = rows[0];

    if (account.status !== 'active') {
      return res.status(403).send('This account is not active.');
    }

    const isValidPassword = await bcrypt.compare(password, account.password_hash);

    if (!isValidPassword) {
      return res.status(401).send('Incorrect password.');
    }

    if (account.status !== 'active') {
      return res.status(403).send('This account is not active.');
    }

    const [adopterRows] = await pool.query(
      'SELECT first_name, last_name FROM adopters WHERE account_id = ? LIMIT 1',
      [account.account_id]
    );

    req.session.accountId = account.account_id;
    req.session.displayName = adopterRows[0]
      ? `${adopterRows[0].first_name} ${adopterRows[0].last_name}`.trim()
      : account.email;

    return res.redirect('/dashboard');
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

// // ======================================================
// // CREATE uploads folder if it doesn't exist
// // ======================================================

// const uploadDirectory = path.join(
//     __dirname,
//     "../public/uploads/organization_documents"
// );

// if (!fs.existsSync(uploadDirectory)) {
//     fs.mkdirSync(uploadDirectory, { recursive: true });
// }

// // ======================================================
// // MULTER CONFIG
// // ======================================================

// const storage = multer.diskStorage({

//     destination(req, file, cb) {
//         cb(null, uploadDirectory);
//     },

//     filename(req, file, cb) {

//         const unique =
//             Date.now() + "-" + Math.round(Math.random() * 1e9);

//         cb(
//             null,
//             unique + path.extname(file.originalname)
//         );

//     }

// });

// function fileFilter(req, file, cb) {

//     const allowed = [
//         ".pdf",
//         ".jpg",
//         ".jpeg",
//         ".png"
//     ];

//     const ext = path.extname(file.originalname).toLowerCase();

//     if (allowed.includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only PDF, JPG and PNG files are allowed."));
//     }

// }

// exports.upload = multer({

//     storage,
//     fileFilter

// }).single("document");


// // ======================================================
// // STEP 1
// // ======================================================

// exports.step1 = async (req, res) => {

//     try {

//         const email = (req.body.email || "")
//             .trim()
//             .toLowerCase();

//         const password = req.body.password || "";

//         const confirmPassword =
//             req.body.confirmPassword || "";

//         if (
//             !email ||
//             !password ||
//             !confirmPassword
//         ) {

//             return res
//                 .status(400)
//                 .send("All fields are required.");

//         }

//         if (!validator.isEmail(email)) {

//             return res
//                 .status(400)
//                 .send("Invalid email address.");

//         }

//         if (password.length < 6) {

//             return res
//                 .status(400)
//                 .send("Password must be at least 6 characters.");

//         }

//         if (password !== confirmPassword) {

//             return res
//                 .status(400)
//                 .send("Passwords do not match.");

//         }

//         const [existing] = await pool.query(

//             "SELECT account_id FROM accounts WHERE email=? LIMIT 1",

//             [email]

//         );

//         if (existing.length > 0) {

//             return res
//                 .status(409)
//                 .send("Email already exists.");

//         }

//         req.session.organizationSignup = {

//             email,

//             password

//         };

//         return res.send("OK");

//     }

//     catch (err) {

//         console.error(err);

//         return res
//             .status(500)
//             .send("Server error.");

//     }

// };


// // ======================================================
// // FINAL REGISTRATION
// // ======================================================

// exports.completeRegistration = async (req, res) => {

//     try {

//         if (!req.session.organizationSignup) {

//             return res
//                 .status(400)
//                 .send("Step 1 has not been completed.");

//         }

//         const {

//             email,

//             password

//         } = req.session.organizationSignup;

//         const {

//             organizationName,

//             organizationType,

//             contactPerson,

//             contactNumber,

//             address,

//             city,

//             province,

//             description

//         } = req.body;

//         if (!req.file) {

//             return res
//                 .status(400)
//                 .send("Please upload a document.");

//         }

//         const passwordHash =
//             await bcrypt.hash(password, 10);

//         const connection =
//             await pool.getConnection();

//         try {

//             await connection.beginTransaction();

//             // ======================
//             // ACCOUNTS
//             // ======================

//             const [accountResult] =
//                 await connection.execute(

//                     `INSERT INTO accounts
//                     (
//                         email,
//                         password_hash,
//                         role,
//                         status,
//                         email_verified
//                     )
//                     VALUES
//                     (?, ?, ?, ?, ?)`,
//                     [

//                         email,

//                         passwordHash,

//                         "organization",

//                         "pending",

//                         0

//                     ]

//                 );

//             // ======================
//             // ORGANIZATIONS
//             // ======================

//             const [organizationResult] =
//                 await connection.execute(

//                     `INSERT INTO organizations
//                     (
//                         account_id,
//                         organization_name,
//                         organization_type,
//                         contact_person,
//                         contact_number,
//                         address,
//                         city,
//                         province,
//                         description
//                     )
//                     VALUES
//                     (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                     [

//                         accountResult.insertId,

//                         organizationName,

//                         organizationType,

//                         contactPerson,

//                         contactNumber,

//                         address,

//                         city,

//                         province,

//                         description

//                     ]

//                 );

//             // ======================
//             // DOCUMENT
//             // ======================

//             await connection.execute(

//                 `INSERT INTO organization_documents
//                 (
//                     organization_id,
//                     document_name,
//                     file_path
//                 )
//                 VALUES
//                 (?, ?, ?)`,

//                 [

//                     organizationResult.insertId,

//                     req.file.originalname,

//                     "/uploads/organization_documents/" +
//                     req.file.filename

//                 ]

//             );

//             await connection.commit();

//             delete req.session.organizationSignup;

//             return res.send("SUCCESS");

//         }

//         catch (err) {

//             await connection.rollback();

//             throw err;

//         }

//         finally {

//             connection.release();

//         }

//     }

//     catch (err) {

//         console.error(err);

//         return res
//             .status(500)
//             .send("Unable to register organization.");

//     }

// };