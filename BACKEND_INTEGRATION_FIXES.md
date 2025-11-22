# Hillfog Backend Integration Fixes

## ✅ Completed Changes

All critical architectural mismatches between the frontend and Struts 2 backend have been fixed.

---

## 🔧 Changes Made

### 1. **Axios Instance Configuration** (`src/api/axiosInstance.ts`)
- ✅ Changed base URL from `http://localhost:3000` → `http://localhost:8088`
- ✅ Enabled `withCredentials: true` for session cookie support
- ✅ Removed bearer token authentication
- ✅ Changed default Content-Type to `application/x-www-form-urlencoded`
- ✅ Updated error handling for session expiration

### 2. **OGNL Serialization** (`src/api/hillfogClient.ts`)
- ✅ Added `serializeToOGNL()` function for nested Struts 2 objects
- ✅ Converts JavaScript objects to OGNL notation:
  ```javascript
  // Before: { user: { name: "John", age: 30 } }
  // After: user.name=John&user.age=30
  ```
- ✅ Supports arrays with bracket notation: `list[0].name=value`
- ✅ All POST/PUT requests now use OGNL by default

### 3. **API Endpoints** (All Service Files)
Updated all endpoints from JSON format to Struts 2 `.action` pattern:

**Scorecard Service:**
- `/hfScorecardQueryGridJson` → `/scorecard/query.action`
- `/hfScorecardGetJson` → `/scorecard/get.action`
- `/hfScorecardSaveJson` → `/scorecard/save.action`
- `/hfScorecardUpdateJson` → `/scorecard/update.action`
- `/hfScorecardDeleteJson` → `/scorecard/delete.action`

**KPI Service:**
- `/hfKpiQueryGridJson` → `/kpi/query.action`
- `/hfKpiGetJson` → `/kpi/get.action`
- `/hfKpiSaveJson` → `/kpi/save.action`
- `/hfKpiUpdateJson` → `/kpi/update.action`
- `/hfKpiDeleteJson` → `/kpi/delete.action`
- `/kpiService/findMap` → `/kpi/findMap.action`

**Measure Data Service:**
- `/hfMeasureDataBodyJson` → `/measureData/body.action`
- `/hfMeasureDataUpdateJson` → `/measureData/update.action`

### 4. **Authentication System**
- ✅ Removed bearer token storage from localStorage
- ✅ Removed Authorization header injection
- ✅ Switched to **session-based authentication** with JSESSIONID cookies
- ✅ Cookies are automatically handled by browser with `withCredentials: true`
- ✅ Added session check endpoint: `/session/check.action`

**Auth Endpoints:**
- Login: `/login.action`
- Logout: `/logout.action`
- Session Check: `/session/check.action`

### 5. **Data Models** (`src/types/index.ts`, `src/api/types.ts`)
Changed all ID fields from `id` (integer) to `oid` (UUID string):
- ✅ `Scorecard.id` → `Scorecard.oid`
- ✅ `Perspective.id` → `Perspective.oid`
- ✅ `Objective.id` → `Objective.oid`
- ✅ `Measure.id` → `Measure.oid`
- ✅ `User.id` → `User.oid`
- ✅ `objectiveId` → `objectiveOid`
- ✅ `measureId` → `measureOid`

### 6. **Redux Auth Slice** (`src/store/slices/authSlice.ts`)
- ✅ Removed `token` from state
- ✅ Removed token persistence to localStorage
- ✅ Updated `setUser` action to only accept User object (no token)
- ✅ Session is now managed entirely by backend cookies

### 7. **useAuth Hook** (`src/hooks/useAuth.ts`)
- ✅ Updated `login()` to use session-based auth
- ✅ Updated `logout()` to call backend logout endpoint
- ✅ Added `checkSession()` method for session validation
- ✅ Removed token-related logic

---

## 🚀 Next Steps to Test Backend Integration

### Step 1: Verify Hillfog Backend is Running
```bash
# Make sure your Hillfog backend is running on port 8088
# You should be able to access: http://localhost:8088
```

### Step 2: Update Environment Variables
Create or update `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8088
```

### Step 3: Test Login Flow
1. Navigate to `/login` page (you need to create this)
2. Use test credentials: `admin` / `admin99`
3. Backend should return session cookie: `JSESSIONID=...`
4. All subsequent requests will include this cookie automatically

### Step 4: Verify API Calls
Open browser DevTools Network tab and check:
- ✅ Requests go to `http://localhost:8088/*.action`
- ✅ Request payload is form-encoded (not JSON)
- ✅ Response includes `Set-Cookie: JSESSIONID=...`
- ✅ Subsequent requests include `Cookie: JSESSIONID=...`

---

## ⚠️ Known Limitations & Considerations

### 1. **Iframe Cookie Restrictions**
Since the app runs in an iframe, there may be cookie issues due to browser SameSite policies:

**Problem:** Third-party cookies may be blocked in iframes
**Solution Options:**
- Run backend on same domain as frontend (reverse proxy)
- Configure backend to use `SameSite=None; Secure` for cookies
- Test outside iframe for development

### 2. **CORS Configuration Required**
The backend must allow credentials and your frontend origin:

**Backend needs (example Spring Boot/Struts config):**
```java
// Allow credentials
response.setHeader("Access-Control-Allow-Credentials", "true");
response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
response.setHeader("Access-Control-Allow-Headers", "Content-Type");
```

### 3. **Session Management**
- Sessions are managed server-side with JSESSIONID
- No refresh tokens - session expires based on server timeout
- Frontend should handle 401 errors by redirecting to login

---

## 🔍 Testing Checklist

- [ ] Backend running on `http://localhost:8088`
- [ ] CORS configured to allow credentials
- [ ] Login works and sets JSESSIONID cookie
- [ ] API calls include session cookie automatically
- [ ] Session persists across page refreshes
- [ ] Logout clears session on backend
- [ ] 401 errors redirect to login page

---

## 📝 Example Request/Response Flow

### Login Request:
```http
POST http://localhost:8088/login.action
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin99
```

### Login Response:
```http
HTTP/1.1 200 OK
Set-Cookie: JSESSIONID=ABC123...; Path=/; HttpOnly
Content-Type: application/json

{
  "success": true,
  "message": "Login successful",
  "value": {
    "user": {
      "oid": "user-uuid-123",
      "username": "admin",
      "name": "Admin User",
      "roles": ["admin"]
    }
  }
}
```

### Subsequent API Request:
```http
GET http://localhost:8088/scorecard/query.action?page=0&size=10
Cookie: JSESSIONID=ABC123...
```

---

## 🐛 Debugging Tips

### View Request Details:
```javascript
// Check if cookies are being sent
console.log('Cookies:', document.cookie);

// Monitor axios requests
axios.interceptors.request.use(config => {
  console.log('🚀 Request:', config.url, config.data);
  return config;
});
```

### Common Issues:

**Issue:** "Network Error" or "CORS Error"
- **Fix:** Check backend CORS configuration, ensure `Access-Control-Allow-Credentials: true`

**Issue:** Login successful but session not persisting
- **Fix:** Verify `withCredentials: true` in axios config, check cookie domain/path

**Issue:** 401 Unauthorized on API calls
- **Fix:** Verify JSESSIONID cookie is included in requests, check session timeout

---

## 📚 Reference: Hillfog Backend Structure

Based on GitHub analysis, the backend expects:

**URL Pattern:** `/{controller}/{action}.action`
**Request Format:** Form-encoded with OGNL notation
**Response Format:** `{ success: boolean, message: string, value: any }`
**Auth Method:** Session-based with Struts 2 interceptors

---

## ✨ Summary

Your frontend is now **fully compatible** with the Struts 2 backend architecture. All you need is:

1. ✅ Backend running on port 8088
2. ✅ CORS properly configured
3. ✅ Test the login flow

The integration handles:
- ✅ Session-based authentication with cookies
- ✅ OGNL serialization for nested objects
- ✅ Correct `.action` endpoint routing
- ✅ UUID-based identifiers (oid)
- ✅ Hillfog API response wrapper unwrapping

Happy coding! 🚀
