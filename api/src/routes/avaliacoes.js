const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../database/connection');
const { authenticateCliente, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todas as avaliações
router.get('/', async (req, res) => {
  try {
    const { estabelecimento_id, cliente_id, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        a.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.avatar as cliente_avatar,
        e.id as estabelecimento_id,
        e.nome as estabelecimento_nome,
        e.categoria as estabelecimento_categoria
      FROM avaliacoes a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN estabelecimentos e ON a.estabelecimento_id = e.id
    `;
    
    const params = [];
    const conditions = [];

    if (estabelecimento_id) {
      conditions.push('a.estabelecimento_id = ?');
      params.push(estabelecimento_id);
    }

    if (cliente_id) {
      conditions.push('a.cliente_id = ?');
      params.push(cliente_id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const avaliacoes = await db.all(sql, params);
    res.json(avaliacoes);
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar avaliação por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const avaliacao = await db.get(`
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        a.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.avatar as cliente_avatar,
        e.id as estabelecimento_id,
        e.nome as estabelecimento_nome,
        e.categoria as estabelecimento_categoria
      FROM avaliacoes a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN estabelecimentos e ON a.estabelecimento_id = e.id
      WHERE a.id = ?
    `, [id]);

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json(avaliacao);
  } catch (error) {
    console.error('Erro ao buscar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova avaliação
router.post('/', authenticateCliente, [
  body('estabelecimento_id').isInt({ min: 1 }).withMessage('ID do estabelecimento é obrigatório'),
  body('nota').isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5'),
  body('comentario').optional().trim().isLength({ max: 500 }).withMessage('Comentário deve ter no máximo 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { estabelecimento_id, nota, comentario } = req.body;
    const cliente_id = req.user.id;

    // Verificar se o estabelecimento existe
    const estabelecimento = await db.get('SELECT id FROM estabelecimentos WHERE id = ?', [estabelecimento_id]);
    if (!estabelecimento) {
      return res.status(404).json({ error: 'Estabelecimento não encontrado' });
    }

    // Verificar se o cliente já avaliou este estabelecimento
    const avaliacaoExistente = await db.get(
      'SELECT id FROM avaliacoes WHERE cliente_id = ? AND estabelecimento_id = ?',
      [cliente_id, estabelecimento_id]
    );

    if (avaliacaoExistente) {
      return res.status(409).json({ error: 'Você já avaliou este estabelecimento' });
    }

    // Inserir avaliação
    const result = await db.run(`
      INSERT INTO avaliacoes (cliente_id, estabelecimento_id, nota, comentario) 
      VALUES (?, ?, ?, ?)
    `, [cliente_id, estabelecimento_id, nota, comentario]);

    // Buscar avaliação criada com dados completos
    const novaAvaliacao = await db.get(`
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.avatar as cliente_avatar,
        e.id as estabelecimento_id,
        e.nome as estabelecimento_nome,
        e.categoria as estabelecimento_categoria
      FROM avaliacoes a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN estabelecimentos e ON a.estabelecimento_id = e.id
      WHERE a.id = ?
    `, [result.id]);

    res.status(201).json(novaAvaliacao);
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar avaliação
router.put('/:id', authenticateCliente, [
  body('nota').optional().isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5'),
  body('comentario').optional().trim().isLength({ max: 500 }).withMessage('Comentário deve ter no máximo 500 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { nota, comentario } = req.body;
    const cliente_id = req.user.id;

    // Verificar se a avaliação existe e pertence ao cliente
    const avaliacao = await db.get('SELECT * FROM avaliacoes WHERE id = ? AND cliente_id = ?', [id, cliente_id]);
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada ou acesso negado' });
    }

    // Atualizar avaliação
    await db.run(`
      UPDATE avaliacoes 
      SET nota = COALESCE(?, nota), 
          comentario = COALESCE(?, comentario),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [nota, comentario, id]);

    // Buscar avaliação atualizada
    const avaliacaoAtualizada = await db.get(`
      SELECT 
        a.id,
        a.nota,
        a.comentario,
        a.created_at,
        a.updated_at,
        c.id as cliente_id,
        c.nome as cliente_nome,
        c.avatar as cliente_avatar,
        e.id as estabelecimento_id,
        e.nome as estabelecimento_nome,
        e.categoria as estabelecimento_categoria
      FROM avaliacoes a
      JOIN clientes c ON a.cliente_id = c.id
      JOIN estabelecimentos e ON a.estabelecimento_id = e.id
      WHERE a.id = ?
    `, [id]);

    res.json(avaliacaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar avaliação
router.delete('/:id', authenticateCliente, async (req, res) => {
  try {
    const { id } = req.params;
    const cliente_id = req.user.id;

    // Verificar se a avaliação existe e pertence ao cliente
    const avaliacao = await db.get('SELECT * FROM avaliacoes WHERE id = ? AND cliente_id = ?', [id, cliente_id]);
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada ou acesso negado' });
    }

    const result = await db.run('DELETE FROM avaliacoes WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar estatísticas gerais de avaliações
router.get('/estatisticas/geral', async (req, res) => {
  try {
    const estatisticas = await db.get(`
      SELECT 
        COUNT(*) as total_avaliacoes,
        AVG(nota) as media_geral,
        COUNT(CASE WHEN nota = 5 THEN 1 END) as cinco_estrelas,
        COUNT(CASE WHEN nota = 4 THEN 1 END) as quatro_estrelas,
        COUNT(CASE WHEN nota = 3 THEN 1 END) as tres_estrelas,
        COUNT(CASE WHEN nota = 2 THEN 1 END) as duas_estrelas,
        COUNT(CASE WHEN nota = 1 THEN 1 END) as uma_estrela
      FROM avaliacoes
    `);

    res.json(estatisticas);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;