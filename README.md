# Sistema Pagamento SimplePay

A modular RESTful API built with Node.js, TypeScript, Express, Prisma ORM, MySQL, JWT Authentication, and Multer for dynamic image uploads.

---

## Features

- **Authentication**: JWT-based authentication and user registration with password hashing (bcrypt).
- **User Management**: User creation, update, retrieval, and deletion with role attributes (`CONSUMER` / `MERCHANT`) and optional avatar associations.
- **Post & Comment System**: Merchant post showcases, liking mechanism, and comment threads.
- **Image Module**: External file storage system (`UPLOAD_DIR`) decoupled from source code, saving image metadata in MySQL using Prisma.
- **Static File Serving**: Express static route (`/uploads`) for media retrieval across platforms.
- **Cascade Deletions**: Configured `onDelete: Cascade` in Prisma schema for cleanup of images associated with deleted users or posts.

---

## Project Architecture

The application follows a 4-layer backend architecture:

```text
sistema-pagamento-simplepay/
├── prisma/
│   └── schema.prisma         # Prisma schema & MySQL data model
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── merchant.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication middleware
│   │   └── error.middleware.ts   # Error handler middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── index.ts              # API v1 main router
│   │   └── merchant.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── merchant.service.ts
│   ├── app.ts                    # Express application entry
│   └── server.ts                 # Server startup
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Prerequisites & Installation

Para realizar um teste limpo garantindo que o banco de dados e a compilação do TypeScript estejam zerados, siga o passo a passo abaixo no seu terminal.

**1. Limpeza e Compilação Zero Bug**

Primeiro, apague a pasta de build antiga e valide se a compilação do TypeScript passa sem nenhum erro de tipo:

```bash
# Limpa a pasta dist
npx rimraf dist

# Compila o projeto TypeScript
npx tsc --noEmit

```

*Se o comando `npx tsc --noEmit` não retornar nenhuma mensagem de erro, o código está 100% tipado e pronto.*

---

**2. Reset do Banco de Dados (Prisma & MySQL)**

Para garantir dados zerados no MySQL e recriar as tabelas do zero com base no `schema.prisma`:

```bash
# Apaga o banco de dados de desenvolvimento e aplica a migration limpa
npx prisma migrate reset

```

---

**3. Iniciar o Servidor**

Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev

```

---

**4. Roteiro de Teste dos Endpoints (`/api/v1`)**

Você pode testar a API no **Postman**, **Insomnia** ou via **cURL** executando as chamadas na sequência abaixo:

* **Público — Cadastrar Merchant**
* `POST http://localhost:3000/api/v1/merchants/register` (ou `/api/v1/auth/register`)
* **Body (JSON):**
```json
{
  "name": "Empresa Teste",
  "email": "contato@empresa.com",
  "password": "senha123",
  "document": "12345678901"
}

```




* **Público — Autenticar e Obter Token JWT**
* `POST http://localhost:3000/api/v1/auth/login` (ou `/api/v1/merchants/login`)
* **Body (JSON):**
```json
{
  "email": "contato@empresa.com",
  "password": "senha123"
}

```


* *Copie o `token` retornado no JSON.*


* **Protegido — Consultar Perfil Autenticado**
* `GET http://localhost:3000/api/v1/auth/me`
* **Header:** `Authorization: Bearer <SEU_TOKEN_JWT>`


* **Protegido — Listar Todos os Merchants**
* `GET http://localhost:3000/api/v1/merchants`
* **Header:** `Authorization: Bearer <SEU_TOKEN_JWT>`


* **Protegido — Atualizar Cadastro**
* `PUT http://localhost:3000/api/v1/merchants/<ID_DO_MERCHANT>`
* **Header:** `Authorization: Bearer <SEU_TOKEN_JWT>`
* **Body (JSON):**
```json
{
  "name": "Empresa Teste Atualizada"
}

```




* **Protegido — Deletar Conta**
* `DELETE http://localhost:3000/api/v1/merchants/<ID_DO_MERCHANT>`
* **Header:** `Authorization: Bearer <SEU_TOKEN_JWT>`
```
