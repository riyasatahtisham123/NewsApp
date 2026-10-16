const API_KEY = 'e64c5f07c6bb4564acbb8ee6e1139e09'; // Aapka NewsAPI Key
const BASE_URL = 'https://newsapi.org/v2';
const DEFAULT_IMAGE = 'https://images.financialexpressdigital.com/2023/05/Breaking-news-photo-5.jpg?w=1200';

// ==========================================
// 0. SINGLE-PAGE VIEW ROUTER
//    (pehle ye kaam alag-alag .html files karte thi,
//     ab ek hi index.html me hash se view badalta hai)
// ==========================================
const VIEWS = ['home', 'latest', 'india', 'world', 'business', 'tech', 'sports', 'culture', 'opinion'];

// Un views par hi API chalega jahan pehle script.js load hota tha
// (index.html aur latest.html). Baaki pages ka static content vaisa hi rahega.
const API_VIEWS = ['home', 'latest'];

function currentView() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    return VIEWS.includes(hash) ? hash : 'home';
}

function activeMain() {
    return document.querySelector(`main[data-view="${currentView()}"]`);
}

function showView() {
    const view = currentView();

    document.querySelectorAll('main[data-view]').forEach((main) => {
        main.hidden = main.dataset.view !== view;
    });

    document.querySelectorAll('nav a').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${view}`);
    });

    document.getElementById('primary-nav').classList.remove('open');
    document.body.dataset.view = view;
    window.scrollTo(0, 0);

    if (API_VIEWS.includes(view)) fetchNews();
}

// API se aane wala text HTML me daalne se pehle escape karta hai
function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ==========================================
// 1. ALL-PAGE CATEGORY ROUTER (FIXED FOR ALL PAGES)
// ==========================================
function getCategoryInfo() {
    // Abhi ka active view aur document title lower case me lein
    const pageName = currentView();
    const pageTitle = document.title.toLowerCase();

    console.log(`Current View Check -> View: "${pageName}", Title: "${pageTitle}"`);

    // 1. LATEST PAGE
    if (pageName.includes('latest') || pageTitle.includes('latest')) {
        return { category: 'general', q: 'latest news' };
    }

    // 2. INDIA PAGE
    if (pageName.includes('india') || pageTitle.includes('india')) {
        return { category: 'general', q: 'india' };
    }

    // 3. WORLD PAGE
    if (pageName.includes('world') || pageTitle.includes('world')) {
        return { category: 'general', q: 'world' };
    }

    // 4. BUSINESS PAGE
    if (pageName.includes('business') || pageTitle.includes('business')) {
        return { category: 'business', q: '' };
    }

    // 5. TECH / TECHNOLOGY PAGE
    if (pageName.includes('tech') || pageName.includes('text') || pageTitle.includes('tech') || pageTitle.includes('technology')) {
        return { category: 'technology', q: '' };
    }

    // 6. SPORTS PAGE
    if (pageName.includes('sport') || pageTitle.includes('sport')) {
        return { category: 'sports', q: '' };
    }

    // 7. CULTURE / ENTERTAINMENT PAGE
    if (pageName.includes('culture') || pageName.includes('entertainment') || pageTitle.includes('culture') || pageTitle.includes('entertainment')) {
        return { category: 'entertainment', q: '' };
    }

    // 8. OPINION PAGE
    if (pageName.includes('opinion') || pageTitle.includes('opinion')) {
        return { category: 'general', q: 'opinion' };
    }

    // Default Fallback (Home / Index Page)
    return { category: 'general', q: 'india' };
}

// ==========================================
// 2. TIME AGO FORMATTER
// ==========================================
function formatTimeAgo(dateString) {
    if (!dateString) return 'Recently';
    const publishedDate = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - publishedDate) / (1000 * 60));

    if (isNaN(diffInMinutes) || diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
}

// ==========================================
// 3. FETCH NEWS FROM API
// ==========================================
async function fetchNews() {
    const scope = activeMain();
    if (!scope) return;

    const view = currentView();
    const { category, q } = getCategoryInfo();
    console.log(`Fetching API Data -> View: "${view}", Category: "${category}", Query: "${q}"`);

    let url = '';

    // NewsAPI Request URL Construction
    if (q !== '') {
        url = `${BASE_URL}/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${API_KEY}`;
    } else {
        url = `${BASE_URL}/top-headlines?country=in&category=${category}&pageSize=15&apiKey=${API_KEY}`;
    }

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`API Error Status: ${response.status}`);
            return;
        }

        const data = await response.json();
        console.log("API Response Received:", data);

        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            const validArticles = data.articles.filter(item => item.title && item.title !== '[Removed]');
            renderNewsToHTML(validArticles, scope);
        } else {
            console.warn('Is category ke liye articles nahi mile.');
        }
    } catch (error) {
        console.error('Fetch News Failed Exception:', error);
    }
}

// ==========================================
// 4. SMART RENDER FUNCTION (HYBRID FOR ALL PAGES)
// ==========================================
function renderNewsToHTML(articles, scope) {
    if (!articles || articles.length === 0) return;
    scope = scope || document;

    let index = 0;

    // Standard Layout Elements Target
    const breakingLink = scope.querySelector('.breaking a');
    const leadStory = scope.querySelector('.lead-story');
    const latestSidebar = scope.querySelector('#latest');
    const cardsSection = scope.querySelector('.more .cards');

    // 1. BREAKING BANNER
    if (breakingLink && articles[index]) {
        breakingLink.innerText = articles[index].title;
        breakingLink.href = articles[index].url;
        breakingLink.target = '_blank';
        index++;
    }

    // 2. LEAD STORY
    if (leadStory && articles[index]) {
        const story = articles[index];
        const img = leadStory.querySelector('img');
        const h1 = leadStory.querySelector('h1');
        const byline = leadStory.querySelector('.byline');
        const summary = leadStory.querySelector('.summary');

        if (img) img.src = story.urlToImage || DEFAULT_IMAGE;
        if (h1) {
            h1.innerHTML = `<a href="${esc(story.url)}" target="_blank" style="color:inherit; text-decoration:none;">${esc(story.title)}</a>`;
        }
        if (byline) {
            const author = story.author || (story.source && story.source.name) || 'Editorial Desk';
            byline.innerHTML = `By ${esc(author)} <span>•</span> ${esc(formatTimeAgo(story.publishedAt))}`;
        }
        if (summary) {
            summary.innerText = story.description || story.title;
        }
        index++;
    }

    // 3. LATEST SIDEBAR
    if (latestSidebar) {
        const sidebarArticles = latestSidebar.querySelectorAll('article');
        sidebarArticles.forEach((articleTag) => {
            if (!articles[index]) return;
            const item = articles[index];

            const img = articleTag.querySelector('img');
            const categoryText = articleTag.querySelector('.category');
            const h2 = articleTag.querySelector('h2');
            const timeTag = articleTag.querySelector('time');

            if (img) img.src = item.urlToImage || DEFAULT_IMAGE;
            if (categoryText) categoryText.innerText = ((item.source && item.source.name) || 'NEWS').toUpperCase();
            if (h2) {
                h2.innerHTML = `<a href="${esc(item.url)}" target="_blank" style="color:inherit; text-decoration:none;">${esc(item.title)}</a>`;
            }
            if (timeTag) timeTag.innerText = formatTimeAgo(item.publishedAt);

            index++;
        });
    }

    // 4. CARDS SECTION
    if (cardsSection) {
        const cards = cardsSection.querySelectorAll('.card');
        cards.forEach((cardTag) => {
            if (!articles[index]) return;
            const item = articles[index];

            const img = cardTag.querySelector('img');
            const categoryText = cardTag.querySelector('.category');
            const h2 = cardTag.querySelector('h2');
            const timeTag = cardTag.querySelector('time');

            if (img) img.src = item.urlToImage || DEFAULT_IMAGE;
            if (categoryText) categoryText.innerText = ((item.source && item.source.name) || 'UPDATE').toUpperCase();
            if (h2) {
                h2.innerHTML = `<a href="${esc(item.url)}" target="_blank" style="color:inherit; text-decoration:none;">${esc(item.title)}</a>`;
            }
            if (timeTag) timeTag.innerText = formatTimeAgo(item.publishedAt);

            index++;
        });
    }

    // 5. UNIVERSAL FALLBACK DYNAMIC GRID (Agar kisi page me home wale classes na ho)
    if (!leadStory && !latestSidebar && !cardsSection) {
        const container = scope;

        let newsHTML = '<div class="dynamic-news-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px;">';

        articles.forEach(item => {
            newsHTML += `
                <div class="news-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff;">
                    <img src="${esc(item.urlToImage || DEFAULT_IMAGE)}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 5px;">
                    <span style="font-size: 12px; color: #e50914; font-weight: bold; margin-top: 10px; display: inline-block;">${esc(((item.source && item.source.name) || 'NEWS').toUpperCase())}</span>
                    <h2 style="font-size: 18px; margin: 8px 0;"><a href="${esc(item.url)}" target="_blank" style="color: inherit; text-decoration: none;">${esc(item.title)}</a></h2>
                    <time style="font-size: 12px; color: #666;">${esc(formatTimeAgo(item.publishedAt))}</time>
                </div>
            `;
        });

        newsHTML += '</div>';
        container.innerHTML = newsHTML;
    }
}

// ==========================================
// 5. MAUJOODA BUTTONS / FORMS — SAB KAAM KAREIN
// ==========================================
function wireUpButtons() {
    // --- ☰ mobile menu ---
    const menuBtn = document.getElementById('menu-btn');
    const nav = document.getElementById('primary-nav');
    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
    });

    // --- SUBSCRIBE: current view ke newsletter block tak le jaata hai ---
    document.getElementById('subscribe-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const scope = activeMain();
        const target = scope.querySelector('.newsletter') || scope.querySelector('.sidebar');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = target.querySelector('input[type="email"]');
            if (input) input.focus({ preventScroll: true });
        }
        if (currentView() === 'home') window.location.hash = '#home';
    });

    // --- Sabhi SIGN UP / newsletter forms ---
    document.querySelectorAll('form').forEach((form) => {
        const input = form.querySelector('input[type="email"]');
        if (!input) return;

        const msg = document.createElement('p');
        msg.className = 'form-msg';
        form.insertAdjacentElement('afterend', msg);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = input.value.trim();

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                msg.textContent = 'Please enter a valid email address.';
                msg.className = 'form-msg err';
                return;
            }

            let list = [];
            try {
                list = JSON.parse(localStorage.getItem('dl_subscribers') || '[]');
            } catch (err) {
                list = [];
            }

            if (list.includes(email)) {
                msg.textContent = `${email} already subscribed hai.`;
                msg.className = 'form-msg err';
                return;
            }

            list.push(email);
            localStorage.setItem('dl_subscribers', JSON.stringify(list));
            msg.textContent = `Subscribed! ${email} ko daily brief bheja jayega.`;
            msg.className = 'form-msg ok';
            input.value = '';
        });
    });

    // --- utility bar ka "SUBSCRIBE • SIGN IN" bhi forms tak le jaata hai ---
    const utility = document.querySelector('.utility-bar .page-width span:last-child');
    if (utility) {
        utility.style.cursor = 'pointer';
        utility.addEventListener('click', () => document.getElementById('subscribe-btn').click());
    }
}

// EXECUTE ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    wireUpButtons();
    window.addEventListener('hashchange', showView);
    showView();
});
