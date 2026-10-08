# 🪔 Pandit Ji at Your Doorstep

> **Find. Book. Perform Your Rituals.**  
> A production-style Full-Stack MERN Priest Booking Platform.

---

## 📌 Phase 1: Project Setup & MongoDB Connection

### 🏗️ Architecture Overview

```text
panditttt/
│
├── client/                      # Frontend (React 19 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── assets/              # Icons, banners, patterns
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # Global Auth and State contexts
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # User, Priest & Admin layouts
│   │   ├── pages/               # Application view pages
│   │   ├── services/            # Axios API service layer (api.js)
│   │   ├── utils/               # Formatting, constants & helpers
│   │   ├── App.jsx              # Phase 1 Diagnostics & Platform Hub
│   │   ├── index.css            # Tailwind & Spiritual Theme tokens
│   │   └── main.jsx             # React entry point
│   ├── .env.example             # Client env template
│   ├── .env                     # Client env (VITE_API_URL)
│   ├── index.html               # Spiritual typography & meta tags
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js           # Vite configuration & backend proxy
│
├── server/                      # Backend (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js                # Resilient MongoDB connection handler
│   ├── controllers/             # Request handlers (MVC)
│   ├── middleware/
│   │   └── errorMiddleware.js   # 404 & Global API error formatters
│   ├── models/                  # Mongoose Schemas (User, Priest, Ritual, Booking, Review)
│   ├── routes/                  # Express REST API routes
│   ├── services/                # Business logic & payment services
│   ├── utils/                   # Tokens, validators & helpers
│   ├── uploads/                 # Static media & verification files
│   │   └── .gitkeep
│   ├── .env.example             # Backend env template
│   ├── .env                     # Backend configuration (PORT, MONGO_URI, JWT)
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express app entry point
│
├── .gitignore                   # Production gitignore
└── README.md                    # Documentation
```

---

## 🚀 Getting Started

### 1. Start Backend Server

```bash
cd server
npm install
npm run dev
```

The Express server will start on: **`http://localhost:5000`**

### 2. Start Frontend Client

```bash
cd client
npm install
npm run dev
```

The Vite dev server will start on: **`http://localhost:5173`**

---

## 🔍 Phase 1 Health Check Endpoint

### `GET /api/health`

Response:
```json
{
  "success": true,
  "message": "Pandit Ji API Server is operational",
  "data": {
    "uptime": 12.34,
    "timestamp": "2026-09-30T06:15:00.000Z",
    "environment": "development",
    "database": {
      "status": "Connected",
      "connected": true
    }
  }
}
```

---

## 📋 Technology Stack Configured

* **Frontend**: React 19, Vite, Tailwind CSS, Axios, Lucide React, React Toastify, React Router DOM.
* **Backend**: Node.js, Express.js, Mongoose, CORS, Morgan, dotenv, jsonwebtoken, bcryptjs, multer.
* **Database**: MongoDB (Local `mongodb://127.0.0.1:27017/pandit_booking_db` or MongoDB Atlas).
