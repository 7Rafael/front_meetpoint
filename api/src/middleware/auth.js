const jwt = require('jsonwebtoken');
const db = require('../database/connection');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o usuário ainda existe
    let user;
    if (decoded.type === 'cliente') {
      user = await db.get('SELECT id, nome, email FROM clientes WHERE id = ?', [decoded.id]);
    } else if (decoded.type === 'estabelecimento') {
      user = await db.get('SELECT id, nome, email FROM estabelecimentos WHERE id = ?', [decoded.id]);
    }

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = { ...user, type: decoded.type };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

const authenticateCliente = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.type !== 'cliente') {
      return res.status(403).json({ error: 'Acesso restrito a clientes' });
    }
    next();
  });
};

const authenticateEstabelecimento = async (req, res, next) => {
  await authenticateToken(req, res, () => {
    if (req.user.type !== 'estabelecimento') {
      return res.status(403).json({ error: 'Acesso restrito a estabelecimentos' });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  authenticateCliente,
  authenticateEstabelecimento
};