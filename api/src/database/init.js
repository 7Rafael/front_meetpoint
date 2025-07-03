const db = require('./connection');

async function initDatabase() {
  try {
    await db.connect();

    // Criar tabela de clientes
    await db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        telefone TEXT,
        avatar TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de estabelecimentos
    await db.run(`
      CREATE TABLE IF NOT EXISTS estabelecimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        cnpj TEXT UNIQUE,
        telefone TEXT,
        endereco TEXT NOT NULL,
        categoria TEXT NOT NULL,
        descricao TEXT,
        imagem_url TEXT,
        horario_funcionamento TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de avaliações
    await db.run(`
      CREATE TABLE IF NOT EXISTS avaliacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        estabelecimento_id INTEGER NOT NULL,
        nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
        comentario TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
        FOREIGN KEY (estabelecimento_id) REFERENCES estabelecimentos (id) ON DELETE CASCADE,
        UNIQUE(cliente_id, estabelecimento_id)
      )
    `);

    // Inserir dados de exemplo
    await insertSampleData();

    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
  }
}

async function insertSampleData() {
  try {
    // Verificar se já existem dados
    const clienteExistente = await db.get('SELECT id FROM clientes LIMIT 1');
    if (clienteExistente) {
      console.log('📊 Dados de exemplo já existem no banco');
      return;
    }

    // Inserir clientes de exemplo
    const bcrypt = require('bcryptjs');
    const senhaHash = await bcrypt.hash('123456', 10);

    await db.run(`
      INSERT INTO clientes (nome, email, senha, telefone, avatar) VALUES 
      ('João Silva', 'joao@example.com', ?, '(11) 99999-1111', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'),
      ('Maria Oliveira', 'maria@example.com', ?, '(11) 99999-2222', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400')
    `, [senhaHash, senhaHash]);

    // Inserir estabelecimentos de exemplo
    await db.run(`
      INSERT INTO estabelecimentos (nome, email, senha, cnpj, telefone, endereco, categoria, descricao, imagem_url, horario_funcionamento) VALUES 
      ('Café Sublime', 'carlos@cafesublime.com', ?, '12.345.678/0001-90', '(11) 3333-1111', 'Rua das Flores, 123', 'Café', 'Café artesanal com ambiente aconchegante', 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=800', 'Segunda a Sexta: 7h às 19h\nSábado: 8h às 16h'),
      ('Restaurante Oliveira', 'ana@restauranteoliveira.com', ?, '98.765.432/0001-10', '(11) 3333-2222', 'Av. Principal, 456', 'Restaurante', 'Culinária brasileira tradicional', 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=800', 'Terça a Domingo: 11h às 23h'),
      ('Padaria São José', 'contato@padariasaojose.com', ?, '11.222.333/0001-44', '(11) 3333-3333', 'Rua João VI, 789', 'Padaria', 'Pães frescos e doces caseiros', 'https://images.pexels.com/photos/1974821/pexels-photo-1974821.jpeg?auto=compress&cs=tinysrgb&w=800', 'Todos os dias: 6h às 20h'),
      ('Bar do Zé', 'ze@bardoze.com', ?, '55.666.777/0001-88', '(11) 3333-4444', 'Praça Central, 234', 'Bar', 'Ambiente descontraído com música ao vivo', 'https://images.pexels.com/photos/274192/pexels-photo-274192.jpeg?auto=compress&cs=tinysrgb&w=800', 'Quarta a Sábado: 18h às 2h'),
      ('Farmácia Saúde', 'contato@farmaciasaude.com', ?, '33.444.555/0001-66', '(11) 3333-5555', 'Av. das Indústrias, 567', 'Farmácia', 'Medicamentos e produtos de saúde', 'https://images.pexels.com/photos/139398/himalayas-mountains-nepal-himalaya-139398.jpeg?auto=compress&cs=tinysrgb&w=800', 'Segunda a Sábado: 8h às 22h'),
      ('Mercado Bom Preço', 'contato@mercadobompreco.com', ?, '77.888.999/0001-22', '(11) 3333-6666', 'Rua dos Comerciantes, 890', 'Mercado', 'Produtos frescos e variedade', 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800', 'Todos os dias: 7h às 22h')
    `, [senhaHash, senhaHash, senhaHash, senhaHash, senhaHash, senhaHash]);

    // Inserir avaliações de exemplo
    await db.run(`
      INSERT INTO avaliacoes (cliente_id, estabelecimento_id, nota, comentario) VALUES 
      (1, 1, 5, 'Ótimo café, ambiente agradável e atendimento excelente!'),
      (2, 1, 4, 'Gostei bastante do lugar, mas achei um pouco caro.'),
      (1, 2, 4, 'Comida muito boa, mas demorou um pouco para ser servida.'),
      (1, 3, 5, 'Pães fresquinhos e deliciosos. Recomendo!'),
      (2, 4, 3, 'Lugar barulhento, mas as bebidas são boas.')
    `);

    console.log('📊 Dados de exemplo inseridos com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { initDatabase };