# 🚨 500 Internal Server Error - .NET API Debug Guide

## 🔍 **Problem Identified:**
Your React frontend is working correctly, but your .NET API is throwing a **500 Internal Server Error** when processing signup requests.

## 🛠 **How to Debug Your .NET API:**

### 1. **Check Your .NET API Console/Logs**
Look at the console where you're running your .NET API. You should see detailed error messages like:
- Database connection errors
- Validation errors
- Missing configuration
- Exception stack traces

### 2. **Common Causes of 500 Errors:**

#### **A) Database Issues**
```csharp
// Check your connection string in appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Database=...;Trusted_Connection=true;"
  }
}
```

#### **B) Missing Entity Framework Migrations**
```bash
# Run these in your .NET project folder
dotnet ef database update
# or
dotnet ef migrations add InitialCreate
dotnet ef database update
```

#### **C) Model Validation Issues**
Your signup model might be missing required attributes:
```csharp
public class SignupRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(6)]
    public string Password { get; set; }
    
    [Required]
    public string FirstName { get; set; }
    
    [Required]
    public string LastName { get; set; }
}
```

#### **D) Service Registration Issues**
Make sure your services are registered in `Program.cs`:
```csharp
// Add your services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
```

## 🧪 **Quick Tests:**

### Test 1: Check if your API is responding at all
```bash
curl http://localhost:5001/api/health
# or
curl http://localhost:5001/weatherforecast
```

### Test 2: Check your API logs
Look for error messages in your .NET console that might show:
- `System.ArgumentNullException`
- `Microsoft.EntityFrameworkCore.Database.Command[20102]`
- `System.Data.SqlClient.SqlException`

## 🔧 **Temporary Workaround:**

If you want to test the frontend while fixing the API, temporarily switch back to mock data:

```env
# In your .env file
VITE_ENV=development  # This will use mock data
```

## 📋 **What to Check in Your .NET Project:**

1. **Startup/Program.cs** - Are all services registered?
2. **Database Connection** - Is your database running?
3. **Controller Action** - Does your Signup endpoint handle all required fields?
4. **Model Binding** - Are the request models matching?
5. **Exception Handling** - Are you catching and logging errors?

## 🎯 **Next Steps:**

1. **Check your .NET API console** for error details
2. **Share the error message** you see in the .NET logs
3. **Verify your database** is running and accessible
4. **Check your Signup controller** implementation

## 📄 **Sample Working Signup Controller:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class SignupController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<SignupController> _logger;

    public SignupController(IAuthService authService, ILogger<SignupController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        try
        {
            var result = await _authService.SignupAsync(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Signup failed for {Email}", request.Email);
            return StatusCode(500, new { message = "Signup failed" });
        }
    }
}
```

**Check your .NET API console for the exact error message and let me know what you see!** 🚀
