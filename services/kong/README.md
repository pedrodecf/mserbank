# Kong API Gateway - MSERBank

Este diretório contém a configuração do Kong API Gateway para o MSERBank.

## Estrutura

```
kong/
├── Dockerfile          # Imagem Docker do Kong com configuração
├── kong.yml           # Configuração declarativa do Kong
└── README.md          # Esta documentação
```

## Arquitetura

O Kong atua como ponto de entrada único para todos os microsserviços:

```
                    ┌─────────────────────────────────────────┐
                    │              Kong Gateway               │
                    │         (porta 8000 - HTTP)             │
                    │         (porta 8443 - HTTPS)            │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
           ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
           │   Customers   │ │ Transactions  │ │    Health     │
           │    Service    │ │    Service    │ │    Checks     │
           │  (porta 3001) │ │  (porta 3002) │ │               │
           └───────────────┘ └───────────────┘ └───────────────┘
```

## Rotas Configuradas

### Rotas Públicas (sem autenticação)

| Método | Caminho                | Serviço     | Descrição              |
|--------|------------------------|-------------|------------------------|
| POST   | /api/users/login       | customers   | Login de usuário       |
| POST   | /api/users/register    | customers   | Registro de usuário    |
| GET    | /health/customers      | customers   | Health check customers |
| GET    | /health/transactions   | transactions| Health check trans.    |

### Rotas Protegidas (requerem JWT)

| Método | Caminho                              | Serviço      | Descrição                    |
|--------|--------------------------------------|--------------|------------------------------|
| GET    | /api/users/:userId                   | customers    | Obter usuário por ID         |
| PATCH  | /api/users/:userId                   | customers    | Atualizar usuário            |
| PATCH  | /api/users/:userId/profile-picture   | customers    | Atualizar foto de perfil     |
| GET    | /api/users/:userId/balance           | customers    | Obter saldo do usuário       |
| POST   | /api/transactions                    | transactions | Criar transação              |
| GET    | /api/transactions/:transactionId     | transactions | Obter transação por ID       |
| GET    | /api/transactions/user/:userId       | transactions | Listar transações do usuário |

## Plugins Configurados

### Globais
- **CORS**: Permite requisições cross-origin
- **Rate Limiting**: 100 req/min, 5000 req/hora
- **Request Size Limiting**: Máximo 10MB por request
- **Correlation ID**: Adiciona header de correlação para rastreamento
- **File Log**: Logs no stdout

## Portas

| Porta | Protocolo | Descrição                    |
|-------|-----------|------------------------------|
| 8000  | HTTP      | Proxy principal              |
| 8443  | HTTPS     | Proxy seguro (SSL)           |
| 8001  | HTTP      | Admin API                    |
| 8444  | HTTPS     | Admin API seguro (SSL)       |

## Comandos Úteis

### Subir o Kong (modo full)
```bash
docker-compose --profile full up -d kong
```

### Ver logs do Kong
```bash
docker logs -f mserbank-kong
```

### Verificar configuração do Kong
```bash
curl http://localhost:8001/
```

### Listar serviços configurados
```bash
curl http://localhost:8001/services
```

### Listar rotas configuradas
```bash
curl http://localhost:8001/routes
```

### Listar plugins ativos
```bash
curl http://localhost:8001/plugins
```

### Recarregar configuração (DB-less mode)
```bash
docker exec mserbank-kong kong reload
```

## Testando as Rotas

### Health Check
```bash
curl http://localhost:8000/health/customers
curl http://localhost:8000/health/transactions
```

### Registro de Usuário
```bash
curl -X POST http://localhost:8000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "cpf": "12345678901",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Acessar Rota Protegida
```bash
curl http://localhost:8000/api/users/{userId} \
  -H "Authorization: Bearer {jwt_token}"
```

## Modo de Operação

O Kong está configurado em **DB-less mode** (declarativo), o que significa:

- ✅ Configuração via arquivo YAML
- ✅ Imutável e versionável (Git)
- ✅ Mais simples para deploy
- ✅ Menor consumo de recursos
- ❌ Não suporta Admin API para alterações em runtime

Para ambientes que precisam de configuração dinâmica, descomente a seção de banco de dados no `docker-compose.yml`.

## Troubleshooting

### Kong não inicia
1. Verifique se os serviços upstream estão rodando
2. Verifique os logs: `docker logs mserbank-kong`
3. Valide a configuração: `docker exec mserbank-kong kong config parse /kong/declarative/kong.yml`

### Erro 502 Bad Gateway
1. Verifique se o serviço de destino está acessível
2. Verifique a rede Docker: `docker network inspect mserbank_mserbank-network`

### Erro 503 Service Unavailable
1. Health checks podem estar falhando
2. Verifique upstreams: `curl http://localhost:8001/upstreams`
