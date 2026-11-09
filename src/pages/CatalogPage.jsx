import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import SearchBar from '../components/SearchBar.jsx';
import useBooks from '../hooks/useBooks.js';
import useGenres from '../hooks/useGenres.js';

const PAGE_SIZE = 12;

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const genre = params.get('genre') || '';
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1);
  const booksState = useBooks({ genre, search, page, limit: PAGE_SIZE });
  const genresState = useGenres();

  const updateParams = useCallback((updates) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      return next;
    });
  }, [setParams]);

  const handleSearch = useCallback((value) => {
    updateParams({ search: value.trim(), page: '' });
  }, [updateParams]);

  const handleGenreChange = (value) => {
    updateParams({ genre: value, page: '' });
  };

  const handlePageChange = (nextPage) => {
    updateParams({ page: nextPage === 1 ? '' : String(nextPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { books, pagination, loading, error } = booksState;
  const resultLabel = search || genre ? 'Matching books' : 'On our shelves';

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> THE LIBRARY CATALOG</p>
          <h1>Find your next<br /><em>great read.</em></h1>
          <p className="hero-description">Stories worth staying up for, ideas worth thinking about, and worlds worth getting lost in.</p>
          <a className="hero-link" href="#catalog">Explore the collection <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-sun" />
          <div className="hero-stack">
            <div className="stack-book stack-book-back"><span>THE ART OF NOTICING</span></div>
            <div className="stack-book stack-book-middle"><span>WILD PLACES</span></div>
            <div className="stack-book stack-book-front"><span>WAYS OF<br />SEEING</span><small>A FIELD GUIDE</small></div>
          </div>
          <span className="art-sparkle sparkle-one">✳</span>
          <span className="art-sparkle sparkle-two">✳</span>
          <span className="art-caption">A world in every book</span>
        </div>
        <div className="hero-index"><span>01</span><span className="index-rule" /><span>DISCOVER</span></div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CHAPTER</p>
            <h2>Explore the <em>collection.</em></h2>
          </div>
          <span className="section-aside">Curated for the curious.</span>
        </div>

        <div className="catalog-toolbar">
          <SearchBar value={search} onSearch={handleSearch} />
          <GenreFilter
            genres={genresState.genres}
            value={genre}
            onChange={handleGenreChange}
            loading={genresState.loading}
            error={genresState.error}
          />
        </div>

        <div className="results-heading" aria-live="polite">
          <h3>{resultLabel}</h3>
          {!loading && !error && (
            <span>{pagination.total} {pagination.total === 1 ? 'book' : 'books'}</span>
          )}
        </div>

        {loading && (
          <div className="state-panel" role="status">
            <span className="loader" />
            <p>Turning a few pages…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-panel state-error" role="alert">
            <span className="state-symbol">!</span>
            <h3>We couldn’t load the catalog.</h3>
            <p>{error}</p>
            <button className="button-secondary" onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="state-panel">
            <span className="state-symbol">⌕</span>
            <h3>No books found just yet.</h3>
            <p>Try a different title, author, or genre and see what turns up.</p>
            {(search || genre) && (
              <button className="button-secondary" onClick={() => setParams({})}>Clear filters</button>
            )}
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <>
            <div className="book-grid">
              {books.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
            {pagination.totalPages > 1 && (
              <nav className="pagination" aria-label="Catalog pages">
                <button
                  className="page-button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >←</button>
                <span>Page <strong>{page}</strong> of {pagination.totalPages}</span>
                <button
                  className="page-button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  aria-label="Next page"
                >→</button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
