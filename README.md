# MERN CRUD APP

This is a MERN application featuring user authentication (register, login, forgot/reset password) and a dashboard with full CRUD operations and backend database in Mysql.

## Tech Stack

- **Frontend**: React.js, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MySQL (mysql2), bcryptjs, JWT
- **Database**: MySQL

## Prerequisites

- Node.js
- MySQL Server
- npm

## Database Setup

1. Make sure MySQL server is running
2. Run the SQL schema:

```bash
mysql -u root -p < database.sql
```

Or open `database.sql` in MySQL Workbench and execute.

3. Verify tables:

```sql
USE mern_auth_db;
SHOW TABLES;
DESCRIBE users;
DESCRIBE items;
```

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mern_auth_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

Start the backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`.

## API Endpoints

### Authentication

| Method | Endpoint                   | Description              | Auth |
|--------|----------------------------|--------------------------|------|
| POST   | `/api/auth/register`       | Register new user        | No   |
| POST   | `/api/auth/login`          | Login user               | No   |
| POST   | `/api/auth/forgot-password`| Send password reset link | No   |
| POST   | `/api/auth/reset-password` | Reset password           | No   |
| GET    | `/api/auth/me`             | Get current user         | Yes  |

### Items (CRUD)

| Method | Endpoint          | Description          | Auth |
|--------|-------------------|----------------------|------|
| GET    | `/api/items`      | Get all user items   | Yes  |
| GET    | `/api/items/:id`  | Get single item      | Yes  |
| POST   | `/api/items`      | Create new item      | Yes  |
| PUT    | `/api/items/:id`  | Update item          | Yes  |
| DELETE | `/api/items/:id`  | Delete item          | Yes  |
| GET    | `/api/items/stats`| Get dashboard stats  | Yes  |

## Features

- User registration with password hashing (bcryptjs)
- JWT-based authentication
- Forgot/Reset password flow
- Dashboard with statistics cards
- Full CRUD operations on items
- Inline status update
- Delete confirmation dialog
- Protected and public routes
- Form validation
- Error and success messages
- Responsive design

## Screenshots

![Dashboard](/screenshots/dashboard.png)

![dashboard_items_edit](/screenshots/item_edit.png)

![dashboard_items_delete](/screenshots/items_delete.png)

![mysql_database](/screenshots/mysql_databases.png)

![mysql_tables](/screenshots/mysql_tables.png)

![mysql_items_table_data](/screenshots/mysql_items_table_data.png)

![mysql_users_table_data](/screenshots/mysql_users_table_data.png)

## Environment Variables

See `backend/.env.example` for required environment variables.
