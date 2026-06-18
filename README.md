# Job Tracker Pro

A production-ready MERN Stack application that helps job seekers manage, track, and analyze their job applications from a single dashboard.

---

## Features

### Authentication & Security

* User Registration
* User Login
* JWT Authentication
* Secure Password Hashing using bcryptjs
* Protected Routes
* Session Persistence
* Profile Management

### Job Application Management

* Create Job Applications
* Edit Job Applications
* Delete Job Applications
* View Job Details
* Search Jobs
* Filter Jobs by Status
* Sort Jobs by Date
* Pagination Support

### Analytics Dashboard

* Total Applications
* Total Interviews
* Total Rejections
* Total Offers

Interactive Charts:

* Monthly Applications Trend
* Status Distribution
* Interview vs Rejection Ratio

### Database & Backend

* MongoDB with Mongoose
* RESTful API Architecture
* Dashboard Analytics using Aggregation Pipelines
* Error Handling Middleware
* Modular Folder Structure

---

## Tech Stack

### Frontend

* React.js
* Redux Toolkit
* React Router DOM
* Tailwind CSS
* Chart.js
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* bcryptjs

### Tools

* Git
* GitHub
* Postman
* Vite

---

## Project Structure

```bash
src
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── services
│
├── components
├── layouts
├── pages
├── redux
├── services
├── App.jsx
└── index.css

server.js
package.json
.env
```

---

## API Endpoints

### Authentication APIs

Base Route:

```http
/api/auth
```

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | /register | Register New User   |
| POST   | /login    | Login User          |
| GET    | /profile  | Get User Profile    |
| PUT    | /profile  | Update User Profile |

---

### Job APIs

Base Route:

```http
/api/jobs
```

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| POST   | /          | Create Job Application |
| GET    | /          | Get All Jobs           |
| GET    | /analytics | Dashboard Analytics    |
| GET    | /:id       | Get Single Job         |
| PUT    | /:id       | Update Job             |
| DELETE | /:id       | Delete Job             |

---

## Dashboard Analytics

### KPI Cards

* Total Applications
* Total Interviews
* Total Rejections
* Total Offers

### Charts

#### Monthly Applications Trend

Displays month-wise application activity.

#### Status Distribution

Shows application breakdown by status:

* Applied
* Online Assessment
* Interview Scheduled
* Rejected
* Offer Received
* Selected

#### Interview vs Rejection Ratio

Visual comparison between interview conversions and rejected applications.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd job-tracker-pro
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build Application

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

---

## Resume Highlights

* Developed a production-ready MERN Stack application.
* Implemented JWT-based authentication and protected routes.
* Built RESTful APIs for job management and analytics.
* Designed MongoDB schemas and aggregation pipelines.
* Developed interactive analytics dashboards using Chart.js.
* Implemented search, filtering, sorting, and pagination.
* Integrated Redux Toolkit for global state management.

---

## Future Enhancements

* Resume Upload & Management
* Interview Reminder System
* Company-wise Analytics
* Email Notifications
* AI-based Resume Analysis
* Job Recommendation Engine

---

## Author

**Absar Ahmad**

* LinkedIn: https://www.linkedin.com/in/absar10/
* GitHub: https://github.com/Absar11
* Project Live Link: https://job-tracker-pro-9fq5.onrender.com
* Portfolio: https://portfolio-mern-app-s6bu.onrender.com/
