<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/trending-up.svg" width="80" height="80" alt="WealthLens Logo">
  
  # WealthLens (WealthForecast)
  **A premium, intelligent personal finance tracking and long-term wealth forecasting platform.**
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
</div>

---

##  Overview

**WealthLens** is more than just an expense tracker. It is a comprehensive financial intelligence tool designed to help you understand your spending habits today, while intelligently forecasting where your wealth will be in 10, 20, or 30 years. 

Built with an enterprise-grade 3-repo architecture, WealthLens prioritizes data security, high-performance UI/UX, and robust analytics.

##  Key Features

- ** Intelligent Dashboard**: A responsive, glassmorphism-inspired UI that provides a high-level snapshot of your monthly income, expenses, net savings, and savings rate.
- ** Advanced Analytics**: Dynamic pie charts and bar graphs that automatically group, filter, and sort your financial data without visual clutter.
- ** Smart CSV/OFX Imports**: A sequence-aware import engine that deduplicates transactions and securely processes your banking history without data loss.
- ** Smart Categorization**: Automatic transaction categorization that understands context (e.g., separating income from debit automatically).
- ** 10-Year Wealth Forecast**: Compound growth projections based on your actual savings rate and historical data.
- ** Production-Grade Security**: Asymmetric JWT authentication via `httpOnly` cookies, rate limiting, and comprehensive CORS protection.
- ** Excel Reporting**: Export your financial intelligence into beautifully formatted `.xlsx` reports with a single click.

---

## Architecture

WealthLens utilizes a strict **monorepo-style 3-tier architecture** to ensure type safety and separation of concerns:

1. **`wealthlens-backend`**: The brains of the operation. A RESTful API built on Node.js/Express, utilizing MongoDB for persistent storage and Redis for high-speed caching.
2. **`wealthlens-frontend`**: A lightning-fast, highly responsive Single Page Application (SPA) built with React, Vite, and styled with TailwindCSS.
3. **`wealthlens-shared`**: The bridge between the frontend and backend. Contains strictly defined TypeScript types, Zod validation schemas, and global constants (like Category Taxonomies) used across the entire stack.

---

##  Tech Stack

### Frontend
- **Framework**: React 18 (via Vite)
- **Styling**: TailwindCSS & Vanilla CSS (for custom glassmorphism)
- **State Management**: Zustand (Global UI state) & React Query (Server state/caching)
- **Routing**: React Router DOM v6
- **Charts**: Recharts (Customized and responsive)
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose)
- **Caching**: Redis
- **Security**: Helmet, Express Rate Limit, bcrypt, jsonwebtoken
- **Logging**: Pino (with pino-http for requests)
- **File Parsing**: `csv-parser` & `exceljs`

---

##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **MongoDB** (Running locally on default port 27017 or via MongoDB Atlas)
- **Redis** (Running locally on default port 6379)

### 1. Installation

Clone the repository and install dependencies for all three packages:

```bash
# Clone the repo
git clone https://github.com/kanaksingh2218/WealthForecast.git
cd WealthForecast

# Install shared library first
cd wealthlens-shared
npm install
npm run build

# Install Backend
cd ../wealthlens-backend
npm install

# Install Frontend
cd ../wealthlens-frontend
npm install
```

### 2. Environment Configuration

You must create `.env` files for both the backend and frontend. 

**Backend (`wealthlens-backend/.env`):**
```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/wealthlens
REDIS_URL=redis://127.0.0.1:6379
FRONTEND_URL=http://localhost:5173

# Security
JWT_PRIVATE_KEY=your_secure_private_key_here
```

**Frontend (`wealthlens-frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 3. Running the Application

To run the application locally, you will need two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd wealthlens-backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd wealthlens-frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173`. 
*(Note: If you haven't created an account, you can do so on the login page.)*

---

##  Folder Structure

```text
WealthForecast/
├── wealthlens-shared/         # Zod schemas, TS types, Constants
├── wealthlens-backend/
│   ├── src/
│   │   ├── aggregations/      # Complex MongoDB pipelines (Analytics)
│   │   ├── controllers/       # Route logic & responses
│   │   ├── middleware/        # Auth, Rate Limiting, Error handling
│   │   ├── models/            # Mongoose Schemas
│   │   ├── routes/            # Express router definitions
│   │   └── services/          # Business logic (Import engine, Cache service)
├── wealthlens-frontend/
│   ├── src/
│   │   ├── api/               # Axios client and endpoint definitions
│   │   ├── components/        # Reusable UI components (Charts, Forms, Modals)
│   │   ├── hooks/             # Custom React hooks (React Query wrappers)
│   │   ├── pages/             # Main application views (Dashboard, Transactions)
│   │   └── store/             # Zustand state stores
```

---


