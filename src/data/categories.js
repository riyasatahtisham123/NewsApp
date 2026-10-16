const img = (id) =>
  `https://images.unsplash.com/${id}?w=800&q=70&auto=format&fit=crop`;

export const DEFAULT_IMAGE =
  'https://images.financialexpressdigital.com/2023/05/Breaking-news-photo-5.jpg?w=1200';

export const NAV_LINKS = [
  { slug: '/', label: 'HOME' },
  { slug: '/latest', label: 'LATEST' },
  { slug: '/india', label: 'INDIA' },
  { slug: '/world', label: 'WORLD' },
  { slug: '/business', label: 'BUSINESS' },
  { slug: '/tech', label: 'TECH' },
  { slug: '/sports', label: 'SPORTS' },
  { slug: '/culture', label: 'CULTURE' },
  { slug: '/opinion', label: 'OPINION' },
];

// Home page config (lead story + sidebar + cards layout)
export const HOME = {
  breaking: 'Markets rally as policy announcement boosts investor confidence',
  lead: {
    eyebrow: 'TOP STORY',
    title: "A decisive week reshapes the country's economic outlook",
    byline: 'By Aisha Rahman',
    summary:
      'Key developments, expert reaction and what it means for households.',
    image: DEFAULT_IMAGE,
  },
  latest: [
    { category: 'BUSINESS', title: 'Startups turn to new markets for growth', time: '43 min ago', image: img('photo-1611974592683-21a1f8568a5e') },
    { category: 'WORLD', title: 'Leaders meet amid renewed calls for action', time: '1 hour ago', image: img('photo-1529107386315-e1a2a45a284d') },
    { category: 'CLIMATE', title: 'Cities prepare for an unusually wet season', time: '2 hours ago', image: img('photo-1504205740405-0b6d3f599b48') },
  ],
  cards: [
    { category: 'TECHNOLOGY', title: 'The changing rules of digital privacy', time: '6 min read', image: img('photo-1518770660439-4636190a4523') },
    { category: 'CULTURE', title: 'A new chapter for independent cinema', time: '8 min read', image: img('photo-1489593841128-7c95ec4b7f91') },
    { category: 'SPORTS', title: 'A season of momentum and surprises', time: '5 min read', image: img('photo-1461896836934-ffe607ba8211') },
  ],
};

// Route slug -> NewsAPI query + page copy + fallback stories
export const CATEGORIES = {
  latest: {
    title: 'Latest News',
    eyebrow: 'NEWS DESK',
    intro: 'The most important stories, updated throughout the day.',
    sidebarTitle: 'News Briefing',
    api: { q: 'latest news' },
    fallback: [
      { category: 'BREAKING', title: 'Markets rally as policy announcement boosts investor confidence', excerpt: 'Analysts explain what is moving markets and where opportunities may emerge.' },
      { category: 'POLITICS', title: 'Cabinet outlines its priorities for the coming session', excerpt: 'Lawmakers signal a focus on jobs, infrastructure and public services.' },
      { category: 'TECH', title: 'New digital rules place privacy at the centre of the debate', excerpt: 'Regulators weigh innovation against the rights of users.' },
      { category: 'SPORTS', title: 'Team selection sparks excitement ahead of the season opener', excerpt: 'Supporters debate the squad as the first match approaches.' },
      { category: 'CULTURE', title: 'A city museum opens its doors to a new generation', excerpt: 'Curators reimagine how stories are told inside historic halls.' },
    ],
  },
  india: {
    title: 'India',
    eyebrow: 'THE NATION',
    intro: 'Politics, policy, economy and the stories shaping everyday life.',
    sidebarTitle: 'India Briefing',
    api: { q: 'india' },
    fallback: [
      { category: 'POLITICS', title: 'State leaders gather to discuss the next phase of public investment', excerpt: 'Officials weigh spending against the need for fiscal balance.' },
      { category: 'ECONOMY', title: 'Small businesses look ahead as new incentives take effect', excerpt: 'Owners find fresh confidence in changing conditions.' },
      { category: 'CULTURE', title: 'Communities find fresh ways to preserve local traditions', excerpt: 'New projects keep heritage alive for younger generations.' },
      { category: 'CLIMATE', title: 'Research teams accelerate work on practical climate solutions', excerpt: 'Innovation is moving from the lab to the ground.' },
      { category: 'ANALYSIS', title: 'Why long-term thinking is back on the boardroom agenda', excerpt: 'Leaders weigh growth against resilience.' },
    ],
  },
  world: {
    title: 'World',
    eyebrow: 'GLOBAL REPORT',
    intro: 'Reporting from the people and places making global news.',
    sidebarTitle: 'World Newsletter',
    api: { q: 'world' },
    fallback: [
      { category: 'DIPLOMACY', title: 'Leaders meet amid renewed calls for coordinated global action', excerpt: 'Summit talks focus on trade, security and climate finance.' },
      { category: 'CITIES', title: "Communities consider a future built around more liveable cities", excerpt: 'Planners test new ideas for transport, housing and green space.' },
      { category: 'TRADE', title: "New partnerships reshape the region's trade routes", excerpt: 'Exporters adjust as corridors open and tariffs shift.' },
      { category: 'CLIMATE', title: 'Coastal cities plan for a changing relationship with the sea', excerpt: 'Engineers and residents prepare for higher tides.' },
      { category: 'REPORT', title: 'Field reporting reveals quiet shifts in everyday life', excerpt: 'Correspondents file scenes from neighborhoods abroad.' },
    ],
  },
  business: {
    title: 'Business',
    eyebrow: 'MARKETS AND MONEY',
    intro: 'Companies, markets and the forces shaping the economy.',
    sidebarTitle: 'Business Briefing',
    api: { category: 'business' },
    fallback: [
      { category: 'MARKETS', title: 'Investors look for clarity as a new quarter begins', excerpt: 'Analysts explain what is moving markets and where opportunities may emerge.' },
      { category: 'ECONOMY', title: 'Small businesses plan their next chapter', excerpt: 'Owners find fresh confidence in changing conditions.' },
      { category: 'INNOVATION', title: 'The founders building practical tools for modern work', excerpt: 'A focus on useful technology is attracting attention.' },
      { category: 'ANALYSIS', title: 'Why long-term thinking is back on the boardroom agenda', excerpt: 'Leaders weigh growth against resilience.' },
      { category: 'FINANCE', title: 'Households reassess spending as prices stabilize', excerpt: 'Budgets shift toward essentials and small luxuries.' },
    ],
  },
  tech: {
    title: 'Technology',
    eyebrow: 'THE DIGITAL WORLD',
    intro: 'Ideas, products and people changing the way we live and work.',
    sidebarTitle: 'Tech Dispatch',
    api: { category: 'technology' },
    fallback: [
      { category: 'PRIVACY', title: 'The changing rules of digital privacy', excerpt: 'New regulations are rewriting what companies can collect.' },
      { category: 'PRODUCTIVITY', title: 'New tools help teams make better decisions', excerpt: 'Software is getting out of the way of real work.' },
      { category: 'INFRASTRUCTURE', title: 'A fresh race to build trusted digital infrastructure', excerpt: 'Reliability has become the competitive frontier.' },
      { category: 'CULTURE', title: 'Technology needs more human questions', excerpt: 'Designers argue for ethics at the centre of product work.' },
      { category: 'AI', title: 'Practical uses of AI arrive in everyday services', excerpt: 'Businesses test assistants that actually save time.' },
    ],
  },
  sports: {
    title: 'Sports',
    eyebrow: 'THE PLAYBOOK',
    intro: 'Results, analysis and the stories behind the score.',
    sidebarTitle: 'Sports Weekly',
    api: { category: 'sports' },
    fallback: [
      { category: 'SEASON', title: 'A season of momentum and surprises', excerpt: 'Underdogs are rewriting expectations week after week.' },
      { category: 'YOUTH', title: 'Young players seize a decisive moment', excerpt: 'Rookies are stepping up when it matters most.' },
      { category: 'CRICKET', title: 'The next generation takes centre field', excerpt: 'Academies are producing confident, technical talent.' },
      { category: 'FITNESS', title: "Why recovery has become sport's competitive edge", excerpt: 'Teams invest in sleep, science and smart training loads.' },
      { category: 'FANS', title: 'Clubs court supporters with new matchday ideas', excerpt: 'Stadiums compete for attention beyond the game.' },
    ],
  },
  culture: {
    title: 'Culture',
    eyebrow: 'ARTS AND IDEAS',
    intro: 'The books, films, food and creative voices worth knowing.',
    sidebarTitle: 'Culture Notes',
    api: { category: 'entertainment' },
    fallback: [
      { category: 'CINEMA', title: 'A new chapter for independent cinema', excerpt: 'Small studios find big audiences with bold storytelling.' },
      { category: 'MUSEUMS', title: 'A city museum opens its doors to a new generation', excerpt: 'Curators reimagine how stories are told inside historic halls.' },
      { category: 'BOOKS', title: 'Writers find new ways to reach their readers', excerpt: 'Independent publishing is thriving in unexpected formats.' },
      { category: 'FOOD', title: 'What makes a place feel like home', excerpt: 'Chefs cook memory into menus rooted in neighborhood.' },
      { category: 'MUSIC', title: 'Live scenes rebound with intimate venues', excerpt: 'Artists trade arenas for closer connections.' },
    ],
  },
  opinion: {
    title: 'Opinion',
    eyebrow: 'IDEAS AND COMMENTARY',
    intro: 'Thoughtful arguments from writers with something useful to say.',
    sidebarTitle: 'Opinion Digest',
    api: { q: 'opinion' },
    fallback: [
      { category: 'DEBATE', title: 'The case for slower, better public debate', excerpt: 'Urgency is not the same as importance.' },
      { category: 'ECONOMY', title: 'Growth must mean more than a bigger number', excerpt: 'Wellbeing metrics deserve a seat at the table.' },
      { category: 'DIGITAL LIFE', title: 'Digital life should leave room for doubt', excerpt: 'Certainty online is often a design choice, not a truth.' },
      { category: 'SOCIETY', title: 'Hope is a strategy when it leads to action', excerpt: 'Optimism works best when paired with practical steps.' },
      { category: 'POLICY', title: 'Public trust is built in small, consistent ways', excerpt: 'Institutions earn confidence through transparency.' },
    ],
  },
};

// Home fetches general India news, same as the original script.js default
export const HOME_API = { q: 'india' };
