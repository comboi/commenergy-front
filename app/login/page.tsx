'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/auth-context';

export default function Login() {
  const { handleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-3xl font-bold">Login</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-white  hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
