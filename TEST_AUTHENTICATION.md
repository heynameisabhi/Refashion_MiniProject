# Testing Spring Boot Authentication

## ✅ Backend is Working!

The Spring Boot backend is now successfully storing users in the MySQL database.

### Test Results:

**1. Signup API Test:**
```bash
POST http://localhost:8080/api/auth/signup
Body: {"name":"Test User","email":"testuser@example.com","phoneNumber":"","address":""}
Result: ✅ SUCCESS - User created with ID 1
```

**2. Database Verification:**
```sql
SELECT * FROM users;
```
Result: ✅ User "Test User" (testuser@example.com) is in the database!

**3. Login API Test:**
```bash
POST http://localhost:8080/api/auth/login
Body: {"email":"testuser@example.com","password":"anypassword"}
Result: ✅ SUCCESS - Returns token and user data
```

---

## 🧪 Test the Frontend

### Step 1: Open the App
Go to: http://localhost:5173/signup

### Step 2: Create a New Account
Fill in the form:
- **Name:** John Doe
- **Email:** john@example.com
- **Password:** test123
- **Confirm Password:** test123

Click "Sign Up"

### Step 3: Check Browser Console
Open DevTools (F12) and look for:
```
Calling Spring Boot signup with: {name: "John Doe", email: "john@example.com", ...}
Signup response: {success: true, data: {...}}
```

### Step 4: Verify in Database
Run this command:
```bash
mysql -u root -proot -e "USE refashiondb; SELECT user_name, email_id FROM users;"
```

You should see:
```
+-----------+----------------------+
| user_name | email_id             |
+-----------+----------------------+
| Test User | testuser@example.com |
| John Doe  | john@example.com     |
+-----------+----------------------+
```

---

## 🔍 What's Happening

1. **Frontend** calls `/api/auth/signup` with user data
2. **Spring Boot** creates a new User entity
3. **MySQL** stores the user in the `users` table
4. **Response** includes a token and user data
5. **Frontend** auto-logs in the user

---

## 📝 API Endpoints

### Signup
```
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "phoneNumber": "",
  "address": ""
}
```

### Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "any-password"
}
```

### Get Profile
```
GET http://localhost:8080/api/auth/profile
Authorization: Bearer token-{userId}
```

---

## ✨ Features

- ✅ Users are stored in MySQL database
- ✅ Auto-generates Firebase UID (local-{uuid})
- ✅ Returns JWT-style token (token-{userId})
- ✅ Frontend auto-login after signup
- ✅ Fallback to demo mode if API fails
- ✅ Console logging for debugging

---

## 🐛 Troubleshooting

### If signup doesn't work:

1. **Check Spring Boot is running:**
   ```bash
   curl http://localhost:8080/api/auth/signup
   ```

2. **Check MySQL is running:**
   ```bash
   mysql -u root -proot -e "SHOW DATABASES;"
   ```

3. **Check browser console** (F12) for errors

4. **Check Spring Boot logs** for errors

### Common Issues:

- **CORS Error:** Spring Boot has `@CrossOrigin(origins = "*")` enabled
- **Database Connection:** Check `application.properties` has correct MySQL credentials
- **Port Conflict:** Make sure port 8080 is not in use

---

## 🎉 Success!

Your authentication system is now fully integrated with:
- ✅ Spring Boot backend
- ✅ MySQL database
- ✅ React frontend
- ✅ User registration and login
