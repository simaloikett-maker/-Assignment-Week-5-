import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  const genreName = typeof book.genre === 'object' ? book.genre?.name : '';

  return (
    <article className="book-card">
      <Link className="book-cover-link" to={`/books/${book._id}`} aria-label={`View ${book.title}`}>
        <div className="book-cover">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/book-placeholder.svg';
            }}
          />
        </div>
      </Link>
      <div className="book-card-copy">
        {genreName && <span className="book-genre">{genreName}</span>}
        <h2><Link to={`/books/${book._id}`}>{book.title}</Link></h2>
        <p>by {book.author}</p>
        <Link className="card-arrow" to={`/books/${book._id}`} aria-label={`Read about ${book.title}`}>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
