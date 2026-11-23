# AgriConnect — Full-Stack MERN Agricultural Equipment Rental Platform

AgriConnect is a farmer-to-farmer marketplace for discovering, listing and renting agricultural equipment. This project upgrades the earlier Node/Express + JSON-file version into a structured full-stack application using **React, Node.js, Express, MongoDB Atlas, Mongoose and Cloudinary**.

## 1. Features

### Accounts and authentication
- Register as an **equipment owner** or **farmer/renter**.
- Login and logout using an HTTP-only session cookie.
- Password hashing with bcryptjs.
- Session persistence in MongoDB Atlas through `connect-mongo`.
- Role-based access: only owners can publish/manage equipment; signed-in users can submit rental requests.
- Profile page to update name, mobile number and location.
- Rate limiting on registration and login routes.

### Equipment marketplace
- Browse available equipment.
- Search by name, brand, description or location.
- Filter by category and location.
- Sort by price, name or newest listing.
- View full equipment details and owner information.
- Owners can add, edit and delete their own equipment.
- Equipment fields include category, location, daily rate, brand/power, condition, fuel/type, description and photograph.
- Equipment photographs can be uploaded to Cloudinary or referenced through a public HTTPS image URL.

### Rental workflow
- Select start and end dates.
- Calculate inclusive rental days and estimated total amount.
- Submit a rental request to the equipment owner.
- Owner can accept or reject a pending request.
- Renter can cancel their own pending request.
- Both sides can view requests they sent or received.
- Prevent booking dates from overlapping with another accepted rental.
- Prevent users from renting their own equipment.
- Prevent deletion of equipment that has pending or accepted rental requests.

### Database and backend
- MongoDB Atlas cloud database.
- Mongoose schemas and references for users, equipment and rentals.
- Modular Express routes, controllers, middleware and utility modules.
- Server-side validation and centralized error handling.
- Helmet security headers and authentication rate limiting.
- Persistent MongoDB-backed sessions.

## 2. Technology stack

| Area | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | CSS |
| Backend runtime | Node.js 20+ |
| Backend framework | Express 5 |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | express-session, bcryptjs, connect-mongo |
| Image storage | Cloudinary + Multer |
| Security | Helmet, express-rate-limit |
| Hosting setup | Render-ready single web service |

## 3. Project structure

```text
AgriConnect_MERN/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── equipmentController.js
│   │   └── rentalController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Equipment.js
│   │   └── Rental.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── equipmentRoutes.js
│   │   ├── rentalRoutes.js
│   │   └── uploadRoutes.js
│   ├── scripts/
│   │   ├── migrate-json-to-atlas.js
│   │   └── seed.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── serializers.js
│   │   └── validation.js
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── API_REFERENCE.md
│   ├── ARCHITECTURE.md
│   ├── ATLAS_SETUP.md
│   ├── DEPLOYMENT.md
│   └── IMAGE_SOURCES.md
├── legacy-data/          # Add old JSON data here only if migrating
├── .env.example
├── render.yaml
└── package.json
```

## 4. Requirements

- Node.js 20 or newer (Node 20 LTS recommended).
- npm.
- A MongoDB Atlas account and a database user with read/write access.
- A Cloudinary account only if you want to upload images from the form. You can alternatively paste a public HTTPS image URL.

MongoDB does **not** need to be installed on your computer. The application connects to Atlas over the internet.

## 5. MongoDB Atlas configuration

Read the complete guide in [`docs/ATLAS_SETUP.md`](docs/ATLAS_SETUP.md).

1. In MongoDB Atlas, open your cluster and create/select a database user with read/write access.
2. Under **Network Access**, allow your current public IP. For deployment, add the hosting provider's outbound IP ranges.
3. Choose **Database → Connect → Drivers → Node.js** and copy the SRV connection string.
4. Create a new database for this project by ending the URI path with `/agriconnect`.
5. Copy the root environment file and add the connection string.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Example URI format (replace the placeholders with your Atlas values):

```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=AgriConnect
```

URL-encode special characters in the database password. Do not share or commit `.env`.

## 6. Cloudinary image configuration (optional but recommended)

1. Create an account at [Cloudinary](https://cloudinary.com/).
2. Copy the Cloud name, API Key and API Secret from its dashboard.
3. Add them to the root `.env`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Image uploads accept JPG, PNG or WebP files up to 5 MB. The upload endpoint returns a secure image URL and Cloudinary public ID; the equipment record saves these fields in Atlas. The Cloudinary API secret stays on the backend and is never sent to React.

To find suitable photographs, see [`docs/IMAGE_SOURCES.md`](docs/IMAGE_SOURCES.md). Use only images you own or are permitted to use. The form also accepts a public HTTPS image URL.

## 7. Install and run locally

Open a terminal in the project root (`AgriConnect_MERN`).

### Install backend dependencies

```bash
npm install
```

### Install frontend dependencies

```bash
npm install --prefix client
```

### Configure environment

In your root `.env`, set at least:

```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=replace-this-with-a-random-secret-of-at-least-32-characters
MONGODB_URI=your_mongodb_atlas_uri
```

Generate a secret locally, for example with:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Paste the generated value as `SESSION_SECRET`.

### Start both frontend and backend

```bash
npm run dev
```

Open the React application:

```text
http://localhost:5173
```

The Express API runs at:

```text
http://localhost:3000
```

Vite proxies `/api` calls to Express, so the browser uses same-origin session cookies during development.

### Start services separately

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run client:dev
```

### Verify the Atlas connection

Open:

```text
http://localhost:3000/api/health
```

Expected response after a successful database connection:

```json
{
  "status": "ok",
  "application": "AgriConnect",
  "database": "connected"
}
```

## 8. Optional demo data

To create sample records in the Atlas database:

```bash
npm run seed
```

Demo accounts created by the seed script:

| Role | Email | Password |
|---|---|---|
| Equipment owner | `owner.demo@agriconnect.local` | `Demo@12345` |
| Farmer / renter | `renter.demo@agriconnect.local` | `Demo@12345` |

These are local/demo credentials. Change or remove them before using a public deployment. Run the seed script only against a database where you are comfortable adding these sample records.

## 9. Migrate your previous JSON records to Atlas (optional)

The migration script can import your previous AgriConnect JSON records and preserve the existing bcrypt password hashes.

1. Make a private backup of the old project's `data` folder.
2. Copy `users.json`, `equipment.json` and `rentals.json` into `legacy-data/` in this project.
3. Check that `.env` points to the correct `agriconnect` Atlas database.
4. Run:

```bash
npm run migrate:legacy
```

5. Check the imported documents in Atlas **Database → Browse Collections**.
6. Remove the local legacy JSON files after verifying the migration. They are gitignored because they contain account data and password hashes.

The migration script maps the old string IDs to MongoDB ObjectIds and creates references between users, equipment and rentals. Existing emails are matched rather than duplicated; legacy equipment and rentals use a migration ID to reduce accidental duplicate imports.

## 10. Build for production

```bash
npm run build
npm start
```

The build command creates `client/dist`. Express serves that React build and the REST API from the same origin. Set `NODE_ENV=production`, `MONGODB_URI`, a strong `SESSION_SECRET`, and `TRUST_PROXY=1` when deployed behind the trusted HTTPS proxy used by Render.

For the deployment steps and environment variables, see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). A Render blueprint is also included in `render.yaml`.

## 11. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health and database status |
| GET | `/api/auth/me` | Current session user |
| POST | `/api/auth/register` | Register owner/renter |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| PATCH | `/api/auth/profile` | Update profile |
| GET | `/api/equipment` | Search/filter/sort equipment |
| GET | `/api/equipment/:id` | Equipment details |
| GET | `/api/equipment/mine` | Owner's listings |
| POST | `/api/equipment` | Create equipment |
| PUT | `/api/equipment/:id` | Update own equipment |
| DELETE | `/api/equipment/:id` | Delete own equipment |
| POST | `/api/uploads/equipment-image` | Upload image to Cloudinary |
| POST | `/api/rentals` | Submit rental request |
| GET | `/api/rentals/mine` | Sent and received requests |
| PATCH | `/api/rentals/:id/status` | Accept/reject/cancel pending request |

See [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) for request fields, permissions and response codes.

## 12. Demo walkthrough

1. Run `npm run seed` if you want example records.
2. Log in as the demo equipment owner, or register your own owner account.
3. Open **My equipment** and add a listing. Upload an image after configuring Cloudinary, or paste a public HTTPS image URL.
4. Log out and sign in as the demo renter, or register a separate renter account.
5. Browse, search, filter and sort equipment.
6. Open a listing, select dates and send a rental request.
7. Sign in as the owner and open **My rentals & requests**. Accept or reject the pending request.
8. Sign in as the renter and inspect the status under **My rentals & requests**.
9. Open Atlas and verify the `users`, `equipment`, `rentals` and `sessions` collections.

## 13. Validation and testing notes

- Both React and Express validate incoming form values; backend validation is authoritative.
- Only owners can create/edit/delete equipment, and they can change only their own listings.
- Renters cannot submit requests for their own equipment.
- Date ranges are checked server-side and the rental total is recalculated on the server.
- Accepting a request checks for date conflicts in a MongoDB transaction.
- Image upload is checked for file type and size before Cloudinary upload.
- `npm run check` runs Node syntax checks for the backend modules.

**Verification note:** source-level syntax checks are included with this prepared project. A successful live run still requires installing dependencies, adding your own Atlas/Cloudinary credentials, and testing against your own Atlas cluster. This project has not been deployed to your accounts.

## 14. Features intentionally not included

The core marketplace, authentication, equipment CRUD, image hosting and rental lifecycle are included. These optional production features are not implemented yet:

- Online payments or payment gateway integration.
- Email/SMS OTP, account verification or password reset.
- Ratings and reviews.
- Live chat or WhatsApp automation.
- GPS maps and geospatial search.
- Automated notifications when a rental status changes.

These can be added as separate modules after the core MERN workflow is running reliably.
