import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '../../../../lib/api-client';

type RequestPasswordResetDto = {
  email: string;
};

const requestPasswordReset = async (
  data: RequestPasswordResetDto
): Promise<void> => {
  await apiClient.post('/auth/password-reset/request', data);
};

export function useForgotPassword() {
  const { mutate, ...rest } = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      toast.success('Password reset email sent successfully!', {
        description:
          "Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam folder.",
        duration: 6000,
      });
    },
    onError: (error: any) => {
      console.error('Password reset request error:', error);

      // Handle different error scenarios
      if (error.response?.status === 404) {
        toast.error('Email address not found', {
          description:
            'The email address you entered is not associated with any account. Please check and try again.',
          duration: 5000,
        });
      } else if (error.response?.status === 429) {
        toast.error('Too many requests', {
          description:
            "You've requested too many password resets. Please wait a few minutes before trying again.",
          duration: 5000,
        });
      } else if (error.response?.status >= 500) {
        toast.error('Server error', {
          description:
            'Our servers are experiencing issues. Please try again in a few moments.',
          duration: 5000,
        });
      } else {
        const errorMessage =
          error.response?.data?.message ||
          'Failed to send password reset email. Please check your email address and try again.';
        toast.error('Password reset failed', {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });

  const handleRequestPasswordReset = (email: string) => {
    // Add loading feedback
    toast.loading('Sending password reset email...', {
      id: 'password-reset-loading',
    });

    mutate(
      { email },
      {
        onSettled: () => {
          // Dismiss loading toast
          toast.dismiss('password-reset-loading');
        },
      }
    );
  };

  return {
    handleRequestPasswordReset,
    ...rest,
  };
}
