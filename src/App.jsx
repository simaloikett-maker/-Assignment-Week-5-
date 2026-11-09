import { Link, Route, Routes } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage.jsx';
import BookDetailPage from './pages/BookDetailPage.jsx';

function NotFoundPage() {
  return (
    <main className="message-page">
      <p className="eyebrow">404 · Page not found</p>
      <h1>This page isn’t on our shelves.</h1>
      <Link className="text-link" to="/">Return to the catalog</Link>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Open Shelf home">
          <span className="brand-mark" aria-hidden="true">O</span>
          <span>open shelf<span className="brand-period">.</span></span>
        </Link>
        <span className="header-note">Your next favorite is waiting.</span>
      </header>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="site-footer">
        <Link to="/" className="footer-brand">open shelf</Link>
        <span>A little more room for a good story.</span>
      </footer>
    </div>
  );
}
