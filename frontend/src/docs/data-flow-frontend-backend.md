# Data Flow: Frontend to Backend & Data Retrieval

This document explains how data flows through your e-commerce application, from user login to displaying user information in the UI.

---

## Table of Contents

1. [Overview](#overview)
2. [Login Request Flow](#login-request-flow)
3. [Data Retrieval Flow](#data-retrieval-flow)
4. [Complete Request-Response Cycle](#complete-request-response-cycle)
5. [Key Files & Their Roles](#key-files--their-roles)
6. [Common Issues & Debugging](#common-issues--debugging)

---

## Overview

Your application uses a **layered architecture** where each layer has a specific responsibility:

| Layer | Files | Responsibility |
|-------|-------|----------------|
| **UI Layer** | `LoginForm.jsx`, `Navigation.jsx` | Display forms, buttons, and user information |
| **State Layer** | `authContext.jsx` | Store and manage authentication state |
| **Service Layer** | `authService.js` | Make HTTP requests to backend |
| **API Layer** | `authApi.js` | Configure axios for API calls |
| **Backend** | `userController.ts`, `userService.ts` | Process requests, validate data, return responses |

---

## Login Request Flow

When a user logs in, data flows **downward** through these layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN REQUEST FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LoginForm.jsx                                                │
│     └─► User enters email & password, clicks "Login"            │
│                                                                  │
│  2. AuthContext.jsx (login function)                             │
│     └─► Receives form data, calls authService                   │
│                                                                  │
│  3. authService.js (loginUser function)                          │
│     └─► Makes HTTP POST request to backend                      │
│                                                                  │
│  4. authApi.js                                                   │
│     └─► Axios sends request with proper headers                 │
│                                                                  │
│  5. Backend API (/user/login endpoint)                           │
│     └─► Processes request, validates credentials                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

#### Step 1: LoginForm.jsx
```javascript
// User submits form with email and password
const onSubmit = async (formData) => {
    try {
        await login(formData);  // Calls AuthContext's login function
        toast.success("Successfully Logged in");
        navigate('/');
    } catch (error) {
        setError("root.serverError", { message: error.message });
    }
};
```

**What happens:**
- User types email and password into the form
- Form validation passes
- `onSubmit` is called with `formData = { email, password }`
- Calls `login()` function from AuthContext

---

#### Step 2: AuthContext.jsx
```javascript
const login = useCallback(async (formDataApi) => {
    try {
        const response = await loginUser(formDataApi);  // Call authService
        const userData = response.data;
        const token = response.data.token;

        setUser(userData);                              // Update React state
        localStorage.setItem('user', JSON.stringify(userData));  // Persist
        localStorage.setItem('token', token);

        return userData;
    } catch (error) {
        throw error;
    }
}, []);
```

**What happens:**
- Receives form data from LoginForm
- Calls `loginUser()` from authService
- When response returns, extracts user data and token
- Updates React state with `setUser()`
- Saves to localStorage for persistence across page refreshes

---

#### Step 3: authService.js
```javascript
export const loginUser = async (userData) => {
    const response = await authApi.post('/user/login', userData);
    return response.data;
};
```

**What happens:**
- Takes user data (email + password)
- Makes HTTP POST request to `/user/login` endpoint
- Returns the response data from backend

---

#### Step 4: authApi.js
```javascript
const authApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});
```

**What happens:**
- Axios is pre-configured with base URL and headers
- Sends the request to your backend server

---

## Data Retrieval Flow

After login, when you need to display user information, data flows **upward**:

```
┌─────────────────────────────────────────────────────────────────┐
│                       DATA RETRIEVAL FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. AuthContext.jsx                                              │
│     └─► Stores user data in state & localStorage                │
│                                                                  │
│  2. useAuth() Hook                                               │
│     └─► Provides access to context data                         │
│                                                                  │
│  3. Navigation.jsx (or any component)                            │
│     └─► Calls useAuth() to get user data                        │
│                                                                  │
│  4. UI Display                                                   │
│     └─► Shows "Hello, [username]" and Logout button             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

#### Step 1: AuthContext.jsx (Storage)
```javascript
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
    // Load user from localStorage on app start
    useEffect(() => {
        const storeduser = localStorage.getItem('user');
        if (storeduser) {
            setUser(JSON.parse(storeduser));
        }
        setLoading(false);
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
```

**What happens:**
- Stores user data in React state
- On app start, loads user from localStorage
- Provides data to all child components via Context.Provider

---

#### Step 2: useAuth() Hook
```javascript
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
```

**What happens:**
- Custom hook that accesses AuthContext
- Returns the context value (user, login, logout, isAuthenticated)
- Throws error if used outside AuthProvider

---

#### Step 3: Navigation.jsx (Display)
```javascript
const Navigation = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <div className="flex bg-[#F3EBDD]">
            {/* ... navigation links ... */}
            
            <div className="flex gap-[20px]">
                {isAuthenticated ? (
                    <>
                        <span>Hello, {user?.username}</span>
                        <button onClick={logout}>Log out</button>
                    </>
                ) : (
                    <button onClick={() => navigate('/Login')}>Log in</button>
                )}
            </div>
        </div>
    );
};
```

**What happens:**
- Calls `useAuth()` to get current auth state
- Checks `isAuthenticated` to determine which UI to show
- If logged in: displays username and logout button
- If logged out: displays login button

---

## Complete Request-Response Cycle

Here's the full cycle from user action to UI update:

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE REQUEST CYCLE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USER ACTION: Click "Login" button                              │
│           ↓                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  REQUEST PHASE (Frontend → Backend)                      │    │
│  │                                                          │    │
│  │  LoginForm.jsx                                           │    │
│  │  └─► Collects: { email, password }                       │    │
│  │           ↓                                              │    │
│  │  AuthContext.login()                                     │    │
│  │  └─► Calls: loginUser(formData)                          │    │
│  │           ↓                                              │    │
│  │  authService.js                                          │    │
│  │  └─► Makes: POST /user/login                             │    │
│  │           ↓                                              │    │
│  │  Backend API                                             │    │
│  │  └─► Validates credentials, generates token              │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│           ↓                                                      │
│  BACKEND RESPONSE:                                              │
│  {                                                              │
│    success: true,                                               │
│    data: {                                                      │
│      id: 1,                                                     │
│      username: "john_doe",                                      │
│      email: "john@example.com",                                 │
│      token: "jwt_token_here"                                    │
│    }                                                            │
│  }                                                              │
│           ↓                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  RESPONSE PHASE (Backend → Frontend)                     │    │
│  │                                                          │    │
│  │  authService.js                                          │    │
│  │  └─► Returns: response.data                              │    │
│  │           ↓                                              │    │
│  │  AuthContext.login()                                     │    │
│  │  └─► Extracts: userData, token                           │    │
│  │  └─► Stores: setUser(userData)                           │    │
│  │  └─► Persists: localStorage.setItem('user', ...)         │    │
│  │           ↓                                              │    │
│  │  React Re-render                                         │    │
│  │  └─► All components using useAuth() re-render            │    │
│  │           ↓                                              │    │
│  │  Navigation.jsx                                          │    │
│  │  └─► isAuthenticated becomes true                        │    │
│  │  └─► Displays: "Hello, john_doe" + Logout button         │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│           ↓                                                      │
│  UI UPDATED: User sees their name and logout button             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Files & Their Roles

### Frontend Files

| File | Role | Key Functions |
|------|------|---------------|
| `LoginForm.jsx` | UI Form | Collects user credentials, calls `login()` |
| `authContext.jsx` | State Management | Stores user, provides `login()`, `logout()`, `useAuth()` |
| `authService.js` | API Service | Makes HTTP requests via `loginUser()` |
| `authApi.js` | Axios Config | Configures base URL and headers |
| `Navigation.jsx` | UI Display | Shows user info or login button based on auth state |
| `main.jsx` | App Entry | Wraps app with `AuthProvider` |

### Backend Files

| File | Role | Key Functions |
|------|------|---------------|
| `userController.ts` | Request Handler | Receives requests, calls service |
| `userService.ts` | Business Logic | Validates credentials, returns user data |
| `userRepository.ts` | Data Access | Queries database for user |

---

## Common Issues & Debugging

### Issue 1: User data not showing after login

**Symptom:** Login succeeds but navigation still shows "Log in" button

**Possible causes:**
1. `setUser()` not being called in AuthContext
2. Response structure mismatch (check `response.data` structure)
3. localStorage containing old/invalid data

**Debug steps:**
```javascript
// Add console.log in AuthContext.jsx
const login = useCallback(async (formDataApi) => {
    try {
        const response = await loginUser(formDataApi);
        console.log('Full response:', response);
        console.log('response.data:', response.data);
        
        const userData = response.data;
        console.log('userData:', userData);
        
        setUser(userData);
        // ...
    } catch (error) {
        console.error('Login error:', error);
    }
}, []);
```

---

### Issue 2: Username is undefined

**Symptom:** Shows "Hello, undefined" instead of username

**Possible causes:**
1. Backend not returning `username` in response
2. Wrong property name (check if it's `username`, `name`, or `firstName`)
3. User data not properly saved to state

**Debug steps:**
```javascript
// Check what properties user object has
console.log('User object:', user);
console.log('Available properties:', Object.keys(user || {}));
```

---

### Issue 3: Infinite loading state

**Symptom:** Page stuck on loading screen

**Possible causes:**
1. `loading` state not being set to `false`
2. `loading` not exposed in context value
3. Error in `useEffect` preventing `setLoading(false)`

**Debug steps:**
```javascript
// Add loading to context value
const value = {
    user,
    loading,  // ← Add this
    login,
    logout,
    isAuthenticated: !!user
};

// Check loading state in component
const { loading, user } = useAuth();
console.log('Loading:', loading, 'User:', user);
```

---

### Issue 4: Token present but user is undefined

**Symptom:** localStorage shows token but user is null

**Possible causes:**
1. Response destructuring extracting wrong data
2. `setUser()` receiving undefined value
3. localStorage saving "null" as string

**Debug steps:**
```javascript
// Check what's actually being saved
console.log('Before setUser:', userData);
setUser(userData);
console.log('After setUser:', user);  // Will show old value due to async

// Check localStorage
console.log('localStorage user:', localStorage.getItem('user'));
```

---

## Quick Reference: Data Structure

### Login Request Body
```javascript
{
    email: "user@example.com",
    password: "password123"
}
```

### Backend Response
```javascript
{
    success: true,
    message: "Successfully Login",
    data: {
        id: 1,
        username: "john_doe",
        email: "user@example.com",
        token: "jwt_token_here"
    }
}
```

### AuthContext State
```javascript
{
    user: {
        id: 1,
        username: "john_doe",
        email: "user@example.com"
    },
    isAuthenticated: true,
    login: Function,
    logout: Function
}
```

### localStorage
```javascript
// Key: 'user'
// Value: '{"id":1,"username":"john_doe","email":"user@example.com"}'

// Key: 'token'
// Value: 'jwt_token_here'
```

---

## Summary

1. **Login Flow:** Form → AuthContext → AuthService → Backend → AuthContext (stores data)
2. **Display Flow:** AuthContext → useAuth() → Components → UI
3. **Persistence:** localStorage keeps user logged in across page refreshes
4. **Single Source of Truth:** AuthContext manages all authentication state
5. **Re-rendering:** When auth state changes, all components using `useAuth()` automatically re-render

This architecture ensures clean separation of concerns and makes authentication management scalable across your entire application.