import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function api(path, opts={}){
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return fetch(path, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers||{}), ...(token?{ Authorization: 'Bearer '+token }: {}) } }).then(r=>r);
}

export default function Home(){
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tenant, setTenant] = useState(null);
  const router = useRouter();

  async function load(){
    const res = await api('/api/notes');
    if (res.status === 401) return router.push('/login');
    const j = await res.json();
    setNotes(j);
    const slug = localStorage.getItem('tenantSlug');
    setTenant(slug);
  }

  useEffect(()=>{ load(); }, []);

  async function createNote(e){
    e.preventDefault();
    const res = await api('/api/notes', { method: 'POST', body: JSON.stringify({ title, content }) });
    if (!res.ok) {
      const j = await res.json();
      alert(j.error || 'failed');
      return;
    }
    setTitle(''); setContent('');
    load();
  }

  async function del(id){
    if (!confirm('delete?')) return;
    await api('/api/notes/'+id, { method: 'DELETE' });
    load();
  }

  async function upgrade(){
    const slug = localStorage.getItem('tenantSlug');
    const res = await api('/api/tenants/'+slug+'/upgrade', { method: 'POST' });
    if (!res.ok) { const j = await res.json(); alert(j.error || 'upgrade failed'); return; }
    alert('Upgraded to Pro');
    load();
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Notes</h2>
      <form onSubmit={createNote}>
        <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
        <br />
        <textarea placeholder="content" value={content} onChange={e=>setContent(e.target.value)} />
        <br />
        <button type="submit">Create</button>
      </form>

      <h3>All notes</h3>
      <ul>
        {notes.map(n=> (
          <li key={n.id}><strong>{n.title}</strong> — {n.content} <button onClick={()=>del(n.id)}>Delete</button></li>
        ))}
      </ul>

      <p>Tenant: {tenant}</p>
      <button onClick={upgrade}>Upgrade to Pro (Admin only)</button>
    </div>
  );
}
