# Portfolio Backend API

Express.js backend API for the portfolio website with PostgreSQL database.

## Features

- RESTful API endpoints
- JWT authentication
- PostgreSQL database
- Input validation
- CORS enabled
- Security headers (Helmet)
- Request logging (Morgan)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Environment Variables

Create a `.env` file in the backend directory:

\`\`\`env
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

Run the SQL scripts to create tables and seed data:

\`\`\`bash
# Connect to your PostgreSQL database
psql -U username -d portfolio_db -f database/01-create-tables.sql
psql -U username -d portfolio_db -f database/02-seed-data.sql
\`\`\`

Or use a PostgreSQL client like pgAdmin or DBeaver.

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Server will start on `http://localhost:5000`

### 5. Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login and get JWT token

### Projects (Public)

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project

### Projects (Protected - Requires JWT)

- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Contact

- `POST /api/contact` - Submit contact form

### Health Check

- `GET /health` - Server health status

## Authentication

Protected routes require a JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

Default admin credentials:
- Email: `admin@portfolio.com`
- Password: `admin123`

**⚠️ Change these credentials in production!**

## Deployment to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables in Render dashboard
5. Create a PostgreSQL database on Render and link it
6. Deploy!

## Project Structure

\`\`\`
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # PostgreSQL connection
│   │   └── auth.ts          # JWT utilities
│   ├── middleware/
│   │   └── auth.ts          # Authentication middleware
│   ├── routes/
│   │   ├── auth.routes.ts   # Auth endpoints
│   │   ├── projects.routes.ts # Projects CRUD
│   │   └── contact.routes.ts  # Contact form
│   └── server.ts            # Express app setup
├── database/
│   ├── 01-create-tables.sql # Database schema
│   └── 02-seed-data.sql     # Sample data
├── package.json
├── tsconfig.json
└── .env.example
\`\`\`

## Security Features

- Helmet for security headers
- CORS configuration
- JWT token authentication
- Password hashing with bcrypt
- Input validation
- SQL injection prevention (parameterized queries)

## License

MIT
# FUTURE_FS_01-Backend-
