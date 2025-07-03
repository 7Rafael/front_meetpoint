const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { authenticateEstabelecimento, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todos os estabelecimentos
router.get('/', async (req, res) => {
  try {
    const { categoria, busca } = req.query;
    let sql = `
      SELECT 
        e.id,
        e.nome,
        e.endereco,
        e.categoria,
        e.descricao,
        e.imagem_url,
        e.horario_funcionamento,
        COALESCE(AVG(a.nota), 0) as media_avaliacoes,
        COUNT(a.id) as total_avaliacoes
      FROM estabelecimentos e
      LEFT JOIN avaliacoes a ON e.id = a.estabelecimento_id
    `;
    
    const params = [];
    const conditions = [];

    if (categoria) {
      conditions.push('e.categoria = ?');
      params.push(categoria);
    }

    if (busca) {
      conditions.push('(e.nome LIKE ? OR e.categoria LIKE ? OR e.endereco LIKE ?)');
      params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' GROUP BY e.id ORDER BY media_avaliacoes DESC, total_avaliacoes DESC';

    const estabelecimentos = await db.all(sql, params);
    res.json(estabelecimentos);
  } catch (error) {
    console.error('Erro ao buscar estabelecimentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar estabelecimento por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const estabelecimento = await db.get(`
      SELECT 
        e.*,
        COALESCE(AVG(a.nota), 0) as media_avaliacoes,
        COUNT(a.id) as total_avaliacoes
      FROM estabelecimentos e
      LEFT JOIN avaliacoes a ON e.id = a.estabelecimento_id
      WHERE e.id = ?
      GROUP BY e.id
    `, [id]);

    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Remover senha da resposta
    delete estabelecimento.senha;

    res.json(estabelecimento);
  } catch (error) {
    console.error('Erro ao buscar estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo estabelecimento
router.post('/', [
  body('nome').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('endereco').trim().isLength({ min: 5 }).withMessage('Endereço deve ter pelo menos 5 caracteres'),
  body('categoria').trim().isLength({ min: 2 }).withMessage('Categoria é obrigatória'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      nome, 
      email, 
      senha, 
      cnpj, 
      telefone, 
      endereco, 
      categoria, 
      descricao, 
      imagem_url, 
      horario_funcionamento 
    } = req.body;

    // Verificar se email já existe
    const estabelecimentoExistente = await db.get('SELECT id FROM estabelecimentos WHERE email = ?', [email]);
    if (estabelecimentoExistente) {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    // Verificar se CNPJ já existe (se fornecido)
    if (cnpj) {
      const cnpjExistente = await db.get('SELECT id FROM estabelecimentos WHERE cnpj = ?', [cnpj]);
      if (cnpjExistente) {
        return res.status(409).json({ error: 'CNPJ já está em uso' });
      }
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir estabelecimento
    const result = await db.run(`
      INSERT INTO estabelecimentos 
      (nome, email, senha, cnpj, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [nome, email, senhaHash, cnpj, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento]);

    // Buscar estabelecimento criado
    const novoEstabelecimento = await db.get(`
      SELECT id, nome, email, cnpj, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento, created_at 
      FROM estabelecimentos 
      WHERE id = ?
    `, [result.id]);

    res.status(201).json(novoEstabelecimento);
  } catch (error) {
    console.error('Erro ao criar estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar estabelecimento
router.put('/:id', authenticateEstabelecimento, [
  body('nome').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('endereco').optional().trim().isLength({ min: 5 }).withMessage('Endereço deve ter pelo menos 5 caracteres'),
  body('categoria').optional().trim().isLength({ min: 2 }).withMessage('Categoria é obrigatória'),
  body('telefone').optional().isMobilePhone('pt-BR').withMessage('Telefone inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { 
      nome, 
      telefone, 
      endereco, 
      categoria, 
      descricao, 
      imagem_url, 
      horario_funcionamento 
    } = req.body;

    // Verificar se é o próprio estabelecimento
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await db.run(`
      UPDATE estabelecimentos 
      SET nome = COALESCE(?, nome), 
          telefone = COALESCE(?, telefone), 
          endereco = COALESCE(?, endereco),
          categoria = COALESCE(?, categoria),
          descricao = COALESCE(?, descricao),
          imagem_url = COALESCE(?, imagem_url),
          horario_funcionamento = COALESCE(?, horario_funcionamento),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nome, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento, id]);

    // Buscar estabelecimento atualizado
    const estabelecimentoAtualizado = await db.get(`
      SELECT id, nome, email, cnpj, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento, updated_at 
      FROM estabelecimentos 
      WHERE id = ?
    `, [id]);

    res.json(estabelecimentoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar avaliações do estabelecimento
router.get('/:id/avaliacoes', async (req, res) => {
  try {
    const { id } = req.params;

    const avaliacoes = await db.all(`
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.avatar as cliente_avatar
      FROM avaliacoes a
      JOIN clientes c ON a.cliente_id = c.id
      WHERE a.estabelecimento_id = ?
      ORDER BY a.created_at DESC
    `, [id]);

    res.json(avaliacoes);
  } catch (error) {
    console.error('Erro ao buscar avaliações do estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar estatísticas do estabelecimento
router.get('/:id/estatisticas', authenticateEstabelecimento, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se é o próprio estabelecimento
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const estatisticas = await db.get(`
      SELECT 
        COUNT(a.id) as total_avaliacoes,
        COALESCE(AVG(a.nota), 0) as media_avaliacoes,
        COUNT(CASE WHEN a.nota >= 4 THEN 1 END) as avaliacoes_positivas,
        COUNT(CASE WHEN a.nota <= 2 THEN 1 END) as avaliacoes_negativas,
        COUNT(CASE WHEN a.created_at >= date('now', '-30 days') THEN 1 END) as avaliacoes_mes
      FROM avaliacoes a
      WHERE a.estabelecimento_id = ?
    `, [id]);

    res.json(estatisticas);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar estabelecimento
router.delete('/:id', authenticateEstabelecimento, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se é o próprio estabelecimento
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await db.run('DELETE FROM estabelecimentos WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    res.json({ message: 'Estabelecimento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar estabelecimento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;