# API Configuration Helper

## Quick Setup Commands

### 1. Use Mock Data (Development/Testing)
```bash
# Set environment to development (uses mock data)
echo "VITE_ENV=development" > .env.local
echo "VITE_API_BASE_URL=https://localhost:7001/api" >> .env.local
```

### 2. Connect to Real .NET API
```bash
# Set environment to production (connects to real API)
echo "VITE_ENV=production" > .env.local
echo "VITE_API_BASE_URL=https://localhost:7001/api" >> .env.local
```

### 3. Test Connection
```bash
# Test if your .NET API is running
curl -k https://localhost:7001/api/health/services
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_ENV` | Environment mode (`development` = mock data, `production` = real API) | `development` |
| `VITE_API_BASE_URL` | Your .NET API base URL | `https://localhost:7001/api` |
| `VITE_AUTH_TOKEN_KEY` | LocalStorage key for JWT token | `authToken` |

## Visual Indicators

When using mock data, you'll see console logs:
- 🔄 Using mock data for accounts
- 🔄 Using mock data for account details  
- 🔄 Using mock data for service health

## Ready to Switch?

1. **Start with mock data** to see the UI working
2. **Set up your .NET API endpoints** following the integration guide
3. **Switch to production mode** to connect to real API
4. **Test all functionality** end-to-end
