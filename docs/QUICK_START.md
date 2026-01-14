# Quick Start

Getting this running locally is pretty straightforward. Here's what you need to do.

## Install Everything

First, install the dependencies:

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd services/api
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

**Blockchain (optional, but nice to have):**
```bash
cd services/blockchain
npm install
cd api
npm install
```

## Start the Services

You've got two options here.

**Easiest way - use the script:**

Windows:
```powershell
.\scripts\start-all.ps1
```

Mac/Linux:
```bash
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

**Or do it manually (if you want more control):**

Open 4 terminals:

Terminal 1 - Blockchain node:
```bash
cd services/blockchain
npx hardhat node
```

Terminal 2 - Blockchain API:
```bash
cd services/blockchain/api
npm start
```

Terminal 3 - Backend:
```bash
cd services/api
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux

# Set these env vars
$env:SEED_DATA="true"  # Windows PowerShell
$env:BLOCKCHAIN_ENABLED="true"
$env:BLOCKCHAIN_API_URL="http://localhost:3001"

# Mac/Linux:
export SEED_DATA=true
export BLOCKCHAIN_ENABLED=true
export BLOCKCHAIN_API_URL=http://localhost:3001

uvicorn app.main:app --reload
```

Terminal 4 - Frontend:
```bash
npm run dev
```

## Open It Up

Once everything's running:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs
- Blockchain API: http://localhost:3001

---

## Deploying (Free Options)

We're using Render for the backend and Vercel for the frontend. Both have free tiers that work fine for demos.

### Backend on Render

First, make sure your code is on GitHub:
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

Then:
1. Go to render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your repo
4. Fill in these settings:
   - Name: `loanlife-api` (or whatever)
   - Root Directory: `services/api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Plan: Free
5. Add environment variables (click "Environment" tab):
   ```
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=false
   ```
   (Don't add PORT - Render sets that automatically)
6. Click "Create Web Service" and wait 3-5 minutes
7. Copy your URL when it's done: `https://loanlife-api.onrender.com`

**Note:** The free tier spins down after 15 minutes of no traffic. First request after that takes about 30 seconds to wake up. It's annoying but free.

---

### Frontend on Vercel

1. Go to vercel.com and sign up with GitHub
2. Click "New Project" and import your repo
3. Vercel will detect Next.js automatically, so leave the defaults
4. Add this environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://loanlife-api.onrender.com
   ```
   (Use your actual Render backend URL)
5. Click "Deploy" and wait 1-2 minutes
6. Copy your URL: `https://your-project.vercel.app`

### Fix CORS (Do This After Frontend Deploys)

Once your frontend is live, you need to update CORS in the backend. Edit `services/api/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-project.vercel.app",  # Your Vercel URL
        "http://localhost:3000",  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Then push the change:
```bash
git add services/api/app/main.py
git commit -m "Update CORS for production"
git push origin main
```

Render will redeploy automatically.

## Testing

**Backend:**
- Visit `https://your-backend.onrender.com/health`
- Should return `{"status": "healthy", ...}`

**Frontend:**
- Visit your Vercel URL
- Open browser console (F12) and check for errors
- Should see loans loading if you had seed data

**Connection:**
- Check the Network tab in DevTools
- API requests should go to your Render URL

## Common Issues

**Backend won't start:**
- Check build logs in Render
- Make sure `requirements.txt` is in `services/api/`
- Start command must use `$PORT`

**Frontend can't connect:**
- Check `NEXT_PUBLIC_API_URL` in Vercel
- Make sure backend URL is correct (no trailing slash)
- Check CORS settings
- Look for CORS errors in browser console

**Slow first request:**
- Free tier spins down after 15min
- First request takes ~30 seconds
- This is normal, just wait it out

**Update env vars:**
- Render: Dashboard → Service → Environment → Edit
- Vercel: Dashboard → Project → Settings → Environment Variables
- Changes auto-redeploy

## Quick Reference

**Local:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs

**Deployed:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-api.onrender.com`

**Env vars:**

Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

Backend (Render):
```
SEED_DATA=false
BLOCKCHAIN_ENABLED=false
```

That's it. Should be working now.
