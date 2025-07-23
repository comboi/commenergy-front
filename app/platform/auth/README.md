# Forgot Password Feature

This folder contains the implementation of the forgot password functionality for the Commenergy platform.

## Structure

```
services/
├── index.ts                    # Exports all services
├── useForgotPassword.tsx      # Hook for requesting password reset
└── useResetPassword.tsx       # Hook for confirming password reset

forgot-password/
└── page.tsx                   # Forgot password request page

reset-password/
└── page.tsx                   # Password reset confirmation page
```

## API Endpoints

The feature uses the following API endpoints defined in the `api-schema.d.ts`:

- `POST /auth/password-reset/request` - Initiates a password reset request
- `POST /auth/password-reset/confirm` - Confirms the password reset with a token

## Usage Flow

1. **Request Password Reset**: User enters their email on `/platform/auth/forgot-password`
2. **Email Sent**: System sends a reset email with a token
3. **Reset Password**: User clicks the link in the email, which takes them to `/platform/auth/reset-password?token=xyz`
4. **Complete Reset**: User enters new password and confirms it

## Services

### useForgotPassword()

Hook for requesting a password reset email.

```tsx
const { handleRequestPasswordReset, isPending } = useForgotPassword();

// Usage
handleRequestPasswordReset('user@example.com');
```

### useResetPassword()

Hook for confirming a password reset with a token.

```tsx
const { handleConfirmPasswordReset, isPending } = useResetPassword();

// Usage
handleConfirmPasswordReset(token, newPassword);
```

## Integration with Login Page

The login page has been updated to include a "Forgot your password?" link that redirects to the forgot password page.

## Error Handling

Both services include comprehensive error handling with user-friendly toast messages:

- Success messages for completed actions
- Error messages for various failure scenarios
- Form validation on the frontend

## Styling

The pages follow the same design patterns as the existing auth pages:

- Centered layout
- Consistent form styling using shadcn/ui components
- Responsive design
- Proper loading states
