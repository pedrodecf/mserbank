# Microsserviço de Clientes

## Banco de Dados
- PostgreSQL (relacional)
- Redis para cache de dados pouco mutáveis

## Endpoints Mínimos

### GET /api/users/{userId}
Retorna dados do cliente, incluindo dados bancários.

---

### PATCH /api/users/{userId}
Atualização parcial dos dados do cliente.

**Campos possíveis**
- name
- email
- address
- bankingDetails

---

### PATCH /api/users/{userId}/profile-picture
Atualiza a foto de perfil do usuário.

---

## Dados Bancários
Os dados bancários devem estar dentro de:
```json
bankingDetails: {
  agency,
  accountNumber
}
