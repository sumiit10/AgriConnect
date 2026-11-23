# AgriConnect REST API reference

All API responses are JSON unless stated otherwise. Authentication uses an HTTP-only session cookie named `agriconnect.sid`. In local development, use the Vite app at `http://localhost:5173` so its `/api` proxy forwards requests to Express on port `3000`.

## Health and authentication

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | App and database health |
| GET | `/api/auth/me` | Public | Return the current session user or `null` |
| POST | `/api/auth/register` | Public, rate-limited | Create owner/renter account |
| POST | `/api/auth/login` | Public, rate-limited | Start a session |
| POST | `/api/auth/logout` | Logged in | End the session |
| PATCH | `/api/auth/profile` | Logged in | Update name, phone and location |

### Registration body

```json
{
  "name": "Asha Patil",
  "email": "asha@example.com",
  "phone": "9876543210",
  "location": "Pune",
  "role": "renter",
  "password": "StrongPass123",
  "confirmPassword": "StrongPass123"
}
```

## Equipment

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/equipment` | Public | List equipment; supports `search`, `category`, `location`, `sort` query parameters |
| GET | `/api/equipment/:id` | Public | Equipment details |
| GET | `/api/equipment/mine` | Owner | Current owner's listings |
| POST | `/api/equipment` | Owner | Create listing |
| PUT | `/api/equipment/:id` | Owner, own listing | Update listing |
| DELETE | `/api/equipment/:id` | Owner, own listing | Delete listing if no pending/accepted rentals |

Equipment JSON fields: `name`, `category`, `location`, `price`, `brand`, `condition`, `fuel`, `icon`, `description`, `imageUrl`, `imagePublicId`.

Allowed categories: `Tractor`, `Cultivator`, `Irrigation`, `Harvester`, `Sprayer`, `Other Tools`. Condition: `Excellent`, `Good`, `Fair`.

Sort values: `price-asc`, `price-desc`, `name`, `newest`.

## Images

| Method | Endpoint | Access | Content type | Purpose |
|---|---|---|---|---|
| POST | `/api/uploads/equipment-image` | Owner | `multipart/form-data` | Upload one image to Cloudinary |

The multipart field name must be `image`. Allowed formats are JPG, PNG and WebP; maximum file size is 5 MB. If Cloudinary is not configured, paste a public HTTPS image URL into the equipment form instead.

## Rentals

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/api/rentals` | Logged in | Submit a rental request |
| GET | `/api/rentals/mine` | Logged in | Return requests sent and received by current user |
| PATCH | `/api/rentals/:id/status` | Owner/renter depending on action | Accept, reject or cancel a pending request |

Rental creation body:

```json
{
  "equipmentId": "MongoDB equipment ObjectId",
  "startDate": "2026-12-01",
  "endDate": "2026-12-03"
}
```

Status update body:

```json
{ "status": "Accepted" }
```

Allowed transitions from `Pending`: owner may set `Accepted` or `Rejected`; renter may set `Cancelled`. Accepted date ranges cannot overlap for the same equipment. The total is calculated on the server using inclusive calendar days.

## Common response codes

- `200`: request completed.
- `201`: resource created.
- `400`: invalid input or validation error.
- `401`: login required or incorrect credentials.
- `403`: authenticated user does not have permission.
- `404`: resource not found.
- `409`: duplicate email, overlapping booking or conflicting operation.
- `500`: unexpected server error.
