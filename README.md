# Mock Mart

A mock e-commerce platform built with Next.js, Drizzle ORM (MySQL), and Shadcn/ui. Designed for functional testing and development with mocked data.

---

## 📝 Environment Setup

Before running the app, create a `.env` file in the project root with your database credentials and any other required environment variables. Example:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=mockmart
MYSQL_ROOT_PASSWORD=your_root_password
DB_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@db:3306/${MYSQL_DATABASE}
```

- Make sure these values match your local or Docker MySQL setup.
- The app and Drizzle ORM will use these credentials to connect to the database.

---

## 🚀 Running the App

### 1. Using Docker (Recommended)

This will start both the Next.js app and a MySQL database in production mode.

```bash
docker compose up --build
```

- The app will be available at [http://localhost:3000](http://localhost:3000).
- Database credentials are loaded from your `.env` file.
- Drizzle migrations are run automatically on startup.

### 2. Development Mode with File Watching

For development with hot reloading and file watching (changes will automatically update as you code):

```bash
docker compose up --watch
```

The watch mode:
- Automatically syncs source code changes to the container
- Rebuilds when package.json changes
- Ignores node_modules directory for better performance
- Works with Next.js hot module replacement

> Note: Requires Docker Compose version 2.22.0 or later

### 3. Database Purge Mode

To completely reset/purge the database when starting the application, use the `PURGE_DB` flag:

```bash
# Using environment variable
PURGE_DB=true docker compose up --build

# Or export the variable first
export PURGE_DB=true
docker compose up --build
```

**⚠️ Warning:** This will **permanently delete all data** in the database and recreate it from scratch. Use with caution!

**When to use:**
- Fresh testing environment
- Clearing corrupted data
- Starting with clean slate for development
- Resetting to initial state

The purge process:
1. Drops the existing database (if it exists)
2. Creates a new empty database
3. Runs all migrations to set up the schema
4. Starts the application

### 4. Local Development (without Docker)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start MySQL** (ensure credentials match your `.env`):
   - You can use a local MySQL instance or Docker.
3. **Run migrations:**
   ```bash
   npx drizzle-kit migrate
   ```
4. **Start the app:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack

- **Framework:** Next.js
- **UI:** [Shadcn/ui](https://ui.shadcn.com/)
- **ORM:** Drizzle ORM (MySQL)
- **Testing:** Playwright (for functional testing)
- **Containerization:** Docker, Docker Compose

---

## 🗄️ Database & Migrations

- All database credentials are managed via `.env`.
- Database schema is defined in `src/db/schema.ts`.
- To generate a new migration after schema changes:
  ```bash
  npx drizzle-kit generate
  ```
- Migrations are stored in the `drizzle/migrations/` directory.

### Database Reset Options

- **Soft reset:** Stop containers and restart without `PURGE_DB` flag (keeps data)
- **Hard reset:** Use `PURGE_DB=true` flag to completely wipe and recreate database
- **Volume reset:** Remove Docker volume manually: `docker volume rm mock-mart_mysql_data`

---

## 🤝 Contributing

- Update `src/db/schema.ts` before generating new migrations.
- Ensure all new/removed columns are reflected in migrations.
- Use Playwright for functional testing.

---

## ⚠️ Disclaimer

This project uses only mocked data and is **not** intended for production use. 