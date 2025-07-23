'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserByVat } from '../../users/services/useUserByVat';
import { useRegister } from '../../users/services/useRegister';

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
  const [vatToCheck, setVatToCheck] = useState('');
  const [showVatInfo, setShowVatInfo] = useState(false);

  // Query to check if user exists by VAT
  const { data: existingUser, error: vatError } = useUserByVat(
    vatToCheck,
    showVatInfo
  );

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleVatBlur = () => {
    if (formData.vat.trim()) {
      setVatToCheck(formData.vat.trim());
      setShowVatInfo(true);
    } else {
      setShowVatInfo(false);
    }
  };

  const renderVatFeedback = () => {
    if (!showVatInfo || !vatToCheck) return null;

    // If there's an error (404), it means user doesn't exist, which is good for registration
    if (vatError) {
      return null; // Don't show anything if user doesn't exist
    }

    // If user exists, show appropriate message based on status
    if (existingUser) {
      if (existingUser.status === 'PENDING_TO_CLAIM') {
        return (
          <Alert>
            <AlertDescription>
              This VAT number is in our system and pending to be claimed. By
              registering, you will set the email and password for this account.
            </AlertDescription>
          </Alert>
        );
      } else {
        return (
          <Alert variant="destructive">
            <AlertDescription>
              This VAT number is already registered in our system. Please use a
              different VAT number or contact support.
            </AlertDescription>
          </Alert>
        );
      }
    }

    return null;
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
          onBlur={handleVatBlur}
          required
        />

        {renderVatFeedback()}

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
          <Link
            href="/platform/auth/login"
            className="text-foreground  hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
