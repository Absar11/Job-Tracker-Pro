# Job Tracker Pro — Production-Ready MERN Stack Application

Job Tracker Pro is a fully-featured, production-ready full-stack (MERN) platform built with **React (Vite)**, **Redux Toolkit**, **Express.js**, and **MongoDB with Mongoose**. It helps job seekers organize, track, and analyze their job applications, interview loops, rejections, and career metrics from a single modern SaaS interface.

---

## Technical Highlights & Features

### 🛡️ Secure Authorization Block (RBAC)
- **JWT Session Persistence:** Secure user registration, logins, and session restoration.
- **Custom Hashing:** Password hashing using standard, safe `bcryptjs` cycles.
- **Role-Based Access Control (RBAC):** Middleware-based route authorization supporting `User` and `Admin` groups.

### 💼 Career Application Pipeline
- **Unified CRUD Core:** Add, inspect, modify, and delete job details.
- **Dynamic Search & Filtration:** Custom filters for status, company designations, location, and sorting by dates.
- **Full Pagination:** Optimized scroll limits, next/prev controls, and item counts reporting.

### 📊 SaaS Analytics Visuals
- **Dynamic KPI Cards:** High-contrast widgets for Total Applications, Scheduled Interview Loops, Cut Rejection Rates, and Offers.
- **React-ChartJS Integrations:**
  - **Monthly Applications Timeline Chart:** Tracks application frequency over months.
  - **Status distribution Doughnut Index:** Breaks down applications by category.
  - **Interview vs Rejection Pie Chart:** Highlights ratio conversions.

### ⚙️ Senior-Level Hybrid Persistence Engine
- **MongoDB (Production ready):** Integrates standard Mongoose model schemas for production connections.
- **SaaS-Local Fallback (Zero Config):** If `MONGODB_URI` is not present, the server automatically boots down to a persistent file-based JSON database (`/data/db.json`), emulates search indexes, alphabetical sorting, paginations, and MongoDB aggregator pipelines with 100% precision. **This guarantees the application remains fully functional out-of-the-box inside sandboxed preview portals!**

---

## Project Structure

```bash
├── data/                       # Local database folder
│   └── db.json                 # Auto-generated file persistence database
├── src/
│   ├── backend/                # Server-Side Backend Code
│   │   ├── config/             # DB settings
│   │   ├── controllers/        # Auth, Jobs, and Admin Controllers (15+ endpoints)
│   │   ├── middleware/         # authentication & RBAC middleware guards
│   │   ├── models/             # User and Job Mongoose schemas
│   │   ├── routes/             # REST route mappings
│   │   └── services/           # DB synchronization & fallback services
│   ├── components/             # Reusable UI widgets (Skeletons, Charts, Toasters)
│   ├── layouts/                # Desktop Drawer rails and Hamburgers
│   ├── pages/                  # Auth Gateway, Dashboards, Lists, Forms
│   ├── redux/                  # Redux Toolkits slices and global store
│   ├── services/               # custom Fetch networks client with interceptors
│   ├── App.tsx                 # Routing manager & Global listeners
│   ├── index.css               # typography & styling variables
│   └── types.ts                # TypeScript interfaces contracts
├── server.ts                   # Unified Express/Vite Integration Server
├── package.json                # Project dependencies and building scripts
└── .env.example                # Templates of server secrets
```

---

## 15+ REST APIs Directory

### Authentication Gateway (`/api/auth`)
* `POST  /register` - Create user profile with custom role (`User` or `Admin`).
* `POST  /login` - Verify password and return bearer session token.
* `GET   /profile` - Collect active user context metrics (Protected).
* `PUT   /profile` - Update user description, name, or profile picture (Protected).

### Job application Center (`/api/jobs`)
* `POST  /` - Insert a job application record (Protected).
* `GET   /` - Search, filter, page, or sort personal applications (Protected).
* `GET   /analytics` - Group and count pipeline stats for dashboard charts (Protected).
* `GET   /:id` - Load unique details of an individual listing (Protected).
* `PUT   /:id` - Save updates to a specific record (Protected).
* `DELETE /:id` - Erase individual application records from tracking (Protected).

### Administration Module (`/api/admin`)
* `GET   /stats` - Pull total system metrics, registered list sum, and statuses (Admin Required).
* `GET   /users` - Inspect registration profiles list and roles (Admin Required).

---

## Installation & Launch Guidelines

### 1. Configure Secrets
Initialize keys in your environment (or configure them via `.env` files):
```env
# MongoDB database connection string (vacate to run in Auto-File-Fallback)
MONGODB_URI="mongodb+srv://..."

# Secure JWT signing secret
JWT_SECRET="super_secret_jwt_key_job_tracker_pro_2026"
```

### 2. Operational Procedures
```bash
# Install NPM dependencies
npm install

# Start the application in development (runs Express + Vite Proxy)
npm run dev

# Compile production assets (Front-end SPA + Back-end esbuild)
npm run build

# Start the compiled production assets
npm run start
```
