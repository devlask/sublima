
# Sublima ERP

Sistema ERP completo com frontend em React + Tailwind e backend em Node.js + MongoDB.

## 📦 Estrutura
- frontend/: Aplicação React com TailwindCSS
- backend/: API Node.js com Express e MongoDB

## ▶️ Como Rodar Localmente

### 1. Requisitos:
- Node.js
- MongoDB local (use MongoDB Compass ou instale via Docker)
- XAMPP (opcional, apenas para servir outras páginas PHP se quiser)

### 2. Instalar dependências

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Iniciar servidor backend

```bash
cd backend
npm run dev
```

### 4. Iniciar o frontend React

```bash
cd frontend
npm start
```

### 5. Acesso
- Frontend: `http://localhost:3000`
- API Backend: `http://localhost:5000`

Usuário padrão:
- Email: admin@sublima.com
- Senha: 123456

---

## 📁 Estrutura de banco de dados

Banco MongoDB local com as collections:
- users
- pedidos
- orcamentos
- producoes
- tarefas
