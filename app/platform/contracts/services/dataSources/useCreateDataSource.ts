import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

type CreateDataSourceDto = components['schemas']['CreateDataSourceDto'];
type DataSource = components['schemas']['DataSourceResponseDto'];

const createDataSource = async (
  data: CreateDataSourceDto
): Promise<DataSource> => {
  const response = await apiClient.post('/data-sources', data);
  return response.data;
};

type Props = {
  callback?: () => void;
};

export function useCreateDataSource({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation<
    DataSource,
    Error,
    CreateDataSourceDto
  >({
    mutationKey: ['data-sources'],
    mutationFn: (data: CreateDataSourceDto) => createDataSource(data),
    onError: (error) => {
      console.error('Error creating data source:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Data source created successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error creating data source');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    ...rest,
  };
}
