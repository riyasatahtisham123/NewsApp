# The Daily Ledger — React Edition

Aapke static HTML/CSS/JS news web app ka React (Vite) conversion — ab poora functional:

- **Signup / Login / Logout** — `/account` page, localStorage-backed demo auth
  (validation: naam, email uniqueness, 6+ char password, confirm match)
- **Subscribe** — har newsletter form emails save karta hai, success/duplicate messages dikhata hai;
  logged-in user ka email auto pre-fill hota hai
- **Search** — header ka ⌕ button live NewsAPI search kholta hai (`/search?q=...`)
- **Light / Dark mode** — header ka ☾/☀ toggle; preference localStorage me save hoti hai
  aur pehli baar system theme (`prefers-color-scheme`) follow karti hai
- **Live news** — NewsAPI se har page par real headlines; API fail hone par placeholder stories

## Run karna

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Structure

- `src/App.jsx` — saare pages ek hi file me: `Home`, `CategoryPage` (8 categories config-driven), `Account`, `Search` + routes (`/`, `/latest`, `/india`, `/world`, `/business`, `/tech`, `/sports`, `/culture`, `/opinion`, `/account`, `/search`)
- `src/app.css` — poori CSS ek hi file me (theme variables + base + home + category + account styles)
- `src/context/AuthContext.jsx` — signup/login/logout state
- `src/context/ThemeContext.jsx` — light/dark theme state
- `src/components/` — `Header` (sticky nav, menu, search, theme toggle, user state), `Footer`, `Layout`, `NewsletterForm`
- `src/hooks/useNews.js` + `src/lib/news.js` — NewsAPI fetch + `formatTimeAgo`
- `src/lib/subscribe.js` — newsletter subscribe store
- `src/data/categories.js` — har page ka title/intro/API query + fallback stories

## API key

Key `.env` me `VITE_NEWS_API_KEY` ke through aati hai (aapki original key daal di hai).
NewsAPI ke free plan par `top-headlines?category=` ab support nahi hai, isliye
business/tech/sports wale pages placeholder stories dikhate hain — API fail hone par
app crash nahi karti, fallback content render hota hai.

## Note on auth

Ye demo auth hai: users/passwords browser ke localStorage me store hote hain
(koi backend nahi). Real production app me ise server-side API + hashed passwords
se replace karna hoga.
