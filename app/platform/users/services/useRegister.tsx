import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import apiClient from '../../../../lib/api-client';
import { components } from '../../../../lib/api-schema';

type CreateUserDto = components['schemas']['CreateUserDto'];
type User = components['schemas']['User'];

const registerUser = async (userData: CreateUserDto): Promise<User> => {
  const { data } = await apiClient.post('/users/register', userData);
  return data;
};

export function useRegister() {
  const router = useRouter();

  const { mutate, ...rest } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(
        'Registration successful! Please log in with your credentials.'
      );
      router.push('/platform/auth/login');
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
    },
  });

  const handleRegister = (userData: CreateUserDto) => {
    mutate(userData);
  };

  return {
    handleRegister,
    ...rest,
  };
}
