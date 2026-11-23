# Deployment guide (Render + MongoDB Atlas + Cloudinary)

This repository is configured as a single Express web service. Render builds the Vite React app and Express serves the production `client/dist` directory from the same origin. This keeps session cookies straightforward and avoids a separate CORS configuration.

## Before deployment

1. Push the project to GitHub (do not commit `.env`, Atlas credentials, Cloudinary secrets or local legacy JSON data).
2. Confirm your Atlas Network Access list permits the deployment service's outbound IP ranges. Add the ranges shown in the hosting provider's dashboard. Avoid a permanent `0.0.0.0/0` rule.
3. Create the Cloudinary account and credentials if you want direct image uploads.
4. Confirm the app works locally using the steps in the root README.

## Render setup

1. Open [Render](https://render.com/) and create a **New → Web Service**.
2. Connect the GitHub repository containing `AgriConnect_MERN`.
3. Set the root directory to `AgriConnect_MERN` if this project is inside a larger repository; otherwise leave it blank.
4. Set **Build Command** to:

   ```bash
   npm install && npm install --prefix client && npm run build
   ```

5. Set **Start Command** to:

   ```bash
   npm start
   ```

6. Set the health check path to `/api/health`.
7. Add environment variables in Render:

   - `NODE_ENV` = `production`
   - `MONGODB_URI` = your Atlas SRV connection string ending with `/agriconnect?...`
   - `SESSION_SECRET` = a long random secret (at least 32 characters)
   - `TRUST_PROXY` = `1`
   - `CLOUDINARY_CLOUD_NAME` = your cloud name (optional if using image URLs only)
   - `CLOUDINARY_API_KEY` = your API key (optional if using image URLs only)
   - `CLOUDINARY_API_SECRET` = your API secret (optional if using image URLs only)

8. Deploy. Open `https://YOUR-SERVICE.onrender.com/api/health` and confirm `status` and `database` are both `ok` / `connected`.
9. Open the service URL and test registration, login, listings, image upload, rental requests and owner decisions.

## Production checklist

- Store secrets only in host environment variables.
- Keep Atlas database credentials private and use a database user with only required privileges.
- Restrict Atlas Network Access to the machine and deployment addresses needed.
- Keep `SESSION_SECRET` stable between deployments so active sessions are not invalidated on every restart.
- Use HTTPS (Render provides it) and keep `NODE_ENV=production`.
- Check logs after deployment and test `/api/health`.
- Do not assume local development data was automatically copied to Atlas; use `npm run migrate:legacy` from a machine with the legacy files and Atlas access.
