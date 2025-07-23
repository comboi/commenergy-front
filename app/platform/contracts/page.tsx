import { ContractsTable } from '@/app/platform/contracts/components/contracts-table';

export default function ContractsPage() {
  return (
    <div className="space-y-4 py-8">
      <h1 className="text-3xl font-bold">Contracts</h1>
      <ContractsTable />
    </div>
  );
}
