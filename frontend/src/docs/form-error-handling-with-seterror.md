# Form Error Handling with setError (React Hook Form)

This guide explains how to properly use `setError` from React Hook Form to handle both field-level and server-side errors.

---

## Table of Contents

1. [Overview](#overview)
2. [Setup](#setup)
3. [Types of Errors](#types-of-errors)
4. [Field-Level Errors](#field-level-errors)
5. [Server Errors (Root Errors)](#server-errors-root-errors)
6. [Displaying Errors](#displaying-errors)
7. [Complete Example](#complete-example)
8. [Best Practices](#best-practices)

---

## Overview

React Hook Form provides the `setError` function to manually set errors on form fields or the entire form. This is useful for:

- **Field validation errors** - Errors on specific input fields
- **Server/API errors** - Errors returned from backend (e.g., "Invalid credentials")

---

## Setup

### 1. Import and Destructure

```javascript
import { useForm } from "react-hook-form";

const MyForm = () => {
    const { 
        register,           // Register inputs
        handleSubmit,       // Handle form submission
        setError,           // Manually set errors
        formState: { errors }  // Access error state
    } = useForm({
        mode: 'onSubmit',      // Validate on submit
        reValidateMode: 'onChange'  // Re-validate on change after submit
    });
};
```

### 2. Configuration Options

| Option | Description |
|--------|-------------|
| `mode: 'onSubmit'` | Validate only when form is submitted |
| `mode: 'onTouched'` | Validate when input loses focus |
| `mode: 'onChange'` | Validate on every keystroke |
| `reValidateMode: 'onChange'` | After submit, re-validate on change |

---

## Types of Errors

### 1. Field-Level Errors

Errors attached to specific form fields (e.g., email, password).

```javascript
setError('email', {
    type: 'required',
    message: 'Email is required'
});
```

### 2. Server Errors (Root Errors)

Errors that apply to the entire form, typically from API responses.

```javascript
setError('root.serverError', {
    type: 'server',
    message: 'Invalid credentials'
});
```

**Why use `root.serverError`?**
- It doesn't attach to any specific field
- It's accessed via `errors.root?.serverError?.message`
- Perfect for authentication errors that don't belong to one field

---

## Field-Level Errors

### Setting Field Errors

```javascript
// In your submit handler
const onSubmit = async (formData) => {
    // Check if email already exists
    const exists = await checkEmailExists(formData.email);
    if (exists) {
        setError('email', {
            type: 'custom',
            message: 'This email is already registered'
        });
    }
};
```

### Registering Fields with Validation

```javascript
<Input 
    type="email" 
    placeholder="Email"
    {...register("email", {
        required: "Email is required",
        pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format"
        }
    })}
/>
```

### Displaying Field Errors

```javascript
{errors.email && (
    <p className="error-text">
        {errors.email.message}
    </p>
)}
```

---

## Server Errors (Root Errors)

### When to Use Root Errors

Use `root.serverError` for errors that:
- Come from the backend API
- Don't belong to a specific field
- Apply to the entire form (e.g., "Invalid credentials", "Account locked")

### Setting Server Errors

```javascript
const onSubmit = async (formData) => {
    try {
        await loginUser(formData);
        // Success - navigate away
        navigate('/');
    } catch (error) {
        // Extract error message from API response
        const message = error.response?.data?.message 
                       || error.message 
                       || "Something went wrong";
        
        // Set as root server error
        setError("root.serverError", {
            type: "server",
            message
        });
    }
};
```

### Displaying Server Errors

```javascript
// Extract the error message
const error = errors.root?.serverError?.message;

// Display with animation
<AnimatePresence>
    {error && (
        <motion.p
            key="server-error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-orange-500 text-[12px] bg-orange-200 py-[5px] px-[10px] rounded"
        >
            {error}
        </motion.p>
    )}
</AnimatePresence>
```

---

## Displaying Errors

### Combined Error Display

You can combine field errors and server errors:

```javascript
// Get any error (field or server)
const error = errors.email?.message 
           || errors.password?.message 
           || errors.root?.serverError?.message;

// Display
{error && (
    <div className="error-container">
        {error}
    </div>
)}
```

### Individual Field Error Display

```javascript
<form>
    {/* Email Field */}
    <Input {...register("email", { required: "Email is required" })} />
    {errors.email && <span>{errors.email.message}</span>}
    
    {/* Password Field */}
    <Input {...register("password", { required: "Password is required" })} />
    {errors.password && <span>{errors.password.message}</span>}
    
    {/* Server Error (applies to whole form) */}
    {errors.root?.serverError && (
        <div className="server-error">
            {errors.root.serverError.message}
        </div>
    )}
    
    <button type="submit">Login</button>
</form>
```

---

## Complete Example

### LoginForm.jsx

```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "../service/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/authContext";

const Login = () => {
    const { 
        register, 
        handleSubmit,
        setError, 
        formState: { errors } 
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    // Combine all possible errors
    const error = errors.email?.message 
               || errors.password?.message 
               || errors.root?.serverError?.message;

    const onSubmit = async (formData) => {
        try {
            await login(formData);
            toast.success("Successfully Logged in");
            navigate('/');
        } catch (error) {
            // Extract meaningful error message
            const message = error.response?.data?.message 
                          || error.message 
                          || "Invalid credentials";
            
            // Set as root server error
            setError("root.serverError", {
                type: "server",
                message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Animated Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        key="input-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="text-orange-500 text-[12px] bg-orange-200 py-[5px] px-[10px] rounded"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="input-box">
                <Input
                    type="text"
                    placeholder="Email"
                    {...register("email", {
                        required: "Email is required"
                    })}
                />
            </div>

            {/* Password Input */}
            <div className="input-box">
                <Input
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                    {...register("password", {
                        required: "Password is required"
                    })}
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
```

---

## Best Practices

### 1. Always Provide Fallback Messages

```javascript
// Good - Has fallback
const message = error.response?.data?.message 
              || error.message 
              || "Something went wrong";

// Bad - Might be undefined
const message = error.response?.data?.message;
```

### 2. Use Root Errors for API Responses

```javascript
// Good - API error applies to whole form
setError("root.serverError", {
    type: "server",
    message: "Invalid email or password"
});

// Bad - Don't attach API errors to specific fields unless they belong there
setError("email", {
    type: "server",
    message: "Invalid email or password"  // This isn't specifically an email error
});
```

### 3. Clear Errors on Successful Submission

React Hook Form automatically clears errors on successful submission. But if you need manual control:

```javascript
const onSubmit = async (formData) => {
    // Clear specific field error
    clearErrors("email");
    
    // Clear all errors
    clearErrors();
    
    // Then proceed
    await loginUser(formData);
};
```

### 4. Use AnimatePresence for Smooth Error Display

```javascript
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence>
    {error && (
        <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
        >
            {error}
        </motion.p>
    )}
</AnimatePresence>
```

### 5. Validate on Change After Submit

```javascript
const { register, handleSubmit, setError, formState: { errors } } = useForm({
    mode: 'onSubmit',          // Validate on submit
    reValidateMode: 'onChange' // After submit, re-validate on change
});
```

This ensures:
- Form doesn't show errors before first submit
- After submit, errors update in real-time as user types

---

## Error Object Structure

### Field Error

```javascript
errors.email = {
    type: "required",      // Error type (required, pattern, custom, etc.)
    message: "Email is required"  // Error message
}
```

### Root Error

```javascript
errors.root = {
    serverError: {
        type: "server",
        message: "Invalid credentials"
    }
}
```

### Accessing Errors

```javascript
// Field error
errors.email?.message

// Root error
errors.root?.serverError?.message

// Check if specific field has error
errors.email  // undefined if no error, object if error exists
```

---

## Summary

| Task | Code |
|------|------|
| **Set field error** | `setError('email', { type: 'custom', message: 'Error' })` |
| **Set server error** | `setError('root.serverError', { type: 'server', message: 'Error' })` |
| **Get field error** | `errors.email?.message` |
| **Get server error** | `errors.root?.serverError?.message` |
| **Clear all errors** | `clearErrors()` |
| **Clear specific error** | `clearErrors('email')` |

---

## Quick Reference

```javascript
// 1. Setup
const { register, handleSubmit, setError, formState: { errors } } = useForm();

// 2. Submit handler with error handling
const onSubmit = async (data) => {
    try {
        await apiCall(data);
    } catch (error) {
        setError("root.serverError", {
            type: "server",
            message: error.response?.data?.message || error.message
        });
    }
};

// 3. Display errors
{errors.root?.serverError?.message && (
    <p>{errors.root.serverError.message}</p>
)}

// 4. Register fields with validation
<input {...register("email", { required: "Required" })} />
{errors.email && <p>{errors.email.message}</p>}