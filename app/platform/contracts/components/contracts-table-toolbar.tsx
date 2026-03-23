import { ChevronDown, PlusCircle } from 'lucide-react';
import { Table as ReactTable } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ContractRoleSwitch } from './ContractRoleSwitch';
import { Contract, ContractUserRole } from '../types/contract';

type Props = {
  table: ReactTable<Contract>;
  contractsOwnerType: ContractUserRole | null;
  setContractsOwnerType: (role: ContractUserRole | null) => void;
  onAddNewClick: () => void;
};

export function ContractsTableToolbar({
  table,
  contractsOwnerType,
  setContractsOwnerType,
  onAddNewClick,
}: Props) {
  return (
    <div className="flex items-center py-4">
      <div className="flex gap-4">
        <Input
          placeholder="Filter contracts..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="min-w-[200px] max-w-sm"
        />
        <ContractRoleSwitch
          setActiveRoles={setContractsOwnerType}
          roleActive={contractsOwnerType}
        />
      </div>
      <div className="flex gap-4  justify-end w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }>
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="default" className="ml-auto" onClick={onAddNewClick}>
          Add New <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
