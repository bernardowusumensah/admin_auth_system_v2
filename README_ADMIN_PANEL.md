# Admin Panel V0.1

A React-based admin panel for managing accounts and monitoring backend services health.

## 🚀 New Features Added

### 1. Accounts Module
- **Paginated Accounts Table** with search, filtering, and sorting
- **Account Management Actions**: Ban/Unban, Disconnect, View Details
- **Advanced Filtering**: By email status, account status, subscription type
- **Real-time Status Display**: Account status, subscription info, required actions
- **Subscription Management**: Create and cancel subscriptions

### 2. Service Health Module
- **Real-time Health Monitoring** for 4 core services:
  - UserIdentity Service
  - Player Service  
  - GameSettings Service
  - Orders Service
- **Visual Status Indicators** with color-coded cards
- **Auto-refresh** functionality (30-second intervals)
- **Response Time Metrics** and last checked timestamps
- **Overall System Status** overview

## 🛠 Technical Stack

- **React 19** with TypeScript
- **Material-UI** for components and styling
- **Styled Components** for custom styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications

## 📁 Project Structure

```
src/
├── core/
│   ├── types/          # TypeScript interfaces and enums
│   ├── services/       # API service classes
│   └── utils/          # Mock data generators and utilities
├── modules/
│   ├── accounts/       # Account management module
│   │   ├── components/ # AccountsTable component
│   │   ├── screens/    # Accounts screen
│   │   └── store/      # Redux slice for accounts
│   └── service-health/ # Service health monitoring module
│       ├── components/ # ServiceHealthDashboard component
│       ├── screens/    # Service health screen
│       └── store/      # Redux slice for service health
```

## 🔧 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Update `VITE_API_BASE_URL` to match your backend API

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open http://localhost:5173
   - Login with your credentials
   - Navigate to "Accounts" or "Service Health" from the sidebar

## 🎯 Key Features

### Accounts Table
- ✅ Paginated display (5, 10, 25, 50 items per page)
- ✅ Search by username or email
- ✅ Filter by email confirmation status
- ✅ Filter by account status (Active/Banned)
- ✅ Filter by subscription status
- ✅ Visual status indicators and badges
- ✅ Action buttons for account management
- ✅ Responsive design

### Service Health Dashboard  
- ✅ Real-time service status monitoring
- ✅ Color-coded status indicators (Green=Healthy, Red=Unavailable, Orange=Degraded)
- ✅ Response time metrics
- ✅ Auto-refresh with toggle
- ✅ Overall system status summary
- ✅ Last updated timestamps

### Account Management Actions
- ✅ Ban/Unban accounts
- ✅ Force disconnect players
- ✅ View account details
- ✅ Create subscriptions
- ✅ Cancel subscriptions

## 🔄 API Integration

### Backend Endpoints Expected

**Accounts Module:**
- `GET /api/accounts` - Get paginated accounts with filters
- `GET /api/accounts/{id}` - Get account details
- `POST /api/accounts/ban/{id}` - Ban account
- `DELETE /api/accounts/ban/remove/{id}` - Unban account
- `POST /api/accounts/disconnect/{id}` - Force disconnect
- `POST /api/subscriptions` - Create subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

**Service Health Module:**
- `GET /api/health/services` - Get all service health statuses
- `GET /api/health/services/{serviceName}` - Get specific service health

### Mock Data
Currently using mock data for development. Set `VITE_ENV=development` in `.env` to use mock responses.

## 🎨 Styling & UI

- **Material-UI Components** for consistent design
- **Styled Components** for custom styling
- **Responsive Design** that works on desktop and mobile
- **Dark/Light theme** support (via Material-UI)
- **Loading States** and error handling
- **Toast Notifications** for user feedback

## 🔐 Authentication

The admin panel integrates with your existing authentication system. Users must be logged in to access the dashboard features.

## 📊 State Management

Redux Toolkit slices manage:
- **Accounts State**: Account list, pagination, filters, selected account
- **Service Health State**: Service statuses, auto-refresh settings, last updated

## 🚀 Production Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Update environment variables for production API
3. Deploy the `dist` folder to your hosting platform

## 🔮 Future Enhancements

- Account details modal/page
- Bulk account operations
- Service health alerting
- Export functionality
- Advanced analytics dashboard
- Real-time notifications via WebSocket

---

**Built with ❤️ for efficient admin panel management**
