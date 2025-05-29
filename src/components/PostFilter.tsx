
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Flag } from 'lucide-react';

export type SortType = 'likes' | 'recent' | 'reported';

interface PostFilterProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const PostFilter = ({ currentSort, onSortChange }: PostFilterProps) => {
  return (
    <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border/50 px-1 sm:px-2 py-2 sm:py-3 mb-3 sm:mb-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full max-w-sm mx-auto">
        <Button
          variant={currentSort === 'likes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('likes')}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-0 flex-1"
        >
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Curtidos</span>
        </Button>
        
        <Button
          variant={currentSort === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('recent')}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-0 flex-1"
        >
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Recentes</span>
        </Button>

        <Button
          variant={currentSort === 'reported' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('reported')}
          className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-0 flex-1"
        >
          <Flag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
          <span className="truncate">Denúncias</span>
        </Button>
      </div>
    </div>
  );
};

export default PostFilter;
