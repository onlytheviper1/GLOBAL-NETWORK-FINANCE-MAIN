# Installation & Setup Guide

## System Requirements

- Node.js v18+ (Download from https://nodejs.org/)
- MongoDB (Local, Atlas, or other service)
- npm or yarn
- Git

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/onlytheviper1/GLOBAL-NETWORK-FINANCE-MAIN.git
cd GLOBAL-NETWORK-FINANCE-MAIN
```

### 2. Install Root Dependencies

```bash
npm install
```

This installs `concurrently` which allows running both frontend and backend simultaneously.

### 3. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Server from https://docs.mongodb.com/manual/installation/
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get your connection string
5. Keep the connection string safe

### 4. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gnf
JWT_SECRET=your-super-secret-key-change-this-in-production
NODE_ENV=development
```

**For MongoDB Atlas**, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gnf?retryWrites=true&w=majority
```

### 5. Setup Frontend

```bash
cd ../frontend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

The default `.env` is already configured for local development.

### 6. Start Development Servers

From the root directory:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

Or start them separately:

```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

## Verify Installation

### Check Backend
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{ "status": "API is running" }
```

### Check Frontend
Open http://localhost:3000 in your browser

You should see the Global Network Finance home page with the hero section and features grid.

## Initial Setup Tasks

### 1. Create Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

### 2. Upgrade to Admin Role

Open MongoDB compass or your MongoDB client and run:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### 3. Login and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-secure-password"
  }'
```

Save the returned token for managing content.

## Common Issues

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Change frontend port in frontend/vite.config.js
# Change backend port in .env

# Or kill existing process
# On macOS/Linux:
lsof -ti:3000,5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

```
MongooseError: Cannot connect to database
```

- Check MongoDB is running: `mongod` (local) or verify Atlas connection string
- Check `.env` MONGODB_URI is correct
- Verify firewall settings (for remote databases)

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working

Make sure you're running `npm run dev` not `npm start`

## Next Steps

1. Read [CMS_BACKEND_GUIDE.md](./CMS_BACKEND_GUIDE.md) for content management
2. Create your first content article
3. Customize the frontend to match your brand
4. Set up user roles for your team
5. Deploy to production

## Getting Help

- Check the [README.md](./README.md) for API documentation
- Review [CMS_BACKEND_GUIDE.md](./CMS_BACKEND_GUIDE.md) for backend operations
- Check server logs: `npm run dev` output
- Verify environment variables in `.env` files
