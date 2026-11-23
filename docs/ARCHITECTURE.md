# AgriConnect architecture

## Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React 18, Vite, React Router | Pages, forms, routing, state and UI |
| Styling | CSS | Responsive layout and components |
| API | Node.js, Express 5 | REST endpoints and business rules |
| Database | MongoDB Atlas | Cloud document database |
| ODM | Mongoose | Schemas, validation, references and queries |
| Authentication | bcryptjs + express-session | Password hashing and cookie-based sessions |
| Session persistence | connect-mongo | Stores sessions in Atlas |
| Image storage | Cloudinary | Hosted equipment images |
| Security | Helmet, express-rate-limit | HTTP headers and auth rate limiting |

## Request flow

```text
Browser (React + React Router)
        |
        | fetch('/api/...') + HTTP-only session cookie
        v
Express REST API
        |
        +-- Authentication middleware
        +-- Owner authorization middleware
        +-- Controllers (business logic)
        |
        v
Mongoose models
        |
        +-- User collection
        +-- Equipment collection
        +-- Rental collection
        +-- Session collection (connect-mongo)
        |
        v
MongoDB Atlas

Image upload flow:
React file input -> Express/Multer -> Cloudinary -> image URL/public ID -> Equipment document in Atlas
```

## Main data relationships

- A **User** with role `owner` can publish many Equipment records.
- An **Equipment** record belongs to one owner.
- A **User** with role `renter` can create many Rental records.
- A **Rental** references one Equipment, one renter and one owner. It stores a snapshot of the equipment name, names and daily price so the rental record stays understandable if the listing is later edited.

## Rental status flow

```text
Pending -> Accepted
Pending -> Rejected
Pending -> Cancelled
```

Only the equipment owner can accept/reject. Only the renter who submitted the request can cancel. Accepted reservations are checked for overlapping dates before creation/acceptance. The acceptance path uses a MongoDB transaction; Atlas clusters support replica-set transaction behavior.

## Application folders

```text
AgriConnect_MERN/
├── backend/
│   ├── config/          # Atlas/Mongoose connection
│   ├── controllers/     # Request handlers and business logic
│   ├── middleware/      # Session and role checks
│   ├── models/          # Mongoose schemas
│   ├── routes/          # REST route definitions
│   ├── scripts/         # Seed and migration scripts
│   ├── utils/           # Validation, serialization, Cloudinary
│   └── server.js        # Express app and startup
├── client/
│   ├── src/components/  # Shared React components
│   ├── src/context/     # Authentication context
│   ├── src/pages/       # Screens/pages
│   ├── src/services/    # API client
│   └── src/utils/       # Client-side validation
├── docs/                # Setup, architecture, API, images and deployment
├── legacy-data/         # Private local-only JSON migration inputs
├── .env.example
└── package.json
```
