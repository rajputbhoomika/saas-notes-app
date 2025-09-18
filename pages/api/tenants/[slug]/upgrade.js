import prisma from '../../../../lib/prisma';
import { authenticate } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const auth = await authenticate(req);
  if (!auth) return res.status(401).json({ error: 'unauthenticated' });
  const { user } = auth;
  const { slug } = req.query;

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return res.status(404).json({ error: 'tenant not found' });
  if (user.tenantId !== tenant.id) return res.status(403).json({ error: 'forbidden' });
  if (user.role !== 'ADMIN') return res.status(403).json({ error: 'only admins can upgrade' });

  await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: 'PRO' } });
  res.json({ ok: true });
}
