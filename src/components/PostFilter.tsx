
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
    <div className="sticky top-32 z-30 bg-background/95 backdrop-blur border-b border-border/50 px-4 py-3">
      <div className="flex items-center space-x-2">
        <Button
          variant={currentSort === 'likes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('likes')}
          className="flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Mais curtidos</span>
        </Button>
        
        <Button
          variant={currentSort === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('recent')}
          className="flex items-center space-x-2"
        >
          <Clock className="h-4 w-4" />
          <span>Mais recentes</span>
        </Button>

        <Button
          variant={currentSort === 'reported' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('reported')}
          className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
        >
          <Flag className="h-4 w-4" />
          <span>Denunciados</span>
        </Button>
      </div>
    </div>
  );
};

export default PostFilter;
