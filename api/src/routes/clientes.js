const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { authenticateCliente, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todos os clientes (apenas para desenvolvimento)
router.get('/', async (req, res) => {
  try {
    const clientes = await db.all(`
      SELECT id, nome, email, telefone, avatar, created_at 
      FROM clientes 
      ORDER BY created_at DESC
    `);
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await db.get(`
      SELECT id, nome, email, telefone, avatar, created_at 
      FROM clientes 
      WHERE id = ?
    `, [id]);

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo cliente
router.post('/', [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nome, email, senha, telefone, avatar } = req.body;

    // Verificar se email já existe
    const clienteExistente = await db.get('SELECT id FROM clientes WHERE email = ?', [email]);
    if (clienteExistente) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir cliente
    const result = await db.run(`
      INSERT INTO clientes (nome, email, senha, telefone, avatar) 
      VALUES (?, ?, ?, ?, ?)
    `, [nome, email, senhaHash, telefone, avatar]);

    // Buscar cliente criado
    const novoCliente = await db.get(`
      SELECT id, nome, email, telefone, avatar, created_at 
      FROM clientes 
      WHERE id = ?
    `, [result.id]);

    res.status(201).json(novoCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar cliente
router.put('/:id', authenticateCliente, [
  body('nome').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nome, telefone, avatar } = req.body;

    // Verificar se é o próprio cliente
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await db.run(`
      UPDATE clientes 
      SET nome = COALESCE(?, nome), 
          telefone = COALESCE(?, telefone), 
          avatar = COALESCE(?, avatar),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nome, telefone, avatar, id]);

    // Buscar cliente atualizado
    const clienteAtualizado = await db.get(`
      SELECT id, nome, email, telefone, avatar, updated_at 
      FROM clientes 
      WHERE id = ?
    `, [id]);

    res.json(clienteAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar avaliações do cliente
router.get('/:id/avaliacoes', async (req, res) => {
  try {
    const { id } = req.params;

    const avaliacoes = await db.all(`
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        e.id as estabelecimento_id,
        e.nome as estabelecimento_nome,
        e.categoria as estabelecimento_categoria,
        e.imagem_url as estabelecimento_imagem
      FROM avaliacoes a
      JOIN estabelecimentos e ON a.estabelecimento_id = e.id
      WHERE a.cliente_id = ?
      ORDER BY a.created_at DESC
    `, [id]);

    res.json(avaliacoes);
  } catch (error) {
    console.error('Erro ao buscar avaliações do cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar cliente
router.delete('/:id', authenticateCliente, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se é o próprio cliente
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await db.run('DELETE FROM clientes WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;