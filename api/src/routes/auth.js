const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');

const router = express.Router();

// Gerar token JWT
const generateToken = (user, type) => {
  return jwt.sign(
    { id: user.id, email: user.email, type },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Login de cliente
router.post('/cliente/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    const cliente = await db.get('SELECT * FROM clientes WHERE email = ?', [email]);
    if (!cliente) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(cliente, 'cliente');

    res.json({
      token,
      user: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        avatar: cliente.avatar,
        type: 'cliente'
      }
    });
  } catch (error) {
    console.error('Erro no login do cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login de estabelecimento
router.post('/estabelecimento/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, senha } = req.body;

    const estabelecimento = await db.get('SELECT * FROM estabelecimentos WHERE email = ?', [email]);
    if (!estabelecimento) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, estabelecimento.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(estabelecimento, 'estabelecimento');

    res.json({
      token,
      user: {
        id: estabelecimento.id,
        nome: estabelecimento.nome,
        email: estabelecimento.email,
        telefone: estabelecimento.telefone,
        cnpj: estabelecimento.cnpj,
        endereco: estabelecimento.endereco,
        categoria: estabelecimento.categoria,
        type: 'estabelecimento'
      }
    });
  } catch (error) {
    console.error('Erro no login do estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;