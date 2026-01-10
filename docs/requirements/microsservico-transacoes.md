# Microsserviço de Transações

## Banco de Dados
- Relacional (PostgreSQL recomendado)

## Endpoints Mínimos

### POST /api/transactions
Inicia uma nova transferência.

**Parâmetros**
- senderUserId
- receiverUserId
- amount
- description

**Resposta**
- Status da transferência

---

### GET /api/transactions/{transactionId}
Retorna detalhes de uma transferência específica.

---

### GET /api/transactions/user/{userId}
Lista transferências de um usuário.

---

## Considerações
- Implementar autenticação e autorização
- Endpoints mínimos são apenas referência
- Endpoints adicionais são encorajados
