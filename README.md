# Sistema de Controle de Finanças - PGlite

Sistema simples com módulos de Contas, Pagar, Receber e Histórico.

## Como rodar

1. Instale as dependências:

```bash
npm run install:all
```

2. Rode o sistema:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Observação

O banco local fica em `backend/data/financas` usando PGlite.
Depois é possível migrar para PostgreSQL trocando a camada `backend/src/database/db.js`.
