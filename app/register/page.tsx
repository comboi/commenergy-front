'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRegister } from '../users/services/useRegister';

export default function Register() {
  const { handleRegister, isPending } = useRegister();
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    vat: '',
    mobile: '',
    name: '',
    password: '',
  });

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.vat.trim() ||
      !formData.mobile.trim() ||
      !formData.password.trim()
    ) {
      return;
    }

    // Generate a UUID for the user ID
    const userId = crypto.randomUUID();

    handleRegister({
      ...formData,
      id: userId,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-3xl font-bold">Register</h1>

        <Input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleInputChange('name')}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          required
        />

        <Input
          type="text"
          placeholder="VAT Number (e.g., 7311413M)"
          value={formData.vat}
          onChange={handleInputChange('vat')}
          required
        />

        <Input
          type="tel"
          placeholder="Mobile Phone (e.g., 666666666)"
          value={formData.mobile}
          onChange={handleInputChange('mobile')}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange('password')}
          required
          minLength={6}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating Account...' : 'Register'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
