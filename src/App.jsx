import { useState } from 'react';
import { Routes, Route, Navigate, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import NewsletterForm from './components/NewsletterForm.jsx';
import useNews from './hooks/useNews.js';
import { useAuth } from './context/AuthContext.jsx';
import { CATEGORIES, HOME, HOME_API, DEFAULT_IMAGE } from './data/categories.js';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {Object.entries(CATEGORIES).map(([slug]) => (
          <Route key={slug} path={`/${slug}`} element={<CategoryPage slug={slug} />} />
        ))}
        <Route path="/account" element={<Account />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

/* ============================================================
   HOME
   ============================================================ */
function Home() {
  const { articles } = useNews(HOME_API, [HOME_API.q]);

  const breaking = articles?.[0];
  const lead = articles?.[1];
  const sidebar = articles?.slice(2, 5);
  const cards = articles?.slice(5, 8);

  return (
    <main className="page-width">
      <section className="breaking" aria-label="Breaking news">
        <strong>BREAKING</strong>
        {breaking ? (
          <a href={breaking.url} target="_blank" rel="noreferrer">{breaking.title}</a>
        ) : (
          <a href="#">{HOME.breaking}</a>
        )}
      </section>

      <section className="top-grid">
        <article className="lead-story">
          <p className="eyebrow">{lead ? lead.source : HOME.lead.eyebrow}</p>
          <div className="hero-image">
            <img src={lead?.image || HOME.lead.image} alt="" loading="lazy" />
          </div>
          <h1>
            {lead ? (
              <a href={lead.url} target="_blank" rel="noreferrer">{lead.title}</a>
            ) : (
              HOME.lead.title
            )}
          </h1>
          <p className="byline">
            {lead ? (
              <>By {lead.source} <span>•</span> {lead.time}</>
            ) : (
              <>{HOME.lead.byline} <span>•</span> 18 min ago</>
            )}
          </p>
          <p className="summary">
            {(lead && lead.excerpt) || HOME.lead.summary}
          </p>
        </article>

        <aside id="latest" className="latest">
          <p className="eyebrow">LATEST NEWS</p>
          {(sidebar?.length ? sidebar : HOME.latest).map((item, i) => (
            <article key={item.url || i}>
              <div className="thumb">
                <img src={item.image} alt="" loading="lazy" />
              </div>
              <div>
                <p className="category">{item.source || item.category}</p>
                <h2>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                  ) : (
                    item.title
                  )}
                </h2>
                <time>{item.time}</time>
              </div>
            </article>
          ))}
        </aside>
      </section>

      <section className="more">
        <p className="eyebrow">MORE FROM THE DAILY LEDGER</p>
        <div className="cards">
          {(cards?.length ? cards : HOME.cards).map((item, i) => (
            <article className="card" key={item.url || i}>
              <div className="card-image">
                <img src={item.image} alt="" loading="lazy" />
              </div>
              <p className="category">{item.source || item.category}</p>
              <h2>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a>
                ) : (
                  item.title
                )}
              </h2>
              <time>{item.time}</time>
            </article>
          ))}

          <aside id="newsletter" className="newsletter">
            <p>THE MORNING BRIEF</p>
            <h2>The news, in your inbox.</h2>
            <span>Start your day with our essential stories.</span>
            <NewsletterForm list="morning-brief" />
          </aside>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   CATEGORY PAGES (latest / india / world / business / tech /
   sports / culture / opinion — all from one component)
   ============================================================ */
const IMAGE_TINTS = ['image-business', 'image-india', 'image-tech', 'image-opinion', 'image-world'];

function CategoryPage({ slug }) {
  const config = CATEGORIES[slug];
  const { articles, loading } = useNews(config.api, [slug]);

  const stories = Array.from({ length: 5 }, (_, i) => {
    const live = articles?.[i];
    if (live) {
      return {
        category: live.source,
        title: live.title,
        excerpt: live.excerpt,
        url: live.url,
        image: live.image,
        time: live.time,
      };
    }
    const fb = config.fallback[i];
    return { ...fb, image: DEFAULT_IMAGE, time: `${i + 1} hour${i ? 's' : ''} ago` };
  });

  const [featured, ...rest] = stories;

  return (
    <main className="page-width category-page">
      <p className="eyebrow">{config.eyebrow}</p>
      <h1>{config.title}</h1>
      <p className="intro">{config.intro}</p>
      <div className="ad-slot">ADVERTISEMENT</div>

      <section className="category-layout">
        <div className="story-list">
          <StoryArticle story={featured} tint={IMAGE_TINTS[0]} featured />
          {rest.map((story, i) => (
            <StoryArticle key={story.title} story={story} tint={IMAGE_TINTS[i + 1]} />
          ))}
          {loading && <p className="empty-state">Loading latest stories…</p>}
        </div>

        <aside id="newsletter" className="sidebar">
          <h2>{config.sidebarTitle}</h2>
          <p>Clear reporting and essential context, delivered straight to your inbox.</p>
          <NewsletterForm className="sidebar-form" list={`${slug}-brief`} />
          <div className="sidebar-ad">ADVERTISEMENT</div>
        </aside>
      </section>
    </main>
  );
}

function StoryArticle({ story, tint, featured = false }) {
  return (
    <article className={featured ? 'featured-list' : 'list-item'}>
      <div className={`listing-image ${tint}`}>
        <img src={story.image} alt="" loading="lazy" />
      </div>
      <div>
        <p className="category">{story.category}</p>
        <h2>
          {story.url ? (
            <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
          ) : (
            story.title
          )}
        </h2>
        <p>{story.excerpt}</p>
        <time>{story.time}</time>
      </div>
    </article>
  );
}

/* ============================================================
   ACCOUNT (signup / login / profile)
   ============================================================ */
function Account() {
  const { user, login, signup, logout } = useAuth();
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [status, setStatus] = useState(null);

  if (user) {
    return (
      <main className="page-width account-page">
        <p className="eyebrow">MY ACCOUNT</p>
        <h1>Hello, {user.name}</h1>
        <div className="account-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="muted">You are signed in. Your reading preferences and subscriptions are active on this device.</p>
          <button
            className="btn-danger"
            onClick={() => {
              logout();
              setStatus({ ok: true, message: 'Signed out successfully.' });
            }}
          >
            SIGN OUT
          </button>
          {status?.ok && <small className="form-msg ok">{status.message}</small>}
        </div>
      </main>
    );
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setStatus(null);
  };

  function submit(e) {
    e.preventDefault();

    if (mode === 'signup') {
      if (form.name.trim().length < 2) return setStatus({ ok: false, message: 'Please enter your name.' });
      if (form.password.length < 6) return setStatus({ ok: false, message: 'Password must be at least 6 characters.' });
      if (form.password !== form.confirm) return setStatus({ ok: false, message: 'Passwords do not match.' });
      const res = signup({ name: form.name, email: form.email, password: form.password });
      setStatus(res);
      if (!res.ok) return;
    } else {
      if (!form.email || !form.password) return setStatus({ ok: false, message: 'Enter your email and password.' });
      const res = login({ email: form.email, password: form.password });
      setStatus(res);
      if (!res.ok) return;
    }
  }

  return (
    <main className="page-width account-page">
      <p className="eyebrow">MEMBER ACCESS</p>
      <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <p className="intro">Subscribe to newsletters and keep your reading list synced.</p>

      <div className="account-card">
        <div className="account-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setStatus(null); }}
          >
            SIGN IN
          </button>
          <button
            role="tab"
            aria-selected={mode === 'signup'}
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setStatus(null); }}
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={submit} noValidate>
          {mode === 'signup' && (
            <label>
              Full name
              <input type="text" value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" />
            </label>
          )}
          <label>
            Email
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
          {mode === 'signup' && (
            <label>
              Confirm password
              <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password" />
            </label>
          )}

          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>

          {status && (
            <small className={status.ok ? 'form-msg ok' : 'form-msg err'} role="alert">
              {status.message}
            </small>
          )}

          <p className="muted">
            {mode === 'login' ? (
              <>New here? <button type="button" className="link-btn" onClick={() => setMode('signup')}>Create an account</button></>
            ) : (
              <>Already a member? <button type="button" className="link-btn" onClick={() => setMode('login')}>Sign in</button></>
            )}
          </p>
          <p className="muted"><Link to="/">← Back to the homepage</Link></p>
        </form>
      </div>
    </main>
  );
}

/* ============================================================
   SEARCH RESULTS
   ============================================================ */
function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { articles, loading } = useNews({ q }, [q]);

  return (
    <main className="page-width category-page">
      <p className="eyebrow">SEARCH RESULTS</p>
      <h1>{q ? `“${q}”` : 'Search'}</h1>
      <p className="intro">
        {loading
          ? 'Searching the newsroom archive…'
          : articles
            ? `${articles.length} fresh stories found.`
            : q
              ? 'No live results right now — try a different search from the ⌕ button in the header.'
              : 'Type a topic in the search box (⌕) in the header above.'}
      </p>

      {articles && (
        <section className="category-layout">
          <div className="story-list">
            {articles.slice(0, 10).map((a, i) => (
              <article className={i === 0 ? 'featured-list' : 'list-item'} key={a.url + i}>
                <div className={`listing-image image-${['business', 'india', 'tech', 'opinion', 'world'][i % 5]}`}>
                  <img src={a.image} alt="" loading="lazy" />
                </div>
                <div>
                  <p className="category">{a.source}</p>
                  <h2><a href={a.url} target="_blank" rel="noreferrer">{a.title}</a></h2>
                  <p>{a.excerpt}</p>
                  <time>{a.time}</time>
                </div>
              </article>
            ))}
          </div>
          <aside className="sidebar">
            <h2>Keep reading</h2>
            <p>Jump back to any section of The Daily Ledger.</p>
            <ul className="sidebar-links">
              <li><Link to="/latest">Latest News</Link></li>
              <li><Link to="/india">India</Link></li>
              <li><Link to="/world">World</Link></li>
              <li><Link to="/business">Business</Link></li>
              <li><Link to="/tech">Technology</Link></li>
              <li><Link to="/sports">Sports</Link></li>
            </ul>
          </aside>
        </section>
      )}
    </main>
  );
}
