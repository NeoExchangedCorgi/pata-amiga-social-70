
import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock } from 'lucide-react';

export type SortType = 'likes' | 'recent';

interface PostFilterProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

const PostFilter = ({ currentSort, onSortChange }: PostFilterProps) => {
  return (
    <div className="flex space-x-2 p-4 border-b border-border/50">
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
    </div>
  );
};

export default PostFilter;
