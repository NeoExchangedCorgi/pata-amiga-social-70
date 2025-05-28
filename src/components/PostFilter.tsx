
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
    <div className="sticky top-32 z-30 bg-background/95 backdrop-blur border-b border-border/50 px-2 sm:px-4 py-3">
      <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
        <Button
          variant={currentSort === 'likes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('likes')}
          className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm"
        >
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Mais curtidos</span>
          <span className="sm:hidden">Curtidos</span>
        </Button>
        
        <Button
          variant={currentSort === 'recent' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('recent')}
          className="flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm"
        >
          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Mais recentes</span>
          <span className="sm:hidden">Recentes</span>
        </Button>

        <Button
          variant={currentSort === 'reported' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('reported')}
          className={`flex items-center space-x-1 sm:space-x-2 whitespace-nowrap text-xs sm:text-sm ${
            currentSort === 'reported' 
              ? 'bg-red-200 text-black border-red-300 hover:bg-red-300' 
              : 'text-red-600 border-red-200 hover:bg-red-50'
          }`}
        >
          <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Denunciados</span>
          <span className="sm:hidden">Denúncias</span>
        </Button>
      </div>
    </div>
  );
};

export default PostFilter;
