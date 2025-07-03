# MeetPoint API

API REST para o aplicativo MeetPoint, desenvolvida em Node.js com SQLite.

## 🚀 Funcionalidades

- **Autenticação JWT** para clientes e estabelecimentos
- **CRUD completo** para clientes, estabelecimentos e avaliações
- **Sistema de avaliações** com notas de 1 a 5 estrelas
- **Busca e filtros** para estabelecimentos
- **Estatísticas** para estabelecimentos
- **Validação de dados** com express-validator
- **Banco de dados SQLite** com dados de exemplo

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Navegue até a pasta da API:
```bash
cd api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicialize o banco de dados:
```bash
npm run init-db
```

5. Inicie o servidor:
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 📚 Endpoints

### Autenticação

#### Login de Cliente
```http
POST /api/auth/cliente/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "123456"
}
```

#### Login de Estabelecimento
```http
POST /api/auth/estabelecimento/login
Content-Type: application/json

{
  "email": "carlos@cafesublime.com",
  "senha": "123456"
}
```

### Clientes

#### Listar Clientes
```http
GET /api/clientes
```

#### Buscar Cliente por ID
```http
GET /api/clientes/:id
```

#### Criar Cliente
```http
POST /api/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "123456",
  "telefone": "(11) 99999-9999",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Atualizar Cliente
```http
PUT /api/clientes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "telefone": "(11) 88888-8888"
}
```

#### Buscar Avaliações do Cliente
```http
GET /api/clientes/:id/avaliacoes
```

### Estabelecimentos

#### Listar Estabelecimentos
```http
GET /api/estabelecimentos
GET /api/estabelecimentos?categoria=Café
GET /api/estabelecimentos?busca=sublime
```

#### Buscar Estabelecimento por ID
```http
GET /api/estabelecimentos/:id
```

#### Criar Estabelecimento
```http
POST /api/estabelecimentos
Content-Type: application/json

{
  "nome": "Café Sublime",
  "email": "contato@cafesublime.com",
  "senha": "123456",
  "cnpj": "12.345.678/0001-90",
  "telefone": "(11) 3333-1111",
  "endereco": "Rua das Flores, 123",
  "categoria": "Café",
  "descricao": "Café artesanal com ambiente aconchegante",
  "imagem_url": "https://example.com/cafe.jpg",
  "horario_funcionamento": "Segunda a Sexta: 7h às 19h"
}
```

#### Atualizar Estabelecimento
```http
PUT /api/estabelecimentos/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Café Sublime Premium",
  "descricao": "Café artesanal premium com ambiente aconchegante"
}
```

#### Buscar Avaliações do Estabelecimento
```http
GET /api/estabelecimentos/:id/avaliacoes
```

#### Buscar Estatísticas do Estabelecimento
```http
GET /api/estabelecimentos/:id/estatisticas
Authorization: Bearer {token}
```

### Avaliações

#### Listar Avaliações
```http
GET /api/avaliacoes
GET /api/avaliacoes?estabelecimento_id=1
GET /api/avaliacoes?cliente_id=1
```

#### Buscar Avaliação por ID
```http
GET /api/avaliacoes/:id
```

#### Criar Avaliação
```http
POST /api/avaliacoes
Authorization: Bearer {token}
Content-Type: application/json

{
  "estabelecimento_id": 1,
  "nota": 5,
  "comentario": "Ótimo café, ambiente agradável!"
}
```

#### Atualizar Avaliação
```http
PUT /api/avaliacoes/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "nota": 4,
  "comentario": "Bom café, mas pode melhorar o atendimento"
}
```

#### Deletar Avaliação
```http
DELETE /api/avaliacoes/:id
Authorization: Bearer {token}
```

#### Estatísticas Gerais
```http
GET /api/avaliacoes/estatisticas/geral
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Após fazer login, inclua o token no header Authorization:

```
Authorization: Bearer {seu_token_aqui}
```

## 📊 Dados de Exemplo

O banco de dados é inicializado com dados de exemplo:

### Clientes
- João Silva (joao@example.com)
- Maria Oliveira (maria@example.com)

### Estabelecimentos
- Café Sublime (carlos@cafesublime.com)
- Restaurante Oliveira (ana@restauranteoliveira.com)
- Padaria São José
- Bar do Zé
- Farmácia Saúde
- Mercado Bom Preço

### Credenciais de Teste
- **Senha padrão**: `123456`

## 🛠️ Estrutura do Projeto

```
api/
├── src/
│   ├── database/
│   │   ├── connection.js      # Conexão com SQLite
│   │   ├── init.js           # Inicialização do banco
│   │   └── meetpoint.db      # Arquivo do banco SQLite
│   ├── middleware/
│   │   └── auth.js           # Middleware de autenticação
│   ├── routes/
│   │   ├── auth.js           # Rotas de autenticação
│   │   ├── clientes.js       # Rotas de clientes
│   │   ├── estabelecimentos.js # Rotas de estabelecimentos
│   │   └── avaliacoes.js     # Rotas de avaliações
│   └── server.js             # Servidor principal
├── uploads/                  # Pasta para uploads (futura)
├── .env                      # Variáveis de ambiente
├── package.json
└── README.md
```

## 🧪 Testando a API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Login de Cliente
```bash
curl -X POST http://localhost:3000/api/auth/cliente/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","senha":"123456"}'
```

### Listar Estabelecimentos
```bash
curl http://localhost:3000/api/estabelecimentos
```

## 🔄 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento (com nodemon)
- `npm run init-db` - Inicializa o banco de dados

## 📝 Validações

A API inclui validações para:
- Emails válidos
- Senhas com mínimo de 6 caracteres
- Notas de avaliação entre 1 e 5
- Campos obrigatórios
- Telefones no formato brasileiro
- Limites de caracteres para comentários

## 🚨 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "error": "Mensagem de erro",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT com expiração de 7 dias
- Validação de entrada em todas as rotas
- Middleware de autenticação para rotas protegidas
- CORS habilitado para desenvolvimento

## 📈 Próximas Funcionalidades

- [ ] Upload de imagens
- [ ] Sistema de notificações
- [ ] Relatórios avançados
- [ ] Cache com Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Testes automatizados
- [ ] Documentação com Swagger

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.