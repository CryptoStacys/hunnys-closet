import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, '../data/users.json');

// Initialize database file if it doesn't exist
function initDB() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      userData: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readDB() {
  initDB();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function createUser(email, username, passwordHash, profileName) {
  const db = readDB();
  const id = db.users.length + 1;

  const user = {
    id,
    email,
    username,
    password_hash: passwordHash,
    profile_name: profileName || username,
    profile_image_url: '',
    created_at: new Date().toISOString()
  };

  const userData = {
    user_id: id,
    tier: 'Fresh Cupcake',
    level: 1,
    cupcake_points: 0,
    titles: JSON.stringify([]),
    achievements: JSON.stringify({})
  };

  db.users.push(user);
  db.userData.push(userData);
  writeDB(db);

  return { lastInsertRowid: id };
}

export function findUserByEmail(email) {
  const db = readDB();
  return db.users.find(user => user.email === email);
}

export function findUserByUsername(username) {
  const db = readDB();
  return db.users.find(user => user.username === username);
}

export function findUserById(id) {
  const db = readDB();
  const user = db.users.find(u => u.id === id);
  if (!user) return null;

  const userData = db.userData.find(ud => ud.user_id === id);

  return {
    ...user,
    tier: userData?.tier || 'Fresh Cupcake',
    level: userData?.level || 1,
    cupcake_points: userData?.cupcake_points || 0,
    titles: userData?.titles ? JSON.parse(userData.titles) : [],
    achievements: userData?.achievements ? JSON.parse(userData.achievements) : {}
  };
}

export function updateUserProfile(userId, updates) {
  const db = readDB();

  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;

  if (updates.profile_name !== undefined) {
    db.users[userIndex].profile_name = updates.profile_name;
  }
  if (updates.profile_image_url !== undefined) {
    db.users[userIndex].profile_image_url = updates.profile_image_url;
  }

  writeDB(db);
  return db.users[userIndex];
}
