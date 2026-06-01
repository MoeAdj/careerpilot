import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import crypto from 'crypto';
import { pool } from '../db/pool';

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
// Signup route
// This creates a new user and stores a hashed password, not the real password.
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return res.status(201).json({ user, token });
  }  catch (error) {
  console.error('SIGNUP ERROR:', error);

  return res.status(500).json({
    message: 'Could not create account'
  });
}
});

// Login route
// This checks the email and password, then returns a token if everything is correct.
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid login' });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordsMatch) {
      return res.status(401).json({ message: 'Invalid login' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch {
    return res.status(500).json({ message: 'Login failed' });
  }
});
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }

  try {
    const userResult = await pool.query(
  'SELECT id, email FROM users WHERE email = $1',
  [email]
);

console.log('USER RESULT:', userResult.rows);

    if (userResult.rows.length === 0) {
      return res.json({
        message:
          'If that email exists, a reset link has been generated.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const expires = new Date(
      Date.now() + 1000 * 60 * 60
    );

    await pool.query(
      `UPDATE users
       SET reset_token = $1,
           reset_token_expires = $2
       WHERE email = $3`,
      [resetToken, expires, email]
    );

    const resetLink =
  `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

await resend.emails.send({
  from: 'CareerPilot <onboarding@resend.dev>',
  to: email,
  subject: 'Reset your CareerPilot password',
  html: `
    <h2>Reset Your Password</h2>

    <p>Click the button below to reset your password.</p>

    <a
      href="${resetLink}"
      style="
        background:#2563eb;
        color:white;
        padding:12px 20px;
        text-decoration:none;
        border-radius:8px;
      "
    >
      Reset Password
    </a>

    <p>This link expires in 1 hour.</p>
  `
});

return res.json({
  message: 'Password reset email sent.'
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Failed to generate reset token'
    });
  }
});
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      message: 'Token and password are required'
    });
  }

  try {
    const result = await pool.query(
      `SELECT id
       FROM users
       WHERE reset_token = $1
       AND reset_token_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: 'Invalid or expired token'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           reset_token = NULL,
           reset_token_expires = NULL
       WHERE id = $2`,
      [passwordHash, result.rows[0].id]
    );

    return res.json({
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Password reset failed'
    });
  }
});
export default router;
