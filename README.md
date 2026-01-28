# MERN Registration CRUD App with Role-Based Access Control

A full-stack web application built with the **MERN stack (MongoDB, Express, React, Node.js)** featuring secure authentication, **role-based access control (RBAC)**, **Google OAuth 2.0**, protected routes, and a complete registration management system.

![MERN Stack](https://img.shields.io/badge/MERN-FullStack-blue)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-22.14.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## Features

###  Authentication & Authorization
- JWT-based authentication with secure token handling
- Role-Based Access Control (**Admin / User**)
- Google OAuth 2.0 integration using `@react-oauth/google`
- Protected frontend and backend routes
- Session persistence with automatic login state restoration

###  User Roles & Permissions

| Role | Create | View | Edit | Delete |
|-----|-------|------|------|--------|
| **Admin** | ✅ All | ✅ All | ✅ All | ✅ All |
| **User** | ✅ Own | ✅ Own | ✅ Own | ✅ Own |

###  Registration Management
- Complete registration form (10+ fields)
- CRUD operations (Create, Read, Update, Delete)
- Client & server-side validation
- Toast notifications for actions
- Real-time UI updates

###  UI/UX
- Material UI (MUI) design system
- Responsive & mobile-friendly layout
- Loading states and error handling
- Role-specific dashboards

---

##  Tech Stack

### Frontend
- React 19
- React Router DOM
- Material UI (MUI)
- Axios
- React Hot Toast
- @react-oauth/google

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- Passport.js
- bcryptjs
- CORS

### Development Tools
- Nodemon
- Dotenv
- Concurrently

---

##  Project Structure

```bash

mern-registration-app/
│
├── client/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Auth/
│ │ │ ├── Layout/
│ │ │ └── Registration/
│ │ ├── context/
│ │ ├── pages/
│ │ └── utils/
│ └── package.json
│
├── server/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── .env
│
├── .gitignore
└── README.md

```


##  Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)
- Google Cloud Console account
- npm or yarn

---

##  Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/mern-registration-app.git
cd mern-registration-app
```

### 2️⃣ Backend Setup
cd server
npm install

### 3️⃣ Frontend Setup
cd ../client
npm install

## Environment Variables
### Backend (server/.env)
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_registration
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

### Frontend (client/.env)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_API_URL=http://localhost:5000/api

## Google OAuth Setup
Go to Google Cloud Console
Create a project
Enable Google Sign-In API
Create OAuth 2.0 credentials
Add:
Authorized origin: http://localhost:3000
Redirect URI: http://localhost:5000/api/auth/google/callback
Copy Client ID & Secret to .env
▶️ Running the App


## Backend
cd server
npm run dev
## Frontend
cd client
npm start


## API Endpoints
### Authentication
| Method | Endpoint           | Access  |
| ------ | ------------------ | ------- |
| POST   | /api/auth/register | Public  |
| POST   | /api/auth/login    | Public  |
| POST   | /api/auth/google   | Public  |
| GET    | /api/auth/me       | Private |
| POST   | /api/auth/logout   | Private |


### Registrations
| Method | Endpoint                            | Access      |
| ------ | ----------------------------------- | ----------- |
| POST   | /api/registrations                  | User        |
| GET    | /api/registrations                  | Admin       |
| GET    | /api/registrations/my-registrations | User        |
| PUT    | /api/registrations/:id              | Owner/Admin |
| DELETE | /api/registrations/:id              | Owner/Admin |

