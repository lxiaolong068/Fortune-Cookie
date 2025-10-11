# Error Boundary Usage Guide

## Overview

The `ErrorBoundary` component provides graceful error handling for React components, preventing the entire application from crashing when an error occurs in a component tree.

## Features

- ✅ **Automatic Error Logging** - Integrates with ErrorMonitor system
- ✅ **Retry Functionality** - Exponential backoff for retries (up to 5 attempts)
- ✅ **Custom Fallback UI** - Support for custom error displays
- ✅ **Error Count Tracking** - Prevents infinite error loops
- ✅ **Component Name Tracking** - Identifies which component failed
- ✅ **Reset Keys** - Automatic reset when dependencies change
- ✅ **Development Mode** - Shows detailed error information in development

---

## Basic Usage

### 1. Wrap Individual Components

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

function MyPage() {
  return (
    <ErrorBoundary componentName="MyComponent">
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### 2. Using the Wrapper Function

```tsx
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary'

function MyPage() {
  return (
    <ErrorBoundaryWrapper componentName="MyComponent">
      <MyComponent />
    </ErrorBoundaryWrapper>
  )
}
```

### 3. Using Higher-Order Component

```tsx
import { withErrorBoundary } from '@/components/ErrorBoundary'

const SafeComponent = withErrorBoundary(MyComponent, {
  componentName: 'MyComponent',
  onError: (error, errorInfo) => {
    console.error('Component error:', error)
  }
})

// Use SafeComponent instead of MyComponent
<SafeComponent />
```

### 4. Simple Error Boundary

```tsx
import { SimpleErrorBoundary } from '@/components/ErrorBoundary'

function MyPage() {
  return (
    <SimpleErrorBoundary message="Failed to load content">
      <MyComponent />
    </SimpleErrorBoundary>
  )
}
```

---

## Advanced Usage

### Custom Fallback UI

```tsx
<ErrorBoundary
  componentName="CustomComponent"
  fallback={
    <div className="p-8 text-center">
      <h2>Custom Error Message</h2>
      <p>Something went wrong with this component.</p>
      <button onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### Custom Error Handler

```tsx
<ErrorBoundary
  componentName="MyComponent"
  onError={(error, errorInfo) => {
    // Custom error handling logic
    console.error('Error occurred:', error)
    console.error('Component stack:', errorInfo.componentStack)
    
    // Send to analytics
    analytics.track('component_error', {
      component: 'MyComponent',
      error: error.message,
    })
  }}
>
  <MyComponent />
</ErrorBoundary>
```

### Reset Keys for Automatic Recovery

```tsx
function ParentComponent() {
  const [userId, setUserId] = useState('user1')
  
  return (
    <ErrorBoundary
      componentName="UserProfile"
      resetKeys={[userId]} // Reset error boundary when userId changes
    >
      <UserProfile userId={userId} />
    </ErrorBoundary>
  )
}
```

---

## Implementation Examples

### Example 1: Wrapping Page Components

```tsx
// app/page.tsx
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary'
import { FortuneCookie } from '@/components/FortuneCookie'

export default function HomePage() {
  return (
    <main>
      <ErrorBoundaryWrapper componentName="FortuneCookie">
        <FortuneCookie />
      </ErrorBoundaryWrapper>
    </main>
  )
}
```

### Example 2: Wrapping Multiple Components

```tsx
// app/generator/page.tsx
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary'
import { AIFortuneCookie } from '@/components/AIFortuneCookie'
import { UserHistory } from '@/components/UserHistory'

export default function GeneratorPage() {
  return (
    <main>
      <ErrorBoundaryWrapper componentName="AIFortuneCookie">
        <AIFortuneCookie />
      </ErrorBoundaryWrapper>
      
      <ErrorBoundaryWrapper componentName="UserHistory">
        <UserHistory />
      </ErrorBoundaryWrapper>
    </main>
  )
}
```

### Example 3: Nested Error Boundaries

```tsx
// app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ErrorBoundary componentName="RootLayout">
          <Navigation />
          
          <ErrorBoundary componentName="MainContent">
            {children}
          </ErrorBoundary>
          
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
```

---

## Error Boundary Behavior

### Error Count Tracking

The ErrorBoundary tracks how many times an error has occurred:

- **0-2 errors**: Shows "Try Again" button
- **3-4 errors**: Shows warning message + "Try Again" button
- **5+ errors**: Shows "Go to Homepage" button (prevents infinite loops)

### Exponential Backoff

Retry delays increase exponentially:

- 1st retry: 1 second delay
- 2nd retry: 2 seconds delay
- 3rd retry: 4 seconds delay
- 4th retry: 8 seconds delay
- 5th retry: 10 seconds delay (max)

### Reset Keys

When `resetKeys` change, the error boundary automatically resets if error count < 5:

```tsx
<ErrorBoundary resetKeys={[userId, dataVersion]}>
  <MyComponent />
</ErrorBoundary>
```

---

## Integration with ErrorMonitor

The ErrorBoundary automatically logs errors to the ErrorMonitor system:

```typescript
// Automatic logging
this.errorMonitor.captureError(error, {
  component: componentName || 'ErrorBoundary',
  action: 'componentDidCatch',
  additionalData: {
    componentStack: errorInfo.componentStack,
    errorCount: errorCount + 1,
    errorId,
  },
}, 'error')

// User action logging
this.errorMonitor.captureUserAction(
  'retry',
  componentName || 'ErrorBoundary',
  undefined,
  { errorCount, delay }
)
```

---

## Best Practices

### 1. **Wrap at Appropriate Levels**

- ✅ Wrap individual features/components
- ✅ Wrap page-level components
- ❌ Don't wrap every single small component
- ❌ Don't wrap the entire app (use nested boundaries)

### 2. **Provide Component Names**

Always provide a `componentName` for better error tracking:

```tsx
<ErrorBoundary componentName="AIFortuneCookie">
  <AIFortuneCookie />
</ErrorBoundary>
```

### 3. **Use Custom Error Handlers for Critical Components**

```tsx
<ErrorBoundary
  componentName="PaymentForm"
  onError={(error) => {
    // Send to error tracking service
    trackError('payment_form_error', error)
  }}
>
  <PaymentForm />
</ErrorBoundary>
```

### 4. **Test Error Scenarios**

Create a test component to verify error boundaries work:

```tsx
function ErrorTestComponent() {
  const [shouldError, setShouldError] = useState(false)
  
  if (shouldError) {
    throw new Error('Test error!')
  }
  
  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error
    </button>
  )
}

// Wrap with ErrorBoundary and test
<ErrorBoundary componentName="ErrorTest">
  <ErrorTestComponent />
</ErrorBoundary>
```

---

## Components to Wrap

### High Priority (Must Wrap)

1. ✅ **AIFortuneCookie** - Main AI generator component
2. ✅ **FortuneCookie** - Original fortune cookie component
3. ✅ **UserHistory** - User history component
4. ✅ **Navigation** - Navigation component
5. ✅ **BackgroundEffects** - Animation-heavy component

### Medium Priority (Should Wrap)

6. **ThemeToggle** - Theme switching component
7. **UserPreferences** - User preferences component
8. **DynamicChart** - Chart components

### Low Priority (Optional)

9. UI components (Button, Card, etc.) - Usually don't need wrapping
10. Static components - No error risk

---

## Troubleshooting

### Error Boundary Not Catching Errors

**Problem**: Error boundary doesn't catch the error

**Solutions**:
1. Error boundaries only catch errors in **child components**
2. They don't catch errors in:
   - Event handlers (use try-catch)
   - Asynchronous code (use try-catch)
   - Server-side rendering
   - Errors in the error boundary itself

```tsx
// ❌ Won't be caught
<ErrorBoundary>
  <button onClick={() => {
    throw new Error('Not caught!')
  }}>
    Click
  </button>
</ErrorBoundary>

// ✅ Will be caught
<ErrorBoundary>
  <ComponentThatThrowsInRender />
</ErrorBoundary>
```

### Infinite Error Loops

**Problem**: Component keeps erroring and retrying

**Solution**: Error boundary automatically stops after 5 errors

```tsx
// Error count tracking prevents infinite loops
if (errorCount >= 5) {
  console.error('ErrorBoundary: Too many errors, not resetting')
  return
}
```

---

## API Reference

### ErrorBoundary Props

```typescript
interface Props {
  children: ReactNode
  fallback?: ReactNode              // Custom fallback UI
  onError?: (error: Error, errorInfo: ErrorInfo) => void  // Custom error handler
  componentName?: string             // Component name for tracking
  resetKeys?: Array<string | number> // Keys to trigger reset
}
```

### ErrorBoundary State

```typescript
interface State {
  hasError: boolean      // Whether an error occurred
  error?: Error          // The error object
  errorId?: string       // Unique error ID
  errorCount: number     // Number of errors
}
```

---

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

function ThrowError() {
  throw new Error('Test error')
}

test('ErrorBoundary catches errors', () => {
  render(
    <ErrorBoundary componentName="Test">
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

---

## Summary

The ErrorBoundary component provides robust error handling with:

- ✅ Automatic error logging
- ✅ Retry functionality with exponential backoff
- ✅ Error count tracking (prevents infinite loops)
- ✅ Custom fallback UI support
- ✅ Integration with ErrorMonitor
- ✅ Development mode error details
- ✅ Component name tracking
- ✅ Reset keys for automatic recovery

**Next Steps**:
1. Wrap all high-priority components
2. Test error scenarios
3. Monitor error logs in production
4. Adjust retry strategies as needed

