# WealthForecast

WealthForecast (WealthLens) is a comprehensive personal finance tracking and forecasting platform built with a 3-repo architecture.

## Architecture

This project is organized as a monorepo containing:

- **wealthlens-backend**: Node.js/Express API with MongoDB and Redis.
- **wealthlens-frontend**: React/Vite dashboard with TailwindCSS.
- **wealthlens-shared**: Shared TypeScript types, schemas (Zod), and constants.

## Features

- **Transaction Management**: Import and categorize transactions (CSV support).
- **Wealth Forecasting**: Project future wealth based on scenarios and historical data.
- **Analytics**: Deep insights into spending patterns and net worth trends.
- **Security**: Asymmetric JWT authentication and rate limiting.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kanaksingh2218/WealthForecast.git
   ```

2. Install dependencies for each service:
   ```bash
   cd wealthlens-shared && npm install
   cd ../wealthlens-backend && npm install
   cd ../wealthlens-frontend && npm install
   ```

3. Set up environment variables:
   - Create `.env` files in `wealthlens-backend` and `wealthlens-frontend` using the provided `.env.example` templates.

4. Run the development servers:
   - Backend: `cd wealthlens-backend && npm run dev`
   - Frontend: `cd wealthlens-frontend && npm run dev`

## License

MIT
