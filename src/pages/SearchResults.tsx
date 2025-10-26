import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchSuggestions } from "@/components/SearchSuggestions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Filter, SortAsc } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update search term when URL changes
  useEffect(() => {
    const urlSearchTerm = searchParams.get('q') || '';
    setSearchTerm(urlSearchTerm);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSearchParams({ q: suggestion });
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              {searchTerm ? `Search Results` : 'Search Products'}
            </h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search for books, courses, workbooks..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-4 h-12 text-lg"
                  onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
                />
                <Button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  size="sm"
                >
                  Search
                </Button>
                <SearchSuggestions
                  query={searchTerm}
                  onSuggestionClick={handleSuggestionClick}
                  onSearch={handleSearch}
                  isVisible={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>
            </form>

            {/* Search Stats */}
            {searchTerm && (
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Showing results for: <span className="font-semibold text-foreground">"{searchTerm}"</span>
                </p>
              </div>
            )}

            {/* Filter Toggle */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  className="gap-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm ? (
          <ProductGrid 
            searchTerm={searchTerm} 
            showFilters={showFilters}
          />
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Start Your Search</h2>
              <p className="text-muted-foreground mb-6">
                Enter a search term above to find books, courses, and workbooks that match your interests.
              </p>
              
              {/* Popular Search Suggestions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Popular Searches</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['habits', 'productivity', 'leadership', 'mindfulness', 'business', 'success'].map((term) => (
                    <Badge 
                      key={term}
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        setSearchTerm(term);
                        setSearchParams({ q: term });
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
