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
      return res.status(401).send('Invalid email or password.');
    }

    const account = rows[0];
    const isValidPassword = await bcrypt.compare(password, account.password_hash);

    if (!isValidPassword) {
      return res.status(401).send('Invalid email or password.');
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
