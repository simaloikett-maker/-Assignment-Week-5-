export default function GenreFilter({ genres, value, onChange, loading, error }) {
  return (
    <div className="filter-field">
      <label htmlFor="genre-filter">Browse by genre</label>
      <select
        id="genre-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || Boolean(error)}
        aria-describedby={error ? 'genre-error' : undefined}
      >
        <option value="">All genres</option>
        {genres.map((genre) => (
          <option key={genre._id} value={genre._id}>{genre.name}</option>
        ))}
      </select>
      {loading && <span className="field-note">Loading genres…</span>}
      {error && <span className="field-error" id="genre-error" role="alert">Couldn’t load genres: {error}</span>}
      {!loading && !error && genres.length === 0 && <span className="field-note">No genres available yet.</span>}
    </div>
  );
}
