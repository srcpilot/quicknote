'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  readonly onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps): React.ReactElement {
  const [query, setQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);
    startTransition(() => {
      onSearch(value);
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search notes..."
        className="pl-8"
        value={query}
        onChange={handleChange}
      />
      {isPending && (
        <div className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
    </div >
  );
}
