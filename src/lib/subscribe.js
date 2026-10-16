const SUBSCRIBERS_KEY = 'dl_subscribers';

export function subscribeEmail(email, list = 'morning-brief') {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }

  let subs;
  try {
    subs = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY)) || [];
  } catch {
    subs = [];
  }

  if (subs.some((s) => s.email === normalized && s.list === list)) {
    return { ok: false, message: 'This email is already subscribed.' };
  }

  subs.push({ email: normalized, list, at: new Date().toISOString() });
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subs));
  return { ok: true, message: 'You are subscribed. The next edition is on its way!' };
}
