# MongoDB Atlas setup for AgriConnect

AgriConnect uses MongoDB Atlas (cloud MongoDB) with Mongoose. You do not need to install MongoDB locally.

## 1. Use your Atlas cluster

You can use an existing Atlas cluster and create a separate database named `agriconnect`. Keeping Student CRUD and AgriConnect in separate databases avoids mixing their collections.

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Open your project and cluster.
3. In **Database Access**, create or select a database user. Give it read/write access to the `agriconnect` database (or the read/write role required for your academic project).
4. In **Network Access**, add the public IP address of the computer from which you will run the app. For a deployment host, add the outbound IP ranges listed by that host. Do not leave `0.0.0.0/0` enabled for a real deployment.
5. Open **Database → Connect → Drivers** and choose Node.js. Copy the SRV connection string.

## 2. Add the URI to the project

In the project root, copy `.env.example` to `.env` and replace the URI placeholders. Example format:

```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_CLUSTER.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=AgriConnect
```

Replace `YOUR_DB_USER`, `YOUR_DB_PASSWORD`, and `YOUR_CLUSTER` with values from Atlas. URL-encode special characters in the database password. Never commit `.env` to GitHub.

The database and collections are created by MongoDB/Mongoose when the application first writes data. The app uses these collections:

- `users`
- `equipment`
- `rentals`
- `sessions` (managed by connect-mongo)

## 3. Verify the connection

Start the app using the root instructions in `README.md`. Open:

```text
http://localhost:3000/api/health
```

A successful response includes `"status":"ok"` and `"database":"connected"`. You can also open Atlas **Database → Browse Collections** and inspect the `agriconnect` database.

## 4. Atlas connection troubleshooting

- **Authentication failed:** check the Database Access username/password, not your Atlas website login.
- **IP not allowed:** add the current machine's public IP in Network Access. If hosted, allow the deployment provider's outbound IP ranges.
- **DNS / `querySrv ECONNREFUSED`:** try another network or DNS resolver (for example, a trusted public DNS resolver) and re-test the SRV record. This is a DNS/network issue, not a Mongoose schema issue.
- **Password contains symbols:** URL-encode reserved characters before placing the password in the URI.
- **Wrong database:** make sure the URI path ends with `/agriconnect`.

## Reusing the cluster from your Student CRUD API work

You previously configured a cluster whose hostname was `student-crud-cluster.lzw4igu.mongodb.net`. Provided that cluster is still active, you can reuse it and keep AgriConnect in its own database. The URI shape would be:

```env
MONGODB_URI=mongodb+srv://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@student-crud-cluster.lzw4igu.mongodb.net/agriconnect?retryWrites=true&w=majority&appName=student-crud-cluster
```

Do not reuse a password from a message or commit it into the repository. Verify that the Atlas database user you select has read/write access to the `agriconnect` database, not only the `student_api` database used by your other assignment. If your cluster hostname has changed, use the current URI shown by Atlas instead.
