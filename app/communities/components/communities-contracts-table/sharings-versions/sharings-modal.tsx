import {
  useDeleteSharingVersion,
  useSetProductionSharingVersions,
  useSharingVersions,
} from '@/app/sharings/services/useSharingVersions';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui/table';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SharingVersion } from '@/app/sharings/model/sharingVersion';
import { useEffect, useState } from 'react';
import { TrashIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import localEsDateFormatter from '@/utils/date-formatters';

type Props = {
  communityId: string;
  onClose: () => void;
};

const SharingsModal = ({ communityId, onClose }: Props) => {
  const [data, setData] = useState<SharingVersion[]>([]);
  const { data: sharingVersions, refetch } = useSharingVersions(communityId);
  const { mutate: deleteSharingVersion } = useDeleteSharingVersion({
    callback: refetch,
  });

  const { mutate: updateSharingVersion } = useSetProductionSharingVersions({
    callback: refetch,
  });

  useEffect(() => {
    setData(sharingVersions ?? []);
  }, [sharingVersions]);

  // Force refetch when the modal is opened or communityId changes
  useEffect(() => {
    refetch();
  }, [communityId]);

  const handleDeleteSharingVersion = (sharingVersionId: string) => {
    deleteSharingVersion(sharingVersionId);
  };

  const columns: ColumnDef<SharingVersion>[] = [
    {
      header: 'Version Name',
      cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
      header: 'Updated Date',
      cell: ({ row }) => (
        <div>{localEsDateFormatter(row.original.updatedDate)}</div>
      ),
    },
    {
      header: 'Is active version',
      cell: ({ row }) => (
        <div>
          <Checkbox
            checked={row.original.isProductionVersion}
            onClick={() => updateSharingVersion(row.original.id)}
          />
        </div>
      ),
    },
    {
      header: () => <div className="text-right">Actions</div>,
      id: 'actions',
      cell: ({ row }) => {
        const sharing = row.original;
        return (
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                handleDeleteSharingVersion(sharing.id);
              }}>
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody columnsNumber={columns.length}>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DialogFooter className="mt-8">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </div>
  );
};

export { SharingsModal };
