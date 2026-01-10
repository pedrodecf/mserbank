# MSERBank - Microsserviços Bancários

Sistema bancário baseado em microsserviços, desenvolvido como desafio técnico para demonstrar competências em arquitetura distribuída, comunicação assíncrona e boas práticas de desenvolvimento.

## 📋 Visão Geral

O projeto consiste em dois microsserviços independentes que se comunicam de forma assíncrona através de mensageria:

- **Customers Service**: Gerenciamento de clientes e dados bancários
- **Transactions Service**: Processamento de transferências financeiras

## 🛠️ Stack Tecnológica

| Categoria | Tecnologia |
|-----------|------------|
| Framework | NestJS |
| Linguagem | TypeScript |
| ORM | Prisma 6 |
| Validação | Zod |
| Banco de Dados | PostgreSQL |
| Cache | Redis |
| Mensageria | RabbitMQ |
| Documentação API | Swagger (OpenAPI) |
| Containerização | Docker + Docker Compose |
| Deploy | AWS EC2 |

## 🏗️ Arquitetura

### Estrutura do Monorepo

```
mserbank/
├── services/
│   ├── customers/                    # Microsserviço de Clientes
│   │   ├── src/
│   │   │   ├── common/
│   │   │   │   └── constants/        # Constantes (cache, etc)
│   │   │   ├── modules/
│   │   │   │   └── users/
│   │   │   │       ├── controllers/  # 1 arquivo por funcionalidade
│   │   │   │       ├── services/     # 1 arquivo por funcionalidade
│   │   │   │       ├── repositories/ # 1 arquivo por funcionalidade
│   │   │   │       ├── dto/          # Data Transfer Objects
│   │   │   │       └── schemas/      # Validações Zod
│   │   │   ├── infrastructure/
│   │   │   │   ├── database/         # Prisma client e config
│   │   │   │   ├── cache/            # Redis client
│   │   │   │   └── messaging/        # RabbitMQ producers/consumers
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── transactions/                 # Microsserviço de Transações
│       ├── src/
│       │   ├── modules/
│       │   │   └── transactions/
│       │   │       ├── controllers/
│       │   │       ├── services/
│       │   │       ├── dto/
│       │   │       └── schemas/
│       │   ├── infrastructure/
│       │   │   ├── database/
│       │   │   └── messaging/
│       │   ├── config/
│       │   └── main.ts
│       ├── prisma/
│       │   └── schema.prisma
│       ├── test/
│       ├── Dockerfile
│       └── package.json
│
├── docker-compose.yml                # Orquestração local
├── docs/                             # Documentação do projeto
│   ├── requirements/                 # Requisitos oficiais
│   └── issues/                       # Tasks do projeto
└── README.md
```

### Princípios Arquiteturais

- **Clean Architecture**: Separação clara entre camadas (controllers, services, infrastructure)
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Keep It Simple, Stupid
- **DRY**: Don't Repeat Yourself
- **YAGNI**: You Aren't Gonna Need It

## 🔄 Fluxo de Comunicação

```
┌─────────────────┐                    ┌──────────────────────────────────────────────┐
│                 │                    │              MSERBank System                 │
│     Client      │                    │                                              │
│   (Frontend)    │                    │  ┌────────────────┐    ┌─────────────────┐   │
│                 │                    │  │   Customers    │    │  Transactions   │   │
└────────┬────────┘                    │  │    Service     │    │    Service      │   │
         │                             │  │   :3001        │    │    :3002        │   │
         │ HTTP                        │  └───────┬────────┘    └────────┬────────┘   │
         │                             │          │                      │            │
         ▼                             │          │    ┌─────────────┐   │            │
┌─────────────────┐     HTTP           │          │    │             │   │            │
│   API Gateway   │◄──────────────────►│          └───►│  RabbitMQ   │◄──┘            │
│                 │                    │               │             │                │
└─────────────────┘                    │               └─────────────┘                │
                                       │                                              │
                                       │  ┌────────────────┐    ┌─────────────────┐   │
                                       │  │  PostgreSQL    │    │   PostgreSQL    │   │
                                       │  │  (customers)   │    │  (transactions) │   │
                                       │  └────────────────┘    └─────────────────┘   │
                                       │                                              │
                                       │  ┌────────────────┐                          │
                                       │  │     Redis      │                          │
                                       │  │    (cache)     │                          │
                                       │  └────────────────┘                          │
                                       │                                              │
                                       └──────────────────────────────────────────────┘
```

### Comunicação Síncrona (HTTP/REST)

Cada microsserviço expõe sua própria API REST:

| Serviço | Porta | Base URL |
|---------|-------|----------|
| Customers | 3001 | `/api/users` |
| Transactions | 3002 | `/api/transactions` |

### Comunicação Assíncrona (RabbitMQ)

Os microsserviços se comunicam através de eventos publicados no RabbitMQ:

| Evento | Produtor | Consumidor | Descrição |
|--------|----------|------------|-----------|
| `user.created` | Customers | Transactions | Notifica criação de novo usuário |
| `user.updated` | Customers | Transactions | Notifica atualização de dados do usuário |
| `transaction.completed` | Transactions | Customers | Notifica conclusão de transferência |
| `transaction.failed` | Transactions | Customers | Notifica falha em transferência |

> **Nota**: Os eventos acima são exemplos iniciais. A lista completa será documentada conforme a implementação avançar.

## 🗄️ Modelagem de Dados

### Customers Service

```prisma
model User {
  id             String    @id @default(uuid())
  name           String
  email          String    @unique
  address        String?
  profilePicture String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?                      // Soft delete

  bankingDetails BankingDetails?

  @@map("users")
}

model BankingDetails {
  id            String @id @default(uuid())
  agency        String
  accountNumber String @unique

  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("banking_details")
}
```

### Transactions Service

```prisma
model Transaction {
  id             String            @id @default(uuid())
  senderUserId   String
  receiverUserId String
  amount         Decimal           @db.Decimal(15, 2)
  description    String?
  status         TransactionStatus @default(PENDING)
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}

enum TransactionStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm

### Desenvolvimento Local

```bash
# Clonar o repositório
git clone https://github.com/pedrodecf/mserbank.git
cd mserbank

# Subir infraestrutura (PostgreSQL, Redis, RabbitMQ)
docker-compose up -d

# Instalar dependências e rodar cada serviço
cd services/customers
npm install
npm run start:dev

# Em outro terminal
cd services/transactions
npm install
npm run start:dev
```

### Usando Docker Compose (Completo)

```bash
docker-compose --profile full up -d
```

## 📚 Documentação da API

Após iniciar os serviços, a documentação Swagger estará disponível em:

- **Customers Service**: http://localhost:3001/docs
- **Transactions Service**: http://localhost:3002/docs

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Cobertura
npm run test:cov
```
