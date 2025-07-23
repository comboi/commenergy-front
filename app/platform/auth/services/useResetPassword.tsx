import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '../../../../lib/api-client';

type ConfirmPasswordResetDto = {
  token: string;
  newPassword: string;
};

const confirmPasswordReset = async (
  data: ConfirmPasswordResetDto
): Promise<void> => {
  await apiClient.post('/auth/password-reset/confirm', data);
};

export function useResetPassword() {
  const router = useRouter();

  const { mutate, ...rest } = useMutation({
    mutationFn: confirmPasswordReset,
    onSuccess: () => {
      toast.success('Password reset successful!', {
        description:
          'Your password has been updated successfully. You can now log in with your new password.',
        duration: 5000,
      });

      // Redirect after a short delay to allow user to read the message
      setTimeout(() => {
        router.push('/platform/auth/login');
      }, 1500);
    },
    onError: (error: any) => {
      console.error('Password reset confirmation error:', error);

      // Handle different error scenarios
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData?.message?.includes('token')) {
          toast.error('Invalid or expired reset token', {
            description:
              'This password reset link has expired or is invalid. Please request a new password reset.',
            duration: 6000,
          });
        } else if (errorData?.message?.includes('password')) {
          toast.error('Password requirements not met', {
            description:
              'Please ensure your password meets the minimum requirements (at least 8 characters).',
            duration: 5000,
          });
        } else {
          toast.error('Invalid request', {
            description:
              errorData?.message ||
              'The password reset request is invalid. Please try again.',
            duration: 5000,
          });
        }
      } else if (error.response?.status === 404) {
        toast.error('Reset token not found', {
          description:
            'This password reset link is no longer valid. Please request a new password reset.',
          duration: 6000,
        });
      } else if (error.response?.status === 429) {
        toast.error('Too many attempts', {
          description:
            "You've made too many password reset attempts. Please wait before trying again.",
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
          'Failed to reset password. Please try again or request a new password reset.';
        toast.error('Password reset failed', {
          description: errorMessage,
          duration: 5000,
        });
      }
    },
  });

  const handleConfirmPasswordReset = (token: string, newPassword: string) => {
    // Add loading feedback
    toast.loading('Resetting your password...', {
      id: 'password-reset-confirm-loading',
    });

    mutate(
      { token, newPassword },
      {
        onSettled: () => {
          // Dismiss loading toast
          toast.dismiss('password-reset-confirm-loading');
        },
      }
    );
  };

  return {
    handleConfirmPasswordReset,
    ...rest,
  };
}
