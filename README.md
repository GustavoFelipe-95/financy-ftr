# Financy

Aplicação full-stack para organização financeira pessoal, desenvolvida como parte do Desafio FTR da Rocketseat. O Financy permite acompanhar o saldo, registrar receitas e despesas, organizar lançamentos por categorias e manter os dados isolados por usuário.

## Visão geral

O projeto é dividido em dois módulos:

- **Backend**: API GraphQL com Apollo Server e TypeGraphQL.
- **Frontend**: SPA React com Vite, React Router e Apollo Client.

Os dados são persistidos em SQLite por meio do Prisma ORM. A autenticação usa JWT e as senhas são armazenadas com hash usando `bcryptjs`.

## Funcionalidades

- Cadastro e login de usuários.
- Autenticação das operações por token JWT.
- Dashboard com saldo total, receitas e despesas do mês.
- Listagem, criação, edição e exclusão de transações.
- Classificação das transações como `INCOME` ou `EXPENSE`.
- Listagem, criação, edição e exclusão de categorias.
- Categorias com título, descrição, ícone e cor personalizados.
- Perfil com visualização e atualização do nome do usuário.
- Proteção de rotas no frontend e redirecionamento após expiração ou ausência de autenticação.
- Layout responsivo e feedback visual para carregamento e erros.

## Arquitetura

```text
financy-ftr/
├── backend/       # API GraphQL, regras de negócio e persistência
│   ├── prisma/    # Schema e migrations do banco
│   ├── src/
│   └── tests/
└── frontend/      # Aplicação React/Vite
    └── src/
```

```text
React + Apollo Client
          │
          │ GraphQL + Bearer JWT
          ▼
Apollo Server + TypeGraphQL
          │
          ▼
Prisma + SQLite
```

## Tecnologias

### Backend

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js 20 ou superior |
| Linguagem | TypeScript |
| API | GraphQL, Apollo Server e TypeGraphQL |
| ORM | Prisma |
| Banco de dados | SQLite com `better-sqlite3` |
| Autenticação | JWT |
| Senhas | bcryptjs |
| Validação | Zod |
| Testes | Vitest e Playwright |

### Frontend

| Categoria | Tecnologia |
|---|---|
| Biblioteca | React 19 |
| Build tool | Vite |
| Linguagem | TypeScript |
| Roteamento | React Router |
| Cliente GraphQL | Apollo Client |
| Estado e cache | Apollo Cache, React Query e Zustand |
| Formulários | React Hook Form |
| Validação | Zod |
| Estilos | Tailwind CSS |
| Componentes | Radix UI |
| Ícones | Lucide React |
| Notificações | Sonner |

## Pré-requisitos

- Node.js 20 ou superior.
- npm.
- Git.

Não é necessário instalar PostgreSQL: o projeto usa SQLite localmente.

## Instalação e execução

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd financy-ftr
```

### 2. Configurar o backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` a partir de `.env.example`:

```env
JWT_SECRET=uma-chave-secreta-local
DATABASE_URL=file:./database/dev.db
```

Gere o cliente Prisma e execute as migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3001/`.

### 3. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie um arquivo `.env` com a URL da API GraphQL:

```env
VITE_BACKEND_URL=http://localhost:3001/
```

Inicie o frontend:

```bash
npm run dev
```

O Vite exibirá no terminal a URL local, normalmente `http://localhost:5173/`.

## Docker

O backend possui configuração Docker Compose. A partir da pasta `backend`, configure as variáveis de ambiente e execute:

```bash
docker compose up --build
```

O serviço será exposto em `http://localhost:3001/` e o volume `backend-db` manterá o banco SQLite do container.

## Rotas do frontend

| Rota | Acesso | Descrição |
|---|---|---|
| `/login` | Público | Login do usuário |
| `/signup` | Público | Cadastro de usuário |
| `/` | Autenticado | Dashboard financeiro |
| `/categories` | Autenticado | Gerenciamento de categorias |
| `/transactions` | Autenticado | Gerenciamento de transações |
| `/profile` | Autenticado | Perfil do usuário |

## API GraphQL

O endpoint GraphQL é a URL raiz do backend:

```text
http://localhost:3001/
```

### Operações públicas

#### Cadastro

```graphql
mutation {
  signup(
    name: "Maria Silva"
    email: "maria@example.com"
    password: "senha-segura"
  ) {
    token
    user {
      id
      name
      email
    }
  }
}
```

#### Login

```graphql
mutation {
  login(email: "maria@example.com", password: "senha-segura") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Operações autenticadas

Envie o token retornado no login no cabeçalho:

```text
Authorization: Bearer <token>
```

#### Consultas

```graphql
query {
  me {
    id
    name
    email
  }
  categories {
    id
    title
    description
    icon
    color
  }
  transactions {
    id
    description
    amount
    date
    type
    categoryId
    category {
      id
      title
      icon
      color
    }
  }
}
```

#### Criar categoria

```graphql
mutation {
  createCategory(
    data: {
      title: "Moradia"
      description: "Despesas da casa"
      icon: "home"
      color: "#1F6F43"
    }
  ) {
    id
    title
  }
}
```

#### Criar transação

```graphql
mutation {
  createTransaction(
    data: {
      description: "Salário"
      amount: 5000
      date: "2026-09-25"
      type: INCOME
      categoryId: "id-da-categoria"
    }
  ) {
    id
    description
    amount
    type
    date
  }
}
```

As demais mutations disponíveis são `updateCategory`, `deleteCategory`, `updateTransaction`, `deleteTransaction` e `updateUser`.

## Modelo de dados

- **User**: nome, e-mail, senha com hash, categorias e transações.
- **Category**: título, descrição opcional, ícone, cor e usuário proprietário.
- **Transaction**: descrição, valor, data, tipo (`INCOME` ou `EXPENSE`), categoria e usuário proprietário.

Cada categoria e transação pertence a um usuário. As consultas e mutations autenticadas filtram os dados pelo usuário identificado no JWT.

## Scripts

### Backend

| Comando | Descrição |
|---|---|
| `npm run dev` | Executa a API com Nodemon |
| `npm run build` | Compila o TypeScript |
| `npm start` | Executa a versão compilada |
| `npm run prisma:generate` | Gera o cliente Prisma |
| `npm run prisma:migrate` | Cria/aplica migrations de desenvolvimento |
| `npm run test:unit` | Executa os testes unitários |
| `npm run test:e2e` | Executa os testes end-to-end com Playwright |

### Frontend

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o Vite |
| `npm run build` | Verifica tipos e gera o build de produção |
| `npm run lint` | Executa o Oxlint |
| `npm run preview` | Serve o build localmente |

## Variáveis de ambiente

### Backend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `JWT_SECRET` | Sim | Chave usada para assinar os tokens JWT |
| `DATABASE_URL` | Sim | URL do banco SQLite, por exemplo `file:./database/dev.db` |
| `PORT` | Não | Porta da API; o padrão é `3001` |

### Frontend

| Variável | Obrigatória | Descrição |
|---|---|---|
| `VITE_BACKEND_URL` | Sim | URL do endpoint GraphQL do backend |

## Licença

Este projeto está sob a licença ISC.