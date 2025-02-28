import { ContractsTable } from '@/app/contracts/components/contracts-table';

export default function ContractsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Contracts</h1>
      <ContractsTable />
    </div>
  );
}
