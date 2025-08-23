# .NET API Integration Guide

This guide explains how to integrate the React Admin Panel with your separate .NET API backend.

## 🔧 Configuration

### 1. Update Environment Variables

Edit your `.env` file to match your .NET API:

```env
# Update this URL to match your .NET API
VITE_API_BASE_URL=https://localhost:7001/api

# Set to 'production' when connecting to real API
VITE_ENV=development

# Auth token storage key
VITE_AUTH_TOKEN_KEY=authToken
```

**Common .NET API URLs:**
- `https://localhost:7001/api` (HTTPS development)
- `https://localhost:5001/api` (Alternative HTTPS)
- `http://localhost:5000/api` (HTTP development)
- `https://localhost:44300/api` (IIS Express)

### 2. CORS Configuration in .NET API

Add CORS support to your .NET API `Program.cs` or `Startup.cs`:

```csharp
// Program.cs (.NET 6+)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminPanelPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure the HTTP request pipeline
app.UseCors("AdminPanelPolicy");
```

## 📡 API Endpoints Expected

### Accounts Module

The frontend expects these endpoints in your .NET API:

```csharp
// GET /api/accounts - Paginated accounts list
[HttpGet]
public async Task<ActionResult<AccountsResponse>> GetAccounts(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? searchTerm = null,
    [FromQuery] string? sortBy = "createdOn",
    [FromQuery] string? sortOrder = "desc"
    // Add filter parameters as needed
)

// GET /api/accounts/{id} - Account details
[HttpGet("{id}")]
public async Task<ActionResult<AccountDetailsResponse>> GetAccountDetails(string id)

// POST /api/ban/{accountId} - Ban account (matches your existing endpoint)
[HttpPost("ban/{accountId}")]
public async Task<IActionResult> BanAccount(string accountId)

// DELETE /api/ban/remove/{accountId} - Unban account (matches your existing endpoint)
[HttpDelete("ban/remove/{accountId}")]
public async Task<IActionResult> UnbanAccount(string accountId)

// POST /api/disconnect/{accountId} - Disconnect player (matches your existing endpoint)
[HttpPost("disconnect/{accountId}")]
public async Task<IActionResult> DisconnectPlayer(string accountId)

// POST /api/subscriptions - Create subscription
[HttpPost("subscriptions")]
public async Task<IActionResult> CreateSubscription([FromBody] CreateSubscriptionRequest request)

// POST /api/subscriptions/cancel - Cancel subscription
[HttpPost("subscriptions/cancel")]
public async Task<IActionResult> CancelSubscription([FromBody] CancelSubscriptionRequest request)
```

### Service Health Module

```csharp
// GET /api/health/services - All services health
[HttpGet("health/services")]
public async Task<ActionResult<ServiceHealthResponse>> GetServicesHealth()

// GET /api/health/services/{serviceName} - Specific service health
[HttpGet("health/services/{serviceName}")]
public async Task<ActionResult<ServiceHealthDto>> GetServiceHealth(string serviceName)
```

## 📋 Response Models

Your .NET API should return these response models:

### AccountsResponse
```csharp
public class AccountsResponse
{
    public List<AccountDto> Accounts { get; set; }
    public int TotalCount { get; set; }
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
}
```

### AccountDetailsResponse
```csharp
public class AccountDetailsResponse
{
    public AccountDto Account { get; set; }
    public UserDto? User { get; set; }
}
```

### ServiceHealthResponse
```csharp
public class ServiceHealthResponse
{
    public List<ServiceHealthDto> Services { get; set; }
    public DateTime LastUpdated { get; set; }
}
```

## 🔐 Authentication Integration

### JWT Token Storage

The frontend stores JWT tokens in localStorage with the key `authToken` by default.

### Auth Header

All API requests include the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

### Token Refresh

When the API returns `401 Unauthorized`, the frontend automatically:
1. Removes the stored token
2. Redirects to `/login`

## 🚀 Switching from Mock to Real API

### Step 1: Update Environment
```env
VITE_ENV=production
```

### Step 2: Test Endpoints

1. Start your .NET API
2. Test endpoints with Postman/Swagger
3. Verify CORS is working
4. Check authentication flow

### Step 3: Frontend Testing

1. Login to get a valid JWT token
2. Navigate to Accounts page
3. Navigate to Service Health page
4. Test account actions (ban/unban, etc.)

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is configured in your .NET API
   - Check the frontend URL is allowed

2. **401 Unauthorized**
   - Verify JWT token is valid
   - Check token is being sent in Authorization header

3. **Connection Refused**
   - Verify your .NET API is running
   - Check the API URL in `.env` file

4. **SSL Certificate Issues**
   - Use HTTP for development if having SSL issues
   - Or configure proper SSL certificates

### Debug Mode

Keep `VITE_ENV=development` to use mock data while setting up your API endpoints.

## 📊 Sample Controller Implementation

Here's a sample controller for the Accounts module:

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize] // Require authentication
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet]
    public async Task<ActionResult<AccountsResponse>> GetAccounts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = "createdOn",
        [FromQuery] string? sortOrder = "desc")
    {
        try
        {
            var result = await _accountService.GetAccountsAsync(page, pageSize, searchTerm, sortBy, sortOrder);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AccountDetailsResponse>> GetAccountDetails(string id)
    {
        try
        {
            var result = await _accountService.GetAccountDetailsAsync(id);
            if (result == null)
                return NotFound(new { message = "Account not found" });
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}
```

## 🔄 Data Synchronization

The frontend will automatically:
- Refresh data when actions are performed
- Handle loading states
- Show error messages for failed operations
- Update the UI optimistically for better UX

Your .NET API should return appropriate HTTP status codes:
- `200 OK` for successful operations
- `400 Bad Request` for validation errors
- `401 Unauthorized` for auth issues
- `404 Not Found` for missing resources
- `500 Internal Server Error` for server errors

---

**Ready to connect your React frontend to your .NET API!** 🚀
