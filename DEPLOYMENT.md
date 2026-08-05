# Follow Up - Deployment & Configuration Guide

This guide covers deployment to **GitHub**, **Render**, and **Hostinger Custom Subdomain** setup.

---

## 1. Push to GitHub Repository
1. Initialize Git in your project folder (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Follow Up PWA"
   ```
2. Create a new repository on [GitHub](https://github.com/new) named `follow-up-app`.
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/follow-up-app.git
   git branch -M main
   git push -u origin main
   ```

---

## 2. Deploy on Render (Static Site Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **Static Site** (or Web Service if deploying Node backend).
3. Connect your GitHub repository `follow-up-app`.
4. Configure Build & Publish Settings:
   - **Name:** `follow-up`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
5. Click **Create Static Site**. Render will build and host your PWA with HTTPS.

---

## 3. Custom Subdomain Setup on Hostinger
1. Log in to your **Hostinger Control Panel (hPanel)**.
2. Go to **Domains** -> Select your domain (e.g. `yourdomain.com`).
3. Open **DNS / Name Servers** zone manager.
4. Add a new DNS Record:
   - **Type:** `CNAME`
   - **Name / Host:** `followup` (for subdomain `followup.yourdomain.com`)
   - **Target / Value:** `follow-up.onrender.com` (your Render site address)
   - **TTL:** `3600`
5. Save the record.
6. In **Render Dashboard**:
   - Go to your site Settings -> **Custom Domains**.
   - Click **Add Custom Domain** and type `followup.yourdomain.com`.
   - Render will verify the CNAME record and issue a free SSL certificate automatically within a few minutes.

---

## 4. Supabase Setup
1. Create a project on [Supabase](https://supabase.com).
2. Navigate to **SQL Editor** and paste the content of `supabase_schema.sql`.
3. Copy your **Project URL** and **Anon Key** from **Project Settings -> API**.
4. In your Follow Up app Settings, input these credentials to switch from local mode to live Supabase cloud sync!
