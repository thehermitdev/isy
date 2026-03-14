import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search…', className }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search
        className="absolute left-3 w-4 h-4 pointer-events-none"
        style={{ color: 'var(--icon-color)' }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-8"
        style={{ width: '280px' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 rounded-full transition-opacity opacity-60 hover:opacity-100"
          style={{ color: 'var(--icon-color)' }}
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// Hook to use with search bar
export function useSearch() {
  const [query, setQuery] = useState('');
  return { query, setQuery, reset: () => setQuery('') };
}
