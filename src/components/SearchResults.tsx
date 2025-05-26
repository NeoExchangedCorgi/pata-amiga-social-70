import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { formatDateBR } from '@/utils/formatters';

interface SearchResult {
  id: string;
  username: string;
  full_name: string;
  bio?: string;
  created_at: string;
  avatar_url?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchTerm: string;
  isLoading: boolean;
}

const SearchResults = ({ results, searchTerm, isLoading }: SearchResultsProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  if (results.length === 0 && searchTerm && !isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum perfil encontrado para "{searchTerm}"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((user) => (
        <Card 
          key={user.id} 
          className="border-foreground/20 cursor-pointer hover:bg-muted/30 transition-colors"
          onClick={() => handleProfileClick(user.username)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.full_name.charAt(0)
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{user.full_name}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                {user.bio && (
                  <p className="text-sm text-foreground mt-1">{user.bio}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Membro desde {formatDateBR(user.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SearchResults;
