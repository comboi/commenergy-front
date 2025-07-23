import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client';
import { components } from '@/lib/api-schema';

type UpdateDataSourceDto = components['schemas']['UpdateDataSourceDto'];
type DataSource = components['schemas']['DataSourceResponseDto'];

const updateDataSource = async (
  id: string,
  data: UpdateDataSourceDto
): Promise<DataSource> => {
  const response = await apiClient.put(`/data-sources/${id}`, data);
  return response.data;
};

type Props = {
  callback?: () => void;
};

export function useUpdateDataSource({ callback }: Props) {
  const { data, error, isSuccess, isError, ...rest } = useMutation<
    DataSource,
    Error,
    { id: string; data: UpdateDataSourceDto }
  >({
    mutationKey: ['data-sources'],
    mutationFn: ({ id, data }) => updateDataSource(id, data),
    onError: (error) => {
      console.error('Error updating data source:', error);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('Data source updated successfully');
      callback?.();
    } else if (isError) {
      toast.error('Error updating data source');
    }
  }, [error, isSuccess, isError, callback]);

  return {
    data: data ?? null,
    error,
    ...rest,
  };
}
