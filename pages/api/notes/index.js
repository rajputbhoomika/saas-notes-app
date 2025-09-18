import prisma from '../../../lib/prisma';
import { authenticate } from '../../../lib/auth';

export default async function handler(req, res) {
  const auth = await authenticate(req);
  if (!auth) return res.status(401).json({ error: 'unauthenticated' });
  const { user } = auth;
  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({ where: { tenantId: tenant.id } });
    return res.json(notes);
  }

  if (req.method === 'POST') {
    if (user.role !== 'ADMIN' && user.role !== 'MEMBER') {
      return res.status(403).json({ error: 'insufficient role' });
    }
    if (tenant.plan === 'FREE') {
      const count = await prisma.note.count({ where: { tenantId: tenant.id } });
      if (count >= 3) return res.status(403).json({ error: 'note limit reached for Free plan' });
    }
    const { title, content } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });
    const note = await prisma.note.create({ data: { title, content: content || '', tenantId: tenant.id, authorId: user.id } });
    return res.status(201).json(note);
  }

  return res.status(405).end();
}
