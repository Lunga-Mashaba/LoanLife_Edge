# Deployment Guide - Free Hosting Options

This guide covers free deployment options for LoanLife Edge. Since this is a multi-service application (Next.js frontend, Python FastAPI backend, and blockchain services), we'll cover deployment strategies for each component.

## Overview

**Application Components:**
1. **Frontend**: Next.js web app (can be deployed as Electron desktop app)
2. **Backend API**: FastAPI (Python)
3. **Blockchain API Bridge**: Node.js/Express
4. **Blockchain Node**: Hardhat (optional for demo)

---

## Strategy 1: Web-Only Deployment (Recommended for Free Tier)

Deploy the web version of the app (skip Electron) for easiest free deployment.

### Frontend: Next.js on Vercel (Free Tier) ⭐ Recommended

**Why Vercel?**
- Free tier with generous limits
- Zero-config deployment for Next.js
- Automatic HTTPS and CDN
- Preview deployments for every PR
- Easy environment variable management

**Steps:**

1. **Prepare your code:**
   ```bash
   # Make sure all changes are committed
   git add .
   git commit -m "Prepare for deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

3. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js
   - Add environment variables (see below)
   - Click "Deploy"

4. **Environment Variables (in Vercel Dashboard):**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

**Free Tier Limits:**
- 100GB bandwidth/month
- Unlimited deployments
- Free SSL
- Custom domains

---

### Backend: FastAPI on Render (Free Tier) ⭐ Recommended

**Why Render?**
- Free tier available (spins down after inactivity)
- Easy PostgreSQL database (if needed later)
- Automatic HTTPS
- Simple deployment from GitHub

**Steps:**

1. **Prepare requirements.txt:**
   ```bash
   cd services/api
   # Verify requirements.txt exists and is up to date
   cat requirements.txt
   ```

2. **Create Render account:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Web Service"

3. **Configure service:**
   - Connect your GitHub repository
   - Set build command: `cd services/api && pip install -r requirements.txt`
   - Set start command: `cd services/api && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Set root directory: `services/api`
   - Set environment: `Python 3`
   - Add environment variables (see below)

4. **Environment Variables:**
   ```
   PORT=10000
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=true
   BLOCKCHAIN_API_URL=https://your-blockchain-api-url.com
   ```

**Alternative: Railway (Free Tier)**
- Similar to Render
- 500 hours/month free
- Go to [railway.app](https://railway.app)

**Alternative: Fly.io (Free Tier)**
- 3 shared-cpu VMs free
- More complex setup
- Go to [fly.io](https://fly.io)

---

### Blockchain API Bridge: Deploy on Render/Railway

**Option 1: Deploy separately (same as backend)**

1. Create another web service on Render
2. Root directory: `services/blockchain/api`
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables:
   ```
   PORT=10001
   HARDHAT_NETWORK_URL=http://localhost:8545  # For demo, can use local or external node
   ```

**Option 2: Combine with backend (simpler for demo)**

- Deploy blockchain API bridge as part of backend service
- Use process manager (PM2) to run both
- Not recommended for production, but works for demo

**Option 3: Skip for demo (use local blockchain)**

- For hackathon/demo, run blockchain locally
- Backend can work without blockchain (graceful fallback)

---

## Strategy 2: Full Stack on Single Service (Budget Option)

Deploy everything on one free service (more limitations, but simpler).

### Option A: Railway (All-in-One)

1. **Create Railway account:**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy backend:**
   - New Project → Deploy from GitHub
   - Select repository
   - Root directory: `services/api`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Deploy blockchain API:**
   - Add new service in same project
   - Root directory: `services/blockchain/api`
   - Build: `npm install`
   - Start: `npm start`

4. **Deploy frontend:**
   - Add new service
   - Root directory: root
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Environment: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

**Note:** Railway free tier: 500 hours/month, $5 credit (enough for demo)

---

## Strategy 3: Desktop App Deployment (Electron)

For distributing the Electron desktop app:

### Build Electron App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build for Windows:**
   ```bash
   npm run electron:pack
   ```

3. **Distribute:**
   - Windows: `.exe` installer in `dist/` folder
   - Upload to GitHub Releases (free)
   - Or use Electron Builder's auto-updater

### Host Installers

- **GitHub Releases** (Free):
  - Create a release on GitHub
  - Upload `.exe` (Windows) or `.dmg` (Mac) files
  - Users can download directly

- **Alternative: Self-host on GitHub Pages** (Free):
  - Use GitHub Actions to build
  - Upload artifacts to releases

---

## Recommended Setup for Hackathon/Demo

### Simplest Free Setup:

1. **Frontend → Vercel** (Free)
   - Fastest deployment
   - Best Next.js support

2. **Backend → Render** (Free)
   - Simple Python deployment
   - Automatic HTTPS

3. **Blockchain API → Render** (Free - separate service)
   - Or skip for demo (use local)

4. **Blockchain Node → Run locally or skip**
   - For demo, can use mock blockchain
   - Or use a free blockchain node service (Alchemy, Infura free tier)

---

## Step-by-Step: Deploy to Vercel + Render

### Step 1: Deploy Backend to Render

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repository
4. Settings:
   - **Name:** loanlife-api
   - **Root Directory:** `services/api`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Add environment variables:
   ```
   PORT=10000
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=false  # Set to true if deploying blockchain API
   ```
6. Click "Create Web Service"
7. Wait for deployment (2-5 minutes)
8. Copy the URL: `https://loanlife-api.onrender.com`

### Step 2: Deploy Frontend to Vercel

1. Go to vercel.com → New Project
2. Import your GitHub repository
3. Settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://loanlife-api.onrender.com
   ```
5. Click "Deploy"
6. Wait for deployment (1-2 minutes)
7. Copy the URL: `https://your-project.vercel.app`

### Step 3: Update Backend CORS (if needed)

If frontend is on different domain, update CORS in `services/api/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",
        "http://localhost:3000",  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Environment Variables Checklist

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Render/Railway)
```
PORT=10000  # Render sets this automatically
SEED_DATA=false
BLOCKCHAIN_ENABLED=false  # or true if deploying blockchain
BLOCKCHAIN_API_URL=https://your-blockchain-api-url.com  # if enabled
```

### Blockchain API (Render/Railway)
```
PORT=10001
NODE_ENV=production
```

---

## Free Tier Comparison

| Service | Free Tier | Limitations | Best For |
|---------|-----------|-------------|----------|
| **Vercel** | ✅ Unlimited | 100GB bandwidth/month | Frontend |
| **Render** | ✅ Free | Spins down after 15min inactivity | Backend, APIs |
| **Railway** | ✅ $5 credit | 500 hours/month | Full stack |
| **Fly.io** | ✅ 3 VMs | Shared CPU | Backend |
| **Netlify** | ✅ Free | 100GB bandwidth/month | Frontend (alternative) |

---

## Tips for Free Deployment

1. **Use Render's "Always On" option** (paid, but worth it for demo) or accept 15min spin-up delay
2. **Combine services** when possible to save resources
3. **Use environment variables** for all URLs (don't hardcode)
4. **Enable CORS properly** for cross-origin requests
5. **Test locally first** with production-like environment
6. **Monitor usage** to stay within free tier limits
7. **Use database addons** (Render PostgreSQL free tier) if needed

---

## Troubleshooting

### Backend doesn't start
- Check logs in Render dashboard
- Verify `requirements.txt` is correct
- Ensure port is set to `$PORT` (Render requirement)

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS is configured correctly
- Check backend logs for errors

### Services spin down (Render free tier)
- First request after 15min will be slow (~30s)
- Consider upgrading to paid tier for demo
- Or use Railway/Fly.io which have better free tiers

---

## Next Steps After Deployment

1. Test all endpoints
2. Verify frontend-backend connection
3. Test on mobile devices
4. Share deployment URLs with team
5. Set up monitoring (optional, free tier on Sentry)

---

## Quick Commands Reference

```bash
# Deploy frontend (Vercel CLI)
npm i -g vercel
vercel

# Deploy backend (Render CLI)
npm i -g render-cli
render deploy

# Build Electron app
npm run electron:pack
```

---

**Recommendation for Hackathon:** Use Vercel (frontend) + Render (backend) for fastest, easiest free deployment! 🚀
