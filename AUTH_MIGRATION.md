# Authentication Migration: Blockchain to Standard Login

This document describes the migration from blockchain wallet authentication to standard email/password authentication.

## Overview

The application has been simplified to use traditional email/password authentication instead of blockchain wallets. All blockchain dependencies have been removed, including:

- Coinbase WaaS SDK
- RainbowKit
- Wagmi
- Ethers.js
- Web3.js
- WordPress API integration

## New Authentication System

### Backend

**Technology Stack:**
- SQLite database for user storage
- JWT (JSON Web Tokens) for session management
- bcrypt for password hashing
- Express.js API

**Database Schema:**

```sql
-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  profile_name TEXT,
  profile_image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User data table
CREATE TABLE user_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievements TEXT DEFAULT '{}',
  tier TEXT DEFAULT 'Fresh Cupcake',
  titles TEXT DEFAULT '[]',
  cupcake_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  custom_data TEXT DEFAULT '{}',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**API Endpoints:**

- `POST /auth/register` - Register a new user
  - Body: `{ email, username, password }`
  - Returns: `{ token, user, message }`

- `POST /auth/login` - Login existing user
  - Body: `{ email, password }`
  - Returns: `{ token, user, message }`

- `GET /auth/me` - Get current user profile (requires JWT token)
  - Header: `Authorization: Bearer <token>`
  - Returns: `{ user }`

- `PUT /auth/profile` - Update user profile (requires JWT token)
  - Header: `Authorization: Bearer <token>`
  - Body: `{ profile_name?, profile_image_url? }`
  - Returns: `{ message }`

### Frontend

**Technology Stack:**
- React Context API for auth state management
- Axios for API requests
- LocalStorage for JWT token persistence

**Key Files:**

- `/frontend/src/services/authService.ts` - Authentication service
- `/frontend/src/hooks/useAuth.tsx` - Auth context and hook
- `/frontend/src/components/Login/Login.tsx` - Login/Register form
- `/frontend/pages/_app.tsx` - App wrapper with AuthProvider
- `/frontend/pages/index.tsx` - Main app with auth guard

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and set JWT_SECRET to a secure random string
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The backend will start on `http://localhost:8081`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   # Verify NEXT_PUBLIC_API_URL points to your backend
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:3000`

## Usage

### User Registration

1. Navigate to `http://localhost:3000`
2. Click "Don't have an account? Register"
3. Fill in:
   - Email address
   - Username
   - Password (minimum 6 characters)
   - Confirm password
4. Click "Create Account"
5. You'll be automatically logged in

### User Login

1. Navigate to `http://localhost:3000`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the Dashboard

### Logout

1. Click on your username in the top navigation bar
2. Click "Logout" from the dropdown menu

## What Was Removed

### Dependencies Removed:

**Frontend:**
- `@coinbase/cbpay-js`
- `@coinbase/waas-sdk-*` (all WaaS packages)
- `@rainbow-me/rainbowkit`
- `@openzeppelin/defender-relay-client`
- `wagmi`
- `viem`
- `ethers`
- `aws-cli-js`
- `aws-sdk`

**Backend:**
- `web3`
- `ethers`
- `@openzeppelin/defender-relay-client`
- `ethereum-checksum-address`
- `canvas`
- `fabric`
- `aws-cli-js`

### Files Removed/Simplified:

- Wallet connection logic
- WordPress API integration
- NFT contract interactions
- Blockchain balance fetching
- Gasless transaction relaying

## What Was Kept

The following features are still available:

- ✅ User profiles
- ✅ Achievements system
- ✅ Gamification (levels, points, tiers)
- ✅ Dashboard navigation
- ✅ Inventory management
- ✅ Dolly editor
- ✅ UI components and styling

## Security Considerations

1. **JWT Secret:** Change the JWT_SECRET in production to a strong random string
2. **HTTPS:** Use HTTPS in production for encrypted communication
3. **Password Policy:** Current minimum is 6 characters, consider increasing for production
4. **Rate Limiting:** Consider adding rate limiting to prevent brute force attacks
5. **Email Verification:** Consider adding email verification for new accounts

## Database Backup

The SQLite database is stored at `/backend/data/users.db`. To backup:

```bash
cp backend/data/users.db backend/data/users.db.backup
```

## Future Enhancements

Potential improvements for the authentication system:

1. Email verification for new accounts
2. Password reset functionality
3. Two-factor authentication (2FA)
4. OAuth integration (Google, GitHub, etc.)
5. Session management (view active sessions, logout from all devices)
6. Account deletion
7. Profile picture upload
8. Password strength meter

## Troubleshooting

### Backend won't start
- Check that port 8081 is not already in use
- Verify all dependencies are installed (`npm install`)
- Check the console for error messages

### Frontend shows connection errors
- Verify backend is running on port 8081
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for CORS errors

### Can't login
- Verify you registered with the correct email
- Passwords are case-sensitive
- Check backend console for error logs

### Database errors
- Database is created automatically on first run
- If corrupted, delete `backend/data/users.db` and restart server
- Make sure the `backend/data` directory exists

## Contact

For issues or questions, please create an issue in the repository.
