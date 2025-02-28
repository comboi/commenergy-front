import { Community } from '@/app/communities/model/community';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  community: Community;
};

export function CommunityDetails({ community }: Props) {
  const { status, contracts, power, type, address } = community;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
            {status}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{contracts}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Power</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{power}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
              90/100
            </span>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div>{address}</div>
        </CardContent>
      </Card>
    </div>
  );
}
