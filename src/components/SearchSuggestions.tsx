import { useState, useEffect, useRef } from "react";
import { Search, Clock } from "lucide-react";
import { apiService } from "@/services/api";

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  onSearch: (query: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const SearchSuggestions = ({ 
  query, 
  onSuggestionClick, 
  onSearch, 
  isVisible, 
  onClose 
}: SearchSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🔍 SearchSuggestions useEffect triggered:', { query, queryLength: query.length });
    if (query.length >= 2) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching suggestions for:', searchQuery);
      console.log('🌐 API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001/api');
      
      const response = await apiService.getSearchSuggestions(searchQuery);
      console.log('📡 Suggestions response:', response);
      
      if (response.status === 'success' && response.data?.suggestions) {
        console.log('✅ Setting suggestions:', response.data.suggestions);
        setSuggestions(response.data.suggestions);
      } else {
        console.log('❌ No suggestions in response');
        setSuggestions([]);
      }
    } catch (error) {
      console.error('💥 Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isVisible || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          onSuggestionClick(suggestions[selectedIndex]);
        } else {
          onSearch(query);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick(suggestion);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible || (query.length < 2 && suggestions.length === 0)) {
    console.log('🚫 SearchSuggestions not rendering:', { isVisible, queryLength: query.length, suggestionsLength: suggestions.length });
    return null;
  }

  console.log('✅ SearchSuggestions rendering:', { isVisible, queryLength: query.length, suggestionsLength: suggestions.length, loading });

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto"
      onKeyDown={handleKeyDown}
    >
      {loading ? (
        <div className="p-4 text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
          Loading suggestions...
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3 ${
                index === selectedIndex ? 'bg-muted' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="p-4 text-center text-muted-foreground">
          <Clock className="h-4 w-4 mx-auto mb-2" />
          No suggestions found for "{query}"
        </div>
      ) : null}
    </div>
  );
};
