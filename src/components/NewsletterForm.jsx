import { useState } from 'react';
import { subscribeEmail } from '../lib/subscribe.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function NewsletterForm({ list = 'daily-brief', className = '' }) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [status, setStatus] = useState(null);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const result = subscribeEmail(email, list);
        setStatus(result);
        if (result.ok) setEmail('');
      }}
    >
      <label className="sr-only" htmlFor={`nl-${list}`}>Email address</label>
      <input
        id={`nl-${list}`}
        type="email"
        placeholder={user ? user.email : 'Your email address'}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setStatus(null);
        }}
        required
      />
      <button type="submit">SIGN UP</button>
      {status && (
        <small className={status.ok ? 'form-msg ok' : 'form-msg err'} role="status">
          {status.message}
        </small>
      )}
    </form>
  );
}
