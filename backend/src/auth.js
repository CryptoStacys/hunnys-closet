import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './database.js';

const router = express.Router();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ? OR username = ?').get(email, username);
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = db.prepare(
      'INSERT INTO users (email, username, password_hash, profile_name) VALUES (?, ?, ?, ?)'
    ).run(email, username, passwordHash, username);

    const userId = result.lastInsertRowid;

    // Create user data entry
    db.prepare(
      'INSERT INTO user_data (user_id) VALUES (?)'
    ).run(userId);

    // Generate JWT token
    const token = jwt.sign({ userId, email, username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        email,
        username,
        profile_name: username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile_name: user.profile_name,
        profile_image_url: user.profile_image_url
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT u.*, ud.achievements, ud.tier, ud.titles, ud.cupcake_points, ud.level, ud.custom_data
      FROM users u
      LEFT JOIN user_data ud ON u.id = ud.user_id
      WHERE u.id = ?
    `).get(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password hash from response
    delete user.password_hash;

    // Parse JSON fields
    user.achievements = JSON.parse(user.achievements || '{}');
    user.titles = JSON.parse(user.titles || '[]');
    user.custom_data = JSON.parse(user.custom_data || '{}');

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { profile_name, profile_image_url } = req.body;

    const updates = [];
    const values = [];

    if (profile_name !== undefined) {
      updates.push('profile_name = ?');
      values.push(profile_name);
    }

    if (profile_image_url !== undefined) {
      updates.push('profile_image_url = ?');
      values.push(profile_image_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.userId);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.username = decoded.username;
    next();
  });
}

export { verifyToken };
export default router;
