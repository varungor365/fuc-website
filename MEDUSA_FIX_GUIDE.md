# 🔧 Medusa Backend Fix Guide

## Problem
- Medusa backend crashing (321 restarts)
- Error: "Could not find index.html in the admin build directory"
- 502 Bad Gateway error

## Solution

### On Your Server (SSH):

```bash
# 1. Stop the crashing process
pm2 stop medusa-backend

# 2. Navigate to backend directory
cd ~/fashun-backend

# 3. Build the backend (IMPORTANT!)
npx medusa build

# 4. Restart the application
pm2 restart medusa-backend

# 5. Check status
pm2 status medusa-backend
pm2 logs medusa-backend
```

### Or Use the Fix Script:

```bash
# Upload fix-medusa-backend.sh to server
scp fix-medusa-backend.sh user@your-server:~/

# SSH into server
ssh user@your-server

# Run the fix script
chmod +x fix-medusa-backend.sh
./fix-medusa-backend.sh
```

## Expected Result

After running `medusa build`, you should see:
```
✅ Backend build completed successfully
✅ Admin build completed successfully
```

After `pm2 restart`, you should see:
```
[medusa-backend] Server is listening on port 9000
```

## Verify It's Working

```bash
# Check if backend is responding
curl http://localhost:9000/health

# Should return: {"status":"ok"}
```

## Access Admin Panel

Once fixed, access at:
- **Backend API**: `http://your-server-ip:9000`
- **Admin Panel**: `http://your-server-ip:9000/app`

## If Still Not Working

```bash
# Check logs for errors
pm2 logs medusa-backend --lines 50

# Restart pm2
pm2 restart all

# Or delete and recreate
pm2 delete medusa-backend
cd ~/fashun-backend
pm2 start npm --name "medusa-backend" -- start
```

---

**Status**: Ready to fix! Run the commands on your server.
