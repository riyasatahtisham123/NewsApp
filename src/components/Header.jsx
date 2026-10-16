import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../data/categories.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  function runSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="page-width">
          <span>{today.toUpperCase()}</span>
          <span className="utility-right">
            {user ? (
              <>
                <Link to="/account" className="utility-link">Hi, {user.name.split(' ')[0]}</Link>
                <button className="utility-btn" onClick={logout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/account" className="utility-link">Sign in</Link>
                <span aria-hidden="true">•</span>
                <Link to="/account?mode=signup" className="utility-link">Subscribe</Link>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="masthead page-width">
        <div>
          <Link className="brand" to="/">THE DAILY LEDGER</Link>
          <p>INDEPENDENT NEWS AND ANALYSIS</p>
        </div>
        <div className="tools">
          <button
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
            onClick={toggleTheme}
          >
            {isDark ? '☀' : '☾'}
          </button>
          <button
            aria-label="Search"
            title="Search news"
            onClick={() => setSearchOpen((o) => !o)}
          >
            ⌕
          </button>
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            ☰
          </button>
          <Link className="subscribe" to="/account">SUBSCRIBE</Link>
        </div>
      </div>

      {searchOpen && (
        <form className="search-panel page-width open" onSubmit={runSearch}>
          <input
            autoFocus
            type="search"
            placeholder="Search news… e.g. economy, cricket, AI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search news"
          />
          <button type="submit">SEARCH</button>
        </form>
      )}

      <nav className={`page-width${menuOpen ? ' open' : ''}`} aria-label="Primary navigation">
        {NAV_LINKS.map(({ slug, label }) => (
          <NavLink
            key={slug}
            to={slug}
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
