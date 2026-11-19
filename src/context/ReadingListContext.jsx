import { createContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'open-shelf-reading-list';
export const ReadingListContext = createContext(null);

function readReadingList() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const books = JSON.parse(stored);
    if (Array.isArray(books)) {
      return books.filter((book) => book && typeof (book._id || book.id) === 'string');
    }
  } catch (error) {
    console.error('Could not read the saved reading list:', error);
  }

  window.localStorage.removeItem(STORAGE_KEY);
  return [];
}

export function ReadingListProvider({ children }) {
  const [readingList, setReadingList] = useState(readReadingList);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readingList));
  }, [readingList]);

  const value = useMemo(() => ({
    readingList,
    addBook(book) {
      const id = book?._id || book?.id;
      if (typeof id !== 'string') return;
      setReadingList((current) => (
        current.some((savedBook) => (savedBook._id || savedBook.id) === id)
          ? current
          : [...current, book]
      ));
    },
    removeBook(bookId) {
      setReadingList((current) => current.filter(
        (book) => (book._id || book.id) !== bookId,
      ));
    },
    clearList() {
      setReadingList([]);
    },
  }), [readingList]);

  return (
    <ReadingListContext.Provider value={value}>
      {children}
    </ReadingListContext.Provider>
  );
}
