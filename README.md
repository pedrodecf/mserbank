# MSERBank - Sistema Bancário com Microserviços

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Node](https://img.shields.io/badge/Node.js-20+-green)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-orange)
![Kong](https://img.shields.io/badge/Kong-3.5-green)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

## 📊 Relatório de Progresso

### 🗂️ Gestão de Atividades

**Plataforma:** GitHub Issues  
🔗 **Repositório:** [MSERBank – Issues](https://github.com/pedrodecf/mserbank/issues)

---

### 🧱 Organização do Backlog

O projeto foi estruturado em **9 tarefas principais**, cada uma representando um *milestone* alinhado aos requisitos do desafio:

| Task | Descrição |
|-----|----------|
| **T01** | Definição da Arquitetura e Setup Inicial |
| **T02** | Microsserviço de Clientes – Endpoints Mínimos |
| **T03** | Microsserviço de Transações – Endpoints Mínimos |
| **T04** | Comunicação entre Microsserviços e Mensageria |
| **T05** | Autenticação, Autorização e Segurança |
| **T06** | Testes Unitários e de Integração |
| **T07** | Logging, Monitoramento e API Gateway |
| **T08** | Funcionalidades Extras |
| **T09** | Documentação Final |

---

### 🎯 Priorização

A execução foi organizada de forma incremental, priorizando base sólida antes da complexidade:

1. **Fundação** — Arquitetura, setup inicial e modelagem de dados  
2. **Core Features** — Endpoints essenciais de cada serviço  
3. **Comunicação** — Mensageria assíncrona com RabbitMQ  
4. **Segurança** — JWT, guards e validações  
5. **Qualidade** — Testes unitários e de integração  
6. **Infraestrutura** — Kong Gateway e logs estruturados  
7. **Refinamento** — Funcionalidades extras (Redis, novas rotas)  
8. **Entrega** — Documentação e preparação para deploy  

---

### 🚀 Próximos Passos

- Implementar **refresh token JWT**, com access tokens de curta duração e possibilidade de revogação
- Executar **testes de carga e estresse** para validar escalabilidade e identificar gargalos
- Estruturar um **pipeline de CI/CD** com validações automáticas e deploy por ambiente
- Definir a infraestrutura usando **Terraform (IaC)**, garantindo versionamento e reprodutibilidade
- Implementar um **banco de histórico/auditoria** para rastreabilidade de eventos e mudanças no domínio
- Criar um **BFF (Backend for Frontend)** para reduzir acoplamento e otimizar a comunicação com o frontend

---

### 🤖 Ferramentas de IA Utilizadas

#### Cursor AI (Claude Sonnet 4.5)
- Utilizado para *pair programming*, revisão de código e definição de **Cursor Rules**

#### MCP Context7
- Utilizado para acesso a documentação atualizada e contextualizada durante o desenvolvimento

#### GPT
- Utilizado para esclarecimento de dúvidas técnicas, validação de abordagens e sugestões arquiteturais


---

## 📋 Índice

- [Relatório de Progresso](#-relatório-de-progresso)
- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Serviços](#-serviços)
- [Modelagem de Dados](#-modelagem-de-dados)
- [API Endpoints](#-api-endpoints)
- [Mensageria e Eventos](#-mensageria-e-eventos)
- [Como Executar](#-como-executar)
- [Testes](#-testes)
- [Segurança](#-segurança)
- [Monitoramento e Logs](#-monitoramento-e-logs)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Licença](#-licença)

---

## 🎯 Visão Geral

O **MSERBank** é um sistema bancário modular e escalável que implementa:

- ✅ **Arquitetura de Microserviços**: Serviços independentes e desacoplados
- ✅ **API Gateway (Kong)**: Ponto de entrada único com rate limiting, CORS e logging
- ✅ **Autenticação JWT**: Segurança baseada em tokens
- ✅ **Mensageria Assíncrona (RabbitMQ)**: Comunicação desacoplada entre serviços
- ✅ **Cache Distribuído (Redis)**: Performance otimizada com cache inteligente
- ✅ **Validação Robusta (Zod)**: Schemas tipados e validação em runtime
- ✅ **ORM Prisma**: Type-safe database queries
- ✅ **Logging Estruturado (Pino)**: Logs JSON para análise e monitoramento
- ✅ **Testes Completos**: Unit, Integration e E2E tests
- ✅ **Documentação OpenAPI (Swagger)**: APIs autodocumentadas
- ✅ **Docker & Docker Compose**: Deploy simplificado e consistente

---

## 🏗️ Arquitetura

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENTE (HTTP/HTTPS)                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Kong API Gateway (8000)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Rate Limiting (100 req/min, 5000 req/hora)             │  │
│  │  • CORS                                                   │  │
│  │  • Request Size Limiting (10MB)                           │  │
│  │  • JWT Validation                                         │  │
│  │  • Logging & Monitoring                                   │  │
│  │  • Load Balancing                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────┬────────────────────┘
                 │                           │
        ┌────────┴────────┐         ┌────────┴────────┐
        │                 │         │                 │
        ▼                 │         ▼                 │
┌──────────────┐          │   ┌──────────────┐        │
│  Customers   │          │   │ Transactions │        │
│   Service    │◄─────────┼───┤   Service    │        │
│  (NestJS)    │  RabbitMQ│   │  (NestJS)    │        │
│  Port 3001   │          │   │  Port 3002   │        │
└──────┬───────┘          │   └──────┬───────┘        │
       │                  │          │                │
       ├──────┬───────────┼──────────┤                │
       │      │           │          │                │
       ▼      ▼           ▼          ▼                ▼
   ┌────┐ ┌─────┐   ┌─────────┐ ┌─────┐      ┌───────────┐
   │ PG │ │Redis│   │RabbitMQ │ │ PG  │      │  Health   │
   │    │ │     │   │(Async)  │ │     │      │  Checks   │
   └────┘ └─────┘   └─────────┘ └─────┘      └───────────┘
  customers          Messaging  transactions
  database            Broker     database
```

### Comunicação entre Serviços

#### Síncrona (REST via Kong)
- Cliente → Kong → Customers Service
- Cliente → Kong → Transactions Service

#### Assíncrona (RabbitMQ)
- **Transactions Service → Customers Service**: Validação de transações
- **Customers Service → Transactions Service**: Resposta de validação
- **Customers Service ↔ Transactions Service**: Consulta de saldo

### Padrões Arquiteturais

#### 1. **Separação de Responsabilidades**
Cada funcionalidade possui arquivos separados:
```
users/
├── controllers/       # Recebe requisições HTTP
│   ├── register.controller.ts
│   ├── login.controller.ts
│   └── findOneUser.controller.ts
├── services/          # Lógica de negócio
│   ├── register.service.ts
│   ├── login.service.ts
│   └── findOneUser.service.ts
├── repositories/      # Acesso a dados
│   ├── createUser.repository.ts
│   └── findOneUser.repository.ts
├── schemas/           # Validação Zod
│   ├── register.schema.ts
│   └── login.schema.ts
├── dto/              # Data Transfer Objects
│   ├── register.dto.ts
│   └── login.dto.ts
├── consumers/        # Consumidores RabbitMQ
│   └── transactionCreated.consumer.ts
└── producers/        # Produtores RabbitMQ
    └── transactionValidation.producer.ts
```

#### 2. **Database per Service**
Cada microserviço tem seu próprio banco de dados PostgreSQL:
- `postgres-customers` (porta 5432): Dados de usuários e bancários
- `postgres-transactions` (porta 5433): Histórico de transações

#### 3. **API Gateway Pattern**
Kong atua como single entry point, fornecendo:
- Roteamento centralizado
- Autenticação/Autorização
- Rate limiting
- CORS
- Logging

#### 4. **Event-Driven Architecture**
Comunicação assíncrona via eventos RabbitMQ para:
- Desacoplamento de serviços
- Processamento assíncrono
- Resiliência e retry automático

---

## 🚀 Tecnologias

| Categoria | Tecnologias |
|-----------|-------------|
| **Backend** | Node.js 20+, NestJS 11, TypeScript 5.7, Prisma 6.19 |
| **API Gateway** | Kong 3.5 |
| **Bancos de Dados** | PostgreSQL 16 (por serviço), Redis 7 |
| **Mensageria** | RabbitMQ 3 |
| **Validação** | Zod 4.3, Swagger/OpenAPI 3.0 |
| **Segurança** | JWT, Bcrypt 6, Passport 0.7 |
| **Logging** | Pino + Pino-pretty |
| **Testes** | Jest 30, Supertest 7 |
| **DevOps** | Docker, Docker Compose, ESLint, Prettier |

---

## 📦 Serviços

### 1. Customers Service (Porta 3001)

**Responsabilidades**: Usuários, autenticação, dados bancários, validação de transações, saldo  
**Swagger**: http://localhost:3001/api/docs  
**Stack**: PostgreSQL + Redis + RabbitMQ

**Eventos RabbitMQ**:
- Consome: `transaction.created`
- Produz: `transaction.validated`, `transaction.rejected`

---

### 2. Transactions Service (Porta 3002)

**Responsabilidades**: Criação e histórico de transações  
**Swagger**: http://localhost:3002/api/docs  
**Stack**: PostgreSQL + RabbitMQ

**Eventos RabbitMQ**:
- Produz: `transaction.created`
- Consome: `transaction.validated`, `transaction.rejected`

**Fluxo de Transação**:
```
1. Cliente cria transação → Status: PENDING
2. Emite "transaction.created" → RabbitMQ
3. Customers valida sender e receiver
4. Retorna "validated" ou "rejected"
5. Status atualizado: COMPLETED ou FAILED
```

---

### 3. Kong API Gateway (Porta 8000)

**Admin API**: `8001` | **Documentação**: [services/kong/README.md](services/kong/README.md)

**Funcionalidades**: Rate Limiting (100 req/min, 5000 req/hora), CORS, Request Size Limiting (10MB), Health Checks  
**Modo**: DB-less (configuração via `kong.yml`)

---

## 🗄️ Modelagem de Dados

### Customers Database

#### Tabela: `users`
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  address         TEXT,
  profile_picture TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  deleted_at      TIMESTAMP
);
```

#### Tabela: `banking_details`
```sql
CREATE TABLE banking_details (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency          VARCHAR(10) NOT NULL,
  account_number  VARCHAR(20) UNIQUE NOT NULL,
  nickname        VARCHAR(50) DEFAULT 'primary account',
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

#### Tabela: `users_password`
```sql
CREATE TABLE users_password (
  id          VARCHAR(191) PRIMARY KEY, -- user_id
  hash        VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### Transactions Database

#### Tabela: `transactions`
```sql
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_user_id  UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  amount          INTEGER NOT NULL, -- Valor em centavos
  description     TEXT,
  status          transaction_status DEFAULT 'PENDING',
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TYPE transaction_status AS ENUM (
  'PENDING',
  'PROCESSING', 
  'COMPLETED',
  'FAILED'
);

CREATE INDEX idx_transactions_sender ON transactions(sender_user_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_user_id);
```

---

## 🔌 API Endpoints

### Base URLs
- **Kong (Produção)**: `http://localhost:8000`
- **Customers (Dev)**: `http://localhost:3001`
- **Transactions (Dev)**: `http://localhost:3002`

### Rotas Públicas

#### 1. Registro de Usuário
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "SenhaForte123!"
}
```

**Validações**:
- `name`: obrigatório, mínimo 1 caractere
- `email`: obrigatório, formato válido
- `password`: mínimo 8 caracteres, deve conter:
  - 1 letra maiúscula
  - 1 letra minúscula
  - 1 número
  - 1 caractere especial

**Resposta** (201):
```json
{
  "message": "User registered successfully"
}
```

---

#### 2. Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "SenhaForte123!"
}
```

**Resposta** (200):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao@example.com",
  }
}
```

---

#### 3. Health Checks
```http
GET /health/customers
GET /health/transactions
```

**Resposta** (200):
```json
{
  "status": "ok"
}
```

---

### Rotas Protegidas

> ⚠️ **Todas as rotas abaixo requerem header**: `Authorization: Bearer <token>`

#### 4. Obter Usuário por ID
```http
GET /api/users/:userId
Authorization: Bearer <token>
```

**Resposta** (200):
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "João Silva",
  "email": "joao@example.com",
  "address": "Rua Example, 123",
  "profilePicture": "https://example.com/photo.jpg",
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-10T12:00:00.000Z",
  "bankingDetails": {
    "id": "banking-id",
    "agency": "0001",
    "accountNumber": "123456-7",
    "nickname": "Conta Principal",
    "userId": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

**Regras**:
- Usuário só pode acessar seus próprios dados (Ownership Guard)

---

#### 5. Atualizar Usuário
```http
PATCH /api/users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Santos",
  "address": "Rua Nova, 456",
  "bankingDetails": {
    "nickname": "Conta Pessoal"
  }
}
```

**Campos opcionais**:
- `name`: string
- `email`: email válido
- `address`: string (nullable)
- `bankingDetails.nickname`: string (nullable)

**Validação**: Pelo menos 1 campo deve ser fornecido

**Resposta** (200): Objeto completo do usuário atualizado

---

#### 6. Atualizar Foto de Perfil
```http
PATCH /api/users/:userId/profile-picture
Authorization: Bearer <token>
Content-Type: application/json

{
  "profilePicture": "https://example.com/new-photo.jpg"
}
```

**Resposta** (200): Objeto completo do usuário

---

#### 7. Obter Saldo do Usuário
```http
GET /api/users/:userId/balance
Authorization: Bearer <token>
```

**Resposta** (200):
```json
{
  "balance": 150000
}
```

**Observações**:
- Valor retornado em centavos (R$ 1.500,00 = 150000)
- Cache Redis: 1 hora
- Calculado com base em transações COMPLETED

---

#### 8. Criar Transação
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "senderUserId": "123e4567-e89b-12d3-a456-426614174000",
  "receiverUserId": "123e4567-e89b-12d3-a456-426614174001",
  "amount": 10000,
  "description": "Pagamento de serviço"
}
```

**Validações**:
- `senderUserId`: UUID válido (deve ser o usuário autenticado)
- `receiverUserId`: UUID válido
- `amount`: inteiro positivo (em centavos)
- `description`: string (opcional)

**Resposta** (201):
```json
{
  "id": "transaction-id",
  "senderUserId": "123e4567-e89b-12d3-a456-426614174000",
  "receiverUserId": "123e4567-e89b-12d3-a456-426614174001",
  "amount": 10000,
  "description": "Pagamento de serviço",
  "status": "PENDING",
  "createdAt": "2026-01-10T12:00:00.000Z",
  "updatedAt": "2026-01-10T12:00:00.000Z"
}
```

**Regras**:
- Usuário autenticado deve ser o sender
- Processamento assíncrono via RabbitMQ

---

#### 9. Obter Transação por ID
```http
GET /api/transactions/:transactionId
Authorization: Bearer <token>
```

**Resposta** (200): Objeto da transação

**Regras**:
- Usuário deve ser sender OU receiver da transação

---

#### 10. Listar Transações do Usuário
```http
GET /api/transactions/user/:userId
Authorization: Bearer <token>
```

**Resposta** (200):
```json
[
  {
    "id": "transaction-id-1",
    "senderUserId": "123e4567-e89b-12d3-a456-426614174000",
    "receiverUserId": "123e4567-e89b-12d3-a456-426614174001",
    "amount": 10000,
    "description": "Pagamento 1",
    "status": "COMPLETED",
    "createdAt": "2026-01-10T12:00:00.000Z",
    "updatedAt": "2026-01-10T12:05:00.000Z"
  },
  {
    "id": "transaction-id-2",
    "senderUserId": "123e4567-e89b-12d3-a456-426614174001",
    "receiverUserId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 5000,
    "description": "Pagamento 2",
    "status": "COMPLETED",
    "createdAt": "2026-01-09T10:00:00.000Z",
    "updatedAt": "2026-01-09T10:05:00.000Z"
  }
]
```

**Observações**:
- Retorna transações enviadas E recebidas pelo usuário
- Ordenadas por `createdAt` DESC

---

## 📨 Mensageria e Eventos

### Eventos RabbitMQ

#### Queues
- `customers_queue`: Consumida pelo Customers Service
- `transactions_queue`: Consumida pelo Transactions Service

#### Eventos Disponíveis

| Evento | Produtor | Consumidor | Payload | Descrição |
|--------|----------|------------|---------|-----------|
| `transaction.created` | Transactions | Customers | `{ transactionId, senderUserId, receiverUserId, amount }` | Nova transação criada, aguardando validação |
| `transaction.validated` | Customers | Transactions | `{ transactionId }` | Transação validada (usuários existem) |
| `transaction.rejected` | Customers | Transactions | `{ transactionId, reason }` | Transação rejeitada (usuário não existe) |
| `balance.completed_transactions.requested` | Customers | Transactions | `{ userId, correlationId }` | Solicita total de transações para calcular saldo |
| `balance.completed_transactions.response` | Transactions | Customers | `{ userId, totalReceived, totalSent, correlationId }` | Resposta com totais de transações |

### Fluxo de Criação de Transação

```
┌──────────────┐                    ┌────────────────┐                  ┌──────────────┐
│   Cliente    │                    │  Transactions  │                  │  Customers   │
│              │                    │    Service     │                  │   Service    │
└──────┬───────┘                    └────────┬───────┘                  └───────┬──────┘
       │                                     │                                  │
       │  POST /api/transactions             │                                  │
       │────────────────────────────────────>│                                  │
       │                                     │                                  │
       │                                     │ 1. Save (status: PENDING)        │
       │                                     │─┐                                │
       │                                     │ │                                │
       │                                     │<┘                                │
       │                                     │                                  │
       │  201 Created                        │                                  │
       │<────────────────────────────────────│                                  │
       │                                     │                                  │
       │                                     │ 2. Emit "transaction.created"    │
       │                                     │─────────────────────────────────>│
       │                                     │                                  │
       │                                     │                                  │ 3. Validate sender
       │                                     │                                  │ 4. Validate receiver
       │                                     │                                  │─┐
       │                                     │                                  │ │
       │                                     │                                  │<┘
       │                                     │                                  │
       │                                     │ 5. Emit "transaction.validated"  │
       │                                     │<─────────────────────────────────│
       │                                     │                                  │
       │                                     │ 6. Update (status: COMPLETED)    │
       │                                     │─┐                                │
       │                                     │ │                                │
       │                                     │<┘                                │
       │                                     │                                  │
       │                                     │                                  │ 7. Invalidate cache
       │                                     │                                  │─┐
       │                                     │                                  │ │
       │                                     │                                  │<┘
```

### Fluxo de Consulta de Saldo

```
┌──────────────┐                    ┌──────────────┐                  ┌────────────────┐
│   Cliente    │                    │  Customers   │                  │  Transactions  │
│              │                    │   Service    │                  │    Service     │
└──────┬───────┘                    └──────┬───────┘                  └────────┬───────┘
       │                                   │                                   │
       │  GET /api/users/:id/balance       │                                   │
       │──────────────────────────────────>│                                   │
       │                                   │                                   │
       │                                   │ 1. Check Redis cache              │
       │                                   │─┐                                 │
       │                                   │ │                                 │
       │                                   │<┘                                 │
       │                                   │                                   │
       │                                   │ 2. If miss, emit request          │
       │                                   │──────────────────────────────────>│
       │                                   │                                   │
       │                                   │                                   │ 3. Calculate totals
       │                                   │                                   │─┐
       │                                   │                                   │ │
       │                                   │                                   │<┘
       │                                   │                                   │
       │                                   │ 4. Response with totals           │
       │                                   │<──────────────────────────────────│
       │                                   │                                   │
       │                                   │ 5. Calculate balance              │
       │                                   │ 6. Save to Redis (TTL: 1min)      │
       │                                   │─┐                                 │
       │                                   │ │                                 │
       │                                   │<┘                                 │
       │                                   │                                   │
       │  200 OK { balance: 150000 }       │                                   │
       │<──────────────────────────────────│                                   │
```

---

## 🏃 Como Executar

### Pré-requisitos

- **Docker** 20+ e **Docker Compose** 2+
- **Node.js** 20+ (para desenvolvimento local)
- **Git**
- **HTTPie** ou **cURL** (para testar APIs)

### Início Rápido

#### 1. Clone o repositório
```bash
git clone https://github.com/pedrodecf/mserbank.git
cd mserbank
```

#### 2. Inicie todos os serviços
```bash
docker-compose --profile full up -d
```

Isso irá iniciar:
- ✅ PostgreSQL (customers) - porta 5432
- ✅ PostgreSQL (transactions) - porta 5433
- ✅ Redis - porta 6379
- ✅ RabbitMQ - porta 5672 (AMQP) e 15672 (Management)
- ✅ Customers Service - porta 3001
- ✅ Transactions Service - porta 3002
- ✅ Kong API Gateway - porta 8000

#### 3. Health checks
```bash
curl http://localhost:8000/api/health/customers
curl http://localhost:8000/api/health/transactions
```

#### 4. Acesse a documentação
- **Swagger Customers**: http://localhost:3001/api/docs
- **Swagger Transactions**: http://localhost:3002/api/docs
- **Kong Admin API**: http://localhost:8001/
- **RabbitMQ Management**: http://localhost:15672/ (user: `mserbank`, pass: `mserbank123`)

### Executando Localmente

Para desenvolvimento sem Docker:

#### Customers Service
```bash
cd services/customers

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
npm run prisma:migrate

# Seed do banco (opcional)
npm run prisma:seed

# Iniciar em modo dev
npm run start:dev
```

#### Transactions Service
```bash
cd services/transactions

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
npm run prisma:migrate

# Iniciar em modo dev
npm run start:dev
```

---

## 🧪 Testes

O projeto possui cobertura completa de testes para cada microsserviço:

```bash
# Testes Unitários (serviços, repositories isolados)
npm test

# Testes de Integração (com banco de dados)
npm run test:e2e
```
---

## 🔒 Segurança

- **Autenticação JWT**: HS256, expiração 1h
- **Hash de Senhas**: bcrypt com 10 salt rounds
- **Guards**: `JwtAuthGuard` (valida token) + `OwnershipGuard` (valida ownership)
- **Rate Limiting**: 100 req/min, 5000 req/hora (Kong)
- **Validação de Input**: Zod schemas em todos os endpoints
- **CORS**: Configurado no Kong

---

## 📊 Monitoramento e Logs

### Logging Estruturado (Pino)

Todos os logs são JSON estruturados:

```json
{
  "level": "info",
  "time": 1704931200000,
  "pid": 12345,
  "hostname": "mserbank-customers",
  "msg": "User registered successfully",
  "context": {
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

### Níveis de Log

| Nível | Uso |
|-------|-----|
| `error` | Erros críticos (exceções, falhas) |
| `warn` | Avisos (validação rejeitada, retry) |
| `info` | Informações (operações bem-sucedidas) |
| `debug` | Debug (desenvolvimento) |

### Visualizar Logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f customers
docker-compose logs -f transactions
docker-compose logs -f kong

# Últimas 100 linhas
docker-compose logs --tail=100 customers
```
---

## 📄 Licença

Este projeto está sob a licença **MIT**.
