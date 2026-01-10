# Arquitetura e Diretrizes Técnicas

## Template dos Microsserviços
- Separação clara entre:
  - Controllers
  - Services
  - Models
  - Config
  - Tests

## Boas Práticas
- SOLID
- KISS
- DRY
- Clean Code
- ESLint

## Comunicação entre Microsserviços
- Broker de Mensageria (RabbitMQ)
- Comunicação assíncrona
- Desacoplamento entre serviços

## Microsserviços Abstratos
- Criar contratos/interfaces para serviços hipotéticos
- Não implementar lógica real