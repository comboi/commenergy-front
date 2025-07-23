import { CommunityContract } from '@/app/platform/communities/model/communityContract';
import { Contract } from '@/app/platform/contracts/model/contract';
import { Sharing } from '@/app/platform/sharings/model/sharing';
import { Button } from '@/components/ui/button';

type Props = {
  isDirty: boolean;
  sharingActiveVersion:
    | {
        id: string;
        name: string;
        isProductionVersion: boolean;
        createdDate: string;
        updatedDate: string;
        communityId: string;
      }
    | undefined;
  onUndo: () => void;
  onCreateNewVersion: () => void;
  onUpdateVersion: () => void;
  sharings: CommunityContract['sharing'][] | null;
};

export const SharingsVersionUpdateBar = ({
  isDirty,
  sharingActiveVersion,
  onUndo,
  onCreateNewVersion,
  onUpdateVersion,
  sharings,
}: Props) => {
  const totalUsedCapacity =
    Math.round(
      (sharings?.reduce((acc, sharing) => acc + (sharing?.share ?? 0), 0) ??
        0) *
        100 *
        10000
    ) / 10000;

  return (
    <div
      className={`transition-all sticky flex justify-between items-center gap-2 ${
        isDirty ? 'block' : 'hidden'
      } left-0 p-4 bg-slate-200 rounded-sm text-black bottom-0`}>
      <div className="flex flex-wrap gap-4">
        {sharingActiveVersion
          ? `Editing: ${sharingActiveVersion.name}`
          : 'Create your first version'}
        <span
          className={`rounded px-2 py-1 text-xs ${
            totalUsedCapacity > 100
              ? 'bg-red-500 text-white'
              : 'bg-gray-500 text-white'
          }`}>
          {`${totalUsedCapacity}/100%`}
        </span>
      </div>
      <div className="flex gap-4">
        <Button
          size="sm"
          variant="link"
          className="text-black"
          onClick={onUndo}>
          Undo
        </Button>
        <Button size="sm" variant="secondary" onClick={onCreateNewVersion}>
          Create new version
        </Button>
        {sharingActiveVersion && (
          <Button size="sm" variant="secondary" onClick={onUpdateVersion}>
            Update version
          </Button>
        )}
      </div>
    </div>
  );
};
