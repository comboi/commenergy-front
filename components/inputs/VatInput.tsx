'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Loader2, User as UserIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUserByVat } from '@/app/users/services/useUserByVat';
import { User } from '@/app/users/model/user';
import UserTooltip from '@/app/users/components/user-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface VatInputProps {
  value: string;
  onChange: (value: string) => void;
  onUserFound?: (user: User) => void;
  onValidationChange?: (isValid: boolean, user?: User) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const VatInput = ({
  value,
  onChange,
  onUserFound,
  onValidationChange,
  placeholder = 'VAT Number',
  className = '',
  disabled = false,
}: VatInputProps) => {
  const [vatToValidate, setVatToValidate] = useState<string>('');
  const [hasBlurred, setHasBlurred] = useState(false);
  const lastValidationRef = useRef<{
    isValid: boolean | null;
    userId: string | null;
  }>({ isValid: null, userId: null });

  // Only trigger the query when we have a VAT to validate and the field has been blurred
  const {
    data: foundUser,
    isLoading,
    error,
    isSuccess,
  } = useUserByVat(vatToValidate, hasBlurred && !!vatToValidate);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Reset validation state when value changes
    if (newValue !== vatToValidate) {
      setVatToValidate('');
      setHasBlurred(false);
      lastValidationRef.current = { isValid: null, userId: null };
    }
  };

  // Handle blur event to trigger validation
  const handleBlur = () => {
    const trimmedValue = value.trim();
    setHasBlurred(true);

    if (trimmedValue && trimmedValue !== vatToValidate) {
      setVatToValidate(trimmedValue);
    }
  };

  // Notify parent components when validation changes
  useEffect(() => {
    if (hasBlurred && vatToValidate) {
      let currentIsValid: boolean | null = null;
      let currentUserId: string | null = null;

      if (isSuccess && foundUser) {
        currentIsValid = true;
        currentUserId = foundUser.id;
      } else if (error) {
        currentIsValid = false;
        currentUserId = null;
      }

      // Only call callbacks if the validation state has actually changed
      const hasChanged =
        lastValidationRef.current.isValid !== currentIsValid ||
        lastValidationRef.current.userId !== currentUserId;

      if (hasChanged && currentIsValid !== null) {
        lastValidationRef.current = {
          isValid: currentIsValid,
          userId: currentUserId,
        };

        if (currentIsValid && foundUser) {
          onUserFound?.(foundUser);
          onValidationChange?.(true, foundUser);
        } else {
          onValidationChange?.(false);
        }
      }
    }
  }, [isSuccess, foundUser, error, hasBlurred, vatToValidate]);

  // Determine validation state
  const getValidationStatus = () => {
    if (!hasBlurred || !vatToValidate) return null;

    if (isLoading) return 'loading';
    if (isSuccess && foundUser) return 'valid';
    if (error) return 'invalid';

    return null;
  };

  const validationStatus = getValidationStatus();

  // Determine input styling based on validation

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {validationStatus === 'loading' && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          {validationStatus === 'valid' && foundUser && (
            <Tooltip>
              <TooltipContent side="top" align="center">
                {foundUser.email}
              </TooltipContent>
              <TooltipTrigger asChild>
                <UserIcon className="h-4 w-4" />
              </TooltipTrigger>
            </Tooltip>
          )}
          {validationStatus === 'invalid' && (
            <Tooltip>
              <TooltipContent side="top" align="center">
                VAT number not found or invalid
              </TooltipContent>
              <TooltipTrigger asChild>
                <XCircle className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default VatInput;
