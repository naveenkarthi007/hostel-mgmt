const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { pool } = require('../config/database');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required.' });

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = signToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential)
    return res.status(400).json({ success: false, message: 'Google credential required.' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub: googleId, email, name, picture } = ticket.getPayload();

    // 1. Look up by google_id
    let [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);

    if (!rows.length) {
      // 2. Look up by email (link existing account)
      [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length) {
        await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, rows[0].id]);
      } else {
        // 3. Create new user
        const [result] = await pool.query(
          'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)',
          [name, email, googleId, 'student']
        );
        [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      }
    }

    const user = rows[0];
    const token = signToken(user);

    res.json({
      success: true,
      message: 'Google login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
};

const me = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,name,email,role,created_at FROM users WHERE id=?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [req.user.id]);
    const valid = await bcrypt.compare(currentPassword, rows[0].password);
    if (!valid) return res.status(400).json({ success: false, message: 'Current password incorrect.' });
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password=? WHERE id=?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { login, googleLogin, me, changePassword };
