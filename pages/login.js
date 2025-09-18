import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' } });
    const j = await res.json();
    if (!res.ok) return setErr(j.error || 'login failed');
    localStorage.setItem('token', j.token);
    localStorage.setItem('tenantSlug', j.tenant.slug);
    router.push('/');
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
        <div style={{ color: 'red' }}>{err}</div>
      </form>

      <h4>Test accounts</h4>
      <ul>
        <li>admin@acme.test / password</li>
        <li>user@acme.test / password</li>
        <li>admin@globex.test / password</li>
        <li>user@globex.test / password</li>
      </ul>
    </div>
  );
}
