import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJson } from '../api.js';

export default function BookDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ book: null, loading: true, error: '' });

  useEffect(() => {
    const controller = new AbortController();
    if (!/^[a-f\d]{24}$/i.test(id || '')) {
      setState({ book: null, loading: false, error: 'This book link is invalid. Check the address or return to the catalog.' });
      return () => controller.abort();
    }

    setState({ book: null, loading: true, error: '' });
    fetchJson(`/books/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((book) => setState({ book, loading: false, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ book: null, loading: false, error: error.message || 'Unable to load this book.' });
        }
      });

    return () => controller.abort();
  }, [id]);

  if (state.loading) {
    return <main className="message-page" role="status"><span className="loader" /><p>Finding that book…</p></main>;
  }

  if (state.error || !state.book) {
    return (
      <main className="message-page" role="alert">
        <p className="eyebrow">BOOK UNAVAILABLE</p>
        <h1>We couldn’t find that story.</h1>
        <p>{state.error || 'This book may have been removed from the catalog.'}</p>
        <Link className="button-primary" to="/">Back to the catalog</Link>
      </main>
    );
  }

  const { book } = state;
  const genreName = typeof book.genre === 'object' ? book.genre?.name : '';

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">← <span>Back to the collection</span></Link>
      <article className="detail-layout">
        <div className="detail-cover-wrap">
          <img
            className="detail-cover"
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            onError={(event) => {
              event.currentTarget.src = '/book-placeholder.svg';
            }}
          />
          <span className="cover-caption">A story waiting to be opened</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> {genreName || 'FROM THE COLLECTION'}</p>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <div className="detail-rule" />
          <p className="detail-description">{book.description}</p>
          <dl className="book-facts">
            {book.isbn && <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>}
            {Number.isInteger(book.availableCopies) && (
              <div><dt>Availability</dt><dd>{book.availableCopies > 0 ? `${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'} available` : 'Currently checked out'}</dd></div>
            )}
          </dl>
          <Link className="button-primary" to="/">Keep exploring <span aria-hidden="true">↗</span></Link>
        </div>
      </article>
    </main>
  );
}
