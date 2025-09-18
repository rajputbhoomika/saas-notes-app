const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function signToken(user) {
  return jwt.sign(
    {
      uid: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function authenticate(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  try {
    const payload = verifyToken(parts[1]);
    const user = await prisma.user.findUnique({ where: { id: payload.uid } });
    if (!user) return null;
    return { user, payload };
  } catch (e) {
    return null;
  }
}

module.exports = { signToken, authenticate, bcrypt };
