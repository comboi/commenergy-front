import { CommunitiesTable } from '@/app/platform/communities/components/communities-table/communities-table';

export default function CommunitiesPage() {
  return (
    <div className="space-y-4 w-full py-8">
      <h1 className="text-3xl font-bold">Communities</h1>
      <CommunitiesTable />
    </div>
  );
}
