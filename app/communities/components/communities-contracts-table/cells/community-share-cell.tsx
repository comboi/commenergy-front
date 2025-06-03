import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommunityContract } from '@/app/communities/model/communityContract';
import { getSharingDifference } from '../utils/get-sharing-difference';

type CommunityShareCellProps = {
  communityContract: CommunityContract;
  originalData: CommunityContract[];
  onEditSharing: (
    communityContract: CommunityContract,
    newValue: number
  ) => void;
};

export const CommunityShareCell = memo<CommunityShareCellProps>(
  ({
    communityContract,
    originalData,
    onEditSharing,
  }: CommunityShareCellProps) => {
    const hasShare = communityContract.sharing;
    const communityShare = (
      (communityContract.sharing?.share ?? 0) * 100
    ).toFixed(2);

    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const dirtyDifference = getSharingDifference(
      originalData,
      communityContract
    );
    const isShareEdited = dirtyDifference !== 0;

    return communityContract.contract.contractType === 'GENERATION' ? (
      <div className="text-gray-400">{'-'}</div>
    ) : (
      <div
        className="relative flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {isEditing ? (
          <Input
            type="number"
            defaultValue={communityShare}
            onBlur={(e) => {
              setIsEditing(false);
              onEditSharing(
                communityContract,
                Number((Number(e.target.value) / 100).toFixed(4))
              );
            }}
            autoFocus
            className="w-20"
            min={0}
            max={100}
            step={1}
          />
        ) : (
          <div
            className="cursor-pointer flex items-center space-x-2"
            onClick={() => setIsEditing(true)}>
            <span>{hasShare ? `${communityShare}%` : '-'}</span>
            {isShareEdited && !isHovered && (
              <span className="flex items-center">
                {dirtyDifference > 0 ? (
                  <ChevronUp className="w-3 h-3 text-green-600 mr-1" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-red-600 mr-1" />
                )}
                {`${Math.abs(dirtyDifference)}%`}
              </span>
            )}
          </div>
        )}
        {isHovered && !isEditing && (
          <Button
            variant="ghost"
            className="h-8 w-8 ml-4"
            onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);

CommunityShareCell.displayName = 'CommunityShareCell';
