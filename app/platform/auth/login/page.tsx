'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../contexts/auth-context';

export default function Login() {
  const { handleLogin, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, clearing error and setting loading');
    setError('');
    setIsLoading(true);

    try {
      await handleLogin(email, password);
    } catch (error: any) {
      const errorMessage =
        'Login failed. Please check your credentials and try again.';

      setError(errorMessage);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  // Clear error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  // Debug: Monitor error state changes
  useEffect(() => {
    console.log('Error state changed:', error);
  }, [error]);

  // Debug: Monitor auth state changes
  useEffect(() => {
    console.log(
      'Auth state - isAuthenticated:',
      isAuthenticated,
      'authLoading:',
      authLoading
    );
  }, [isAuthenticated, authLoading]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-3xl font-bold">Login</h1>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Login'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          <Link
            href="/platform/auth/forgot-password"
            className="text-foreground hover:underline">
            Forgot your password?
          </Link>
        </p>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            href="/platform/auth/register"
            className="text-foreground hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
