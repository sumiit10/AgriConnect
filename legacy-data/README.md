# Optional legacy migration input

Your uploaded source project had `data/users.json`, `data/equipment.json` and `data/rentals.json` files. They are deliberately not copied into this new project because they contain account information and password hashes.

To migrate your own old records:
1. Make a private backup of your old project's `data` folder.
2. Copy those three JSON files into this folder, keeping the exact filenames.
3. Check that `MONGODB_URI` in the root `.env` points to the AgriConnect database you intend to use.
4. Run `npm run migrate:legacy` once. The script maps old user/equipment IDs to MongoDB ObjectIds and preserves existing bcrypt password hashes.
5. After confirming the records in Atlas, remove these local JSON files from the working copy. Do not commit them to GitHub.

The migration script checks legacy IDs to avoid re-importing equipment and rentals. Existing user emails are matched instead of duplicated.
