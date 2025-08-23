# 🚨 Signup Issue - Debug Guide

## ✅ **Fixed Issues:**

1. **Wrong API endpoints** - Updated to match your Swagger:
   - ✅ `/api/Login` (was `/api/login`)
   - ✅ `/api/Signup` (was `/api/signup`)

2. **Token storage** - Now properly stores JWT in localStorage
3. **Better error handling** - Shows actual API error messages

## 🧪 **Test Your Signup API Directly:**

Open your browser console and run this test:

```javascript
// Test signup endpoint directly
fetch('http://localhost:5001/api/Signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.text();
})
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

## 🔍 **Check These Common Issues:**

### 1. **API Requirements**
- Does your .NET API require specific password complexity?
- Are there any required fields we're missing?
- Check your Swagger documentation for the exact request format

### 2. **CORS Issues**
Make sure your .NET API has CORS configured:

```csharp
// In your Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminPanel", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

app.UseCors("AdminPanel");
```

### 3. **Database Connection**
- Is your database running?
- Can your API connect to the database?
- Check your .NET API logs for errors

## 🎯 **Quick Tests:**

### Test 1: Check if API is reachable
```bash
curl -X POST http://localhost:5001/api/Signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

### Test 2: Check what's in browser network tab
1. Open browser dev tools (F12)
2. Go to Network tab
3. Try to signup
4. Look for the `/api/Signup` request
5. Check the response details

## 🔧 **Updated Configuration:**

Your signup now calls: `http://localhost:5001/api/Signup`

## ❓ **Still Not Working?**

Please check:
1. What error message do you see?
2. What's in the browser console?
3. What's in the Network tab?
4. What do your .NET API logs show?

Share these details and I can help further! 🚀
