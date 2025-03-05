import { CommunitiesTable } from '@/app/communities/components/communities-table/communities-table';

export default function CommunitiesPage() {
  return (
    <div className="space-y-4 w-full">
      <h1 className="text-3xl font-bold">Communities</h1>
      <CommunitiesTable />
    </div>
  );
}
