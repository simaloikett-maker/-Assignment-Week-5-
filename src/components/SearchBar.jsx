import { useEffect, useState } from 'react';

export default function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (input !== value) onSearch(input);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [input, value, onSearch]);

  return (
    <label className="search-field">
      <span className="search-icon" aria-hidden="true">⌕</span>
      <span className="sr-only">Search books by title or author</span>
      <input
        type="search"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Search a title or author…"
      />
      <kbd>↵</kbd>
    </label>
  );
}
