import prisma from '../../../lib/prisma';
import { authenticate } from '../../../lib/auth';

export default async function handler(req, res) {
  const auth = await authenticate(req);
  if (!auth) return res.status(401).json({ error: 'unauthenticated' });
  const { user } = auth;
  const id = Number(req.query.id);
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return res.status(404).json({ error: 'not found' });
  if (note.tenantId !== user.tenantId) return res.status(403).json({ error: 'forbidden' });

  if (req.method === 'GET') return res.json(note);

  if (req.method === 'PUT') {
    if (user.role !== 'ADMIN' && user.role !== 'MEMBER') return res.status(403).json({ error: 'insufficient role' });
    const { title, content } = req.body || {};
    const updated = await prisma.note.update({ where: { id }, data: { title: title || note.title, content: content || note.content } });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    if (user.role !== 'ADMIN' && user.role !== 'MEMBER') return res.status(403).json({ error: 'insufficient role' });
    await prisma.note.delete({ where: { id } });
    return res.json({ ok: true });
  }

  res.status(405).end();
}
