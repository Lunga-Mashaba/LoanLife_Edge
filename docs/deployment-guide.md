# Deployment Guide

Want to put this online? Here's how to do it for free. We've got multiple services (frontend, backend, blockchain), so we deploy them separately.

**What needs deploying:**
1. Frontend (Next.js) - the UI
2. Backend API (Python FastAPI) - does the work
3. Blockchain API bridge (Node.js) - talks to blockchain
4. Blockchain node (Hardhat) - optional, skip for demo

## Simplest Approach: Just the Web Version

Skip the Electron desktop app for now. The web version is way easier to deploy.

### Frontend: Vercel

Vercel is perfect for Next.js. It's free, auto-detects everything, and just works.

**Steps:**

1. Push code to GitHub (if you haven't already)

2. Go to vercel.com, sign up with GitHub

3. Click "New Project" and import your repo

4. Vercel auto-detects Next.js, so leave defaults

5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

6. Click deploy, wait 2 minutes

Done. You get 100GB bandwidth/month free, which is plenty for demos.

---

### Backend: Render

Render has a free tier that works fine. It spins down after 15 minutes of no traffic, but that's okay for demos.

**Steps:**

1. Go to render.com, sign up with GitHub

2. Click "New +" → "Web Service"

3. Connect your GitHub repo

4. Settings:
   - Root Directory: `services/api`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3

5. Environment variables:
   ```
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=false
   ```

6. Deploy and wait ~5 minutes

**Note:** Free tier spins down after 15min. First request takes ~30 seconds to wake up. Annoying but free.

Railway or Fly.io work too, but Render is the simplest.

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

## Alternative: Deploy Everything on Railway

You can deploy everything on Railway if you want it all in one place. More limitations, but simpler.

**Steps:**

1. Go to railway.app, sign up with GitHub

2. Deploy backend:
   - New Project → Deploy from GitHub
   - Select repository
   - Root directory: `services/api`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. Deploy blockchain API:
   - Add new service in same project
   - Root directory: `services/blockchain/api`
   - Build: `npm install`
   - Start: `npm start`

4. Deploy frontend:
   - Add new service
   - Root directory: root
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Environment: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

Railway free tier: 500 hours/month, $5 credit (enough for demo)

---

## Desktop App (Electron)

For distributing the Electron desktop app:

**Build:**
```bash
npm install
npm run electron:pack
```

This creates `.exe` (Windows) or `.dmg` (Mac) installers in the `dist/` folder.

**Distribute:**
- Upload to GitHub Releases (free)
- Or use Electron Builder's auto-updater

---

## What We'd Do for a Demo

1. Frontend on Vercel - Takes 2 minutes, works perfectly
2. Backend on Render - Takes 5 minutes, works fine
3. Skip blockchain API - Just set `BLOCKCHAIN_ENABLED=false` in backend. Works without it.
4. Skip blockchain node - Not needed for demo

Total time: ~10 minutes. Total cost: $0.

---

## Step-by-Step: Vercel + Render

**Step 1: Deploy Backend to Render**

1. Push code to GitHub
2. Go to render.com → New Web Service
3. Connect repository
4. Settings:
   - Name: loanlife-api
   - Root Directory: `services/api`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free
5. Add environment variables:
   ```
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=false
   ```
6. Click "Create Web Service"
7. Wait 2-5 minutes
8. Copy the URL: `https://loanlife-api.onrender.com`

**Step 2: Deploy Frontend to Vercel**

1. Go to vercel.com → New Project
2. Import your GitHub repository
3. Vercel auto-detects Next.js, so leave defaults
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://loanlife-api.onrender.com
   ```
5. Click "Deploy"
6. Wait 1-2 minutes
7. Copy the URL: `https://your-project.vercel.app`

**Step 3: Update CORS**

Update CORS in `services/api/app/main.py`:

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

**Recommendation:** Use Vercel (frontend) + Render (backend) for fastest, easiest free deployment.
