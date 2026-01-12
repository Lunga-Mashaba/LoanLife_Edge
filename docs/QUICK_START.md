# Quick Start Guide

## Running Locally

### Step 1: Install Dependencies

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

**Blockchain (optional):**
```bash
cd services/blockchain
npm install
cd api
npm install
```

### Step 2: Start Services

**Option A: Use the Script (Easiest)**

Windows:
```powershell
.\scripts\start-all.ps1
```

Mac/Linux:
```bash
chmod +x scripts/start-all.sh
./scripts/start-all.sh
```

**Option B: Manual Start**

Terminal 1 - Blockchain Node:
```bash
cd services/blockchain
npx hardhat node
```

Terminal 2 - Blockchain API:
```bash
cd services/blockchain/api
npm start
```

Terminal 3 - Backend API:
```bash
cd services/api
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux

# Set environment variables
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

### Step 3: Open the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Blockchain API: http://localhost:3001

---

## Deploying to Free Platforms

### Deploy Backend to Render

1. **Push code to GitHub** (if not already there)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Go to Render.com**
   - Sign up/login with GitHub
   - Click "New +" → "Web Service"

3. **Connect Repository**
   - Select your GitHub repo
   - Click "Connect"

4. **Configure Service**
   - **Name:** `loanlife-api` (or whatever you want)
   - **Root Directory:** `services/api`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

5. **Add Environment Variables**
   Click "Environment" tab and add:
   ```
   SEED_DATA=false
   BLOCKCHAIN_ENABLED=false
   ```
   (Render sets `PORT` automatically, don't add it)

6. **Deploy**
   - Click "Create Web Service"
   - Wait 3-5 minutes for build
   - Copy your URL: `https://loanlife-api.onrender.com`

**Important:** Free tier spins down after 15min. First request after that takes ~30 seconds.

---

### Deploy Frontend to Vercel

1. **Go to Vercel.com**
   - Sign up/login with GitHub
   - Click "New Project"

2. **Import Repository**
   - Select your GitHub repo
   - Click "Import"

3. **Configure Project**
   - Framework: Vercel auto-detects Next.js ✅
   - Root Directory: `./` (leave default)
   - Build Command: Leave default
   - Output Directory: Leave default

4. **Add Environment Variable**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_API_URL=https://loanlife-api.onrender.com
   ```
   (Replace with your actual Render backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Copy your URL: `https://your-project.vercel.app`

---

### Update Backend CORS (Important!)

After deploying frontend, update CORS in `services/api/app/main.py`:

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

Then commit and push:
```bash
git add services/api/app/main.py
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-redeploy.

---

## Testing Your Deployment

1. **Check Backend**
   - Visit: `https://your-backend.onrender.com/health`
   - Should see: `{"status": "healthy", ...}`

2. **Check Frontend**
   - Visit: `https://your-project.vercel.app`
   - Open browser console (F12)
   - Check for any API errors
   - Should see loans loading (if you had seed data)

3. **Test API Connection**
   - Frontend should be calling backend API
   - Check Network tab in browser DevTools
   - API requests should go to your Render URL

---

## Troubleshooting

### Backend won't start on Render
- Check build logs in Render dashboard
- Make sure `requirements.txt` is in `services/api/`
- Verify start command uses `$PORT`

### Frontend can't connect to backend
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Make sure backend URL is correct (no trailing slash)
- Check CORS settings in backend
- Check browser console for CORS errors

### Backend is slow on first request
- Free tier spins down after 15min inactivity
- First request takes ~30 seconds to wake up
- This is normal for free tier

### Need to update environment variables
- Render: Dashboard → Your Service → Environment → Edit
- Vercel: Dashboard → Your Project → Settings → Environment Variables
- Changes require redeploy (usually automatic)

---

## Quick Reference

**Local URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**Deployment URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-api.onrender.com`

**Environment Variables:**

Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
```

Backend (Render):
```
SEED_DATA=false
BLOCKCHAIN_ENABLED=false
```

---

That's it! Your app should be live. 🚀
