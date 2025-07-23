'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useResetPassword } from '../services';

// Loading component for Suspense fallback
const ResetPasswordLoading = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="w-full max-w-md space-y-4 p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Main reset password component that uses useSearchParams
const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { handleConfirmPasswordReset, isPending, isSuccess } =
    useResetPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const validatePasswordStrength = (password: string) => {
    const strength = {
      hasLength: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordStrength(strength);
    return strength;
  };

  const isPasswordStrong = (strength: typeof passwordStrength) => {
    return Object.values(strength).every(Boolean);
  };

  useEffect(() => {
    if (!token) {
      setError(
        'Invalid or missing reset token. Please request a new password reset.'
      );
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a new password.');
      return;
    }

    const strength = validatePasswordStrength(password);
    if (!strength.hasLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!isPasswordStrong(strength)) {
      setError(
        'Password must contain at least one uppercase letter, lowercase letter, number, and special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      handleConfirmPasswordReset(token, password);
    } catch (error: any) {
      setError('Failed to reset password. Please try again.');
    }
  };

  // Clear error when user starts typing
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePasswordStrength(newPassword);
    if (error) setError('');
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-8 text-center">
          <h1 className="text-3xl font-bold">Invalid Reset Link</h1>
          <p className="text-gray-600">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/platform/auth/forgot-password"
            className="inline-block text-foreground hover:underline">
            Request a new password reset
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-gray-600">Enter your new password below.</p>
        </div>

        <Input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={handlePasswordChange}
          required
          minLength={8}
        />

        {/* Password strength indicator */}
        {password && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Password requirements:
            </p>
            <div className="space-y-1">
              <div
                className={`text-xs flex items-center ${
                  passwordStrength.hasLength
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}>
                <span className="mr-2">
                  {passwordStrength.hasLength ? '✓' : '○'}
                </span>
                At least 8 characters
              </div>
              <div
                className={`text-xs flex items-center ${
                  passwordStrength.hasLower ? 'text-green-600' : 'text-gray-500'
                }`}>
                <span className="mr-2">
                  {passwordStrength.hasLower ? '✓' : '○'}
                </span>
                One lowercase letter
              </div>
              <div
                className={`text-xs flex items-center ${
                  passwordStrength.hasUpper ? 'text-green-600' : 'text-gray-500'
                }`}>
                <span className="mr-2">
                  {passwordStrength.hasUpper ? '✓' : '○'}
                </span>
                One uppercase letter
              </div>
              <div
                className={`text-xs flex items-center ${
                  passwordStrength.hasNumber
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}>
                <span className="mr-2">
                  {passwordStrength.hasNumber ? '✓' : '○'}
                </span>
                One number
              </div>
              <div
                className={`text-xs flex items-center ${
                  passwordStrength.hasSpecial
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}>
                <span className="mr-2">
                  {passwordStrength.hasSpecial ? '✓' : '○'}
                </span>
                One special character
              </div>
            </div>
          </div>
        )}

        <Input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          minLength={8}
        />

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            isPending ||
            !password ||
            !confirmPassword ||
            !isPasswordStrong(passwordStrength)
          }>
          {isPending ? 'Resetting...' : 'Reset Password'}
        </Button>

        {/* Visual feedback for password match */}
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}

        {confirmPassword &&
          password === confirmPassword &&
          password.length > 0 && (
            <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
          )}

        <p className="text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/platform/auth/login"
            className="text-foreground hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

// Main component wrapped with Suspense
const ResetPassword = () => {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPassword;
