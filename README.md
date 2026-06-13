# 🌍  TourBee Server (v1)

**TourBee Server** is a **production-grade backend API (Version 1)** for a **tour booking and management platform**, built with **Node.js, Express, TypeScript, and MongoDB**.  
It follows **real-world backend architecture** with a strong focus on scalability, security, and clean business logic.

---
### 🌐 Live Demo : https://tour-bee-theta.vercel.app

### API LIVE LINK : https://tour-bee-server.vercel.app

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure user registration & login
- Role-based access control (User, Admin, Guide)
- Protected routes with middleware

### 🏖️ Tour Management
- Create, update, delete tours
- Image handling
- Advanced filtering, sorting & pagination
- Search tours by criteria

### 📅 Booking System
- Tour booking with user validation
- Prevent duplicate bookings
- Booking status lifecycle
- MongoDB transaction-based booking flow

### 💳 Payment System
- Payment creation & tracking
- Retry payment without re-booking
- Strong booking ↔ payment relationship
- Payment status handling

### 📊 Dashboard & Statistics
- Admin analytics dashboard
- User, tour, booking & payment statistics
- MongoDB Aggregation Pipelines
- Meaningful business insights

### 🧱 Clean Architecture
- Controller → Service → Model pattern
- Centralized error handling
- Reusable utilities
- Scalable folder structure

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT Authentication**
- **EJS**
- **ESLint**

---

## 📥 Git & Setup (v1)

Follow these steps to get the project running locally:

```bash
# Clone the repository
git clone https://github.com/7saffix/TourBee-server.git

# Navigate into project folder
cd TourBee-server

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

## 📌 Future Improvements (v2+)

- Redis caching for faster data retrieval
- Rate limiting & throttling for security
- Swagger/OpenAPI documentation for API
- Microservice-ready architecture
- Unit & integration testing with Jest
- CI/CD pipeline setup (GitHub Actions / GitLab CI)
- Docker containerization for easy deployment
- Advanced analytics dashboard with charts
- Cloud deployment ready (AWS / Heroku / Vercel)

## 👨‍💻 Author

**Shah Aziz Chowdhury Safi**


