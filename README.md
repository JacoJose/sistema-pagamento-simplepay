# Social Network & Image Module REST API

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
projeto-01-rede-social/
├── prisma/
│   └── schema.prisma         # Prisma schema & MySQL data model
├── src/
│   ├── config/
│   │   └── upload.config.ts  # Dynamic file storage configuration
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── image.controller.ts
│   │   ├── post.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication middleware
│   │   ├── error.middleware.ts   # Error handler middleware
│   │   └── upload.middleware.ts  # Multer storage & file filter middleware
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── comment.routes.ts
│   │   ├── index.ts              # API v1 main router
│   │   ├── post.routes.ts
│   │   ├── upload.routes.ts
│   │   └── user.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── comment.service.ts
│   │   ├── image.service.ts
│   │   ├── post.service.ts
│   │   └── user.service.ts
│   ├── app.ts                    # Express application entry
│   └── server.ts                 # Server startup
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Prerequisites & Installation

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/projeto-01-rede-social.git
cd projeto-01-rede-social
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Application
PORT=3000
NODE_ENV=development
UPLOAD_DIR="C:/Users/wnn-dev/Pictures/uploads"

# Database
DATABASE_URL="mysql://root:123456@localhost:3306/db_rede_social"

# Security
JWT_SECRET="TECINFO_2026_BPW"
```

---

## Database Migrations

Run Prisma migrations to create database tables and generate Prisma Client:

```bash
# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

---

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build & Start
```bash
npm run build
npm start
```

The server runs at `http://localhost:3000`. Uploaded static files are accessible via `http://localhost:3000/uploads/<filename>`.

---

## API Endpoints Reference

Base Route: `/api/v1`

| Method | Endpoint | Protection | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Public | Register a new user account |
| `POST` | `/api/v1/auth/login` | Public | Login and receive JWT access token |
| `GET` | `/api/v1/users` | Bearer Token | List all users |
| `GET` | `/api/v1/users/:id` | Bearer Token | Get user details by ID |
| `POST` | `/api/v1/users` | Public / Admin | Create user account |
| `PUT` | `/api/v1/users/:id` | Bearer Token | Update user info or set avatar `imageId` |
| `DELETE` | `/api/v1/users/:id` | Bearer Token | Delete user account |
| `POST` | `/api/v1/posts` | Bearer Token | Create a new post (Merchants only) |
| `GET` | `/api/v1/posts` | Bearer Token | List all posts |
| `GET` | `/api/v1/posts/:id` | Bearer Token | Get single post details |
| `POST` | `/api/v1/posts/:id/like` | Bearer Token | Like a post |
| `POST` | `/api/v1/comments` | Bearer Token | Add a comment to a post |
| `GET` | `/api/v1/comments/post/:postId` | Bearer Token | List comments for a post |
| `POST` | `/api/v1/upload` | Bearer Token | Upload single image (`multipart/form-data`) |
| `GET` | `/api/v1/upload` | Bearer Token | List all uploaded images metadata |
| `GET` | `/api/v1/upload/:id` | Bearer Token | Get image metadata by ID |
| `DELETE` | `/api/v1/upload/:id` | Bearer Token | Delete image metadata & reference |

---

## Sample Usage Examples

### 1. Upload an Image (`POST /api/v1/upload`)
- **Header**: `Authorization: Bearer <your_jwt_token>`
- **Body**: `multipart/form-data` with field `image`
- **Response (`201 Created`)**:
```json
{
  "message": "Image uploaded and metadata saved successfully.",
  "image": {
    "id": "a4d3f2e1-89ab-4cde-8012-3456789abcde",
    "filename": "1773488000000-a1b2c3d4e5f67890.png",
    "mimetype": "image/png",
    "url": "http://localhost:3000/uploads/1773488000000-a1b2c3d4e5f67890.png",
    "createdAt": "2026-09-14T08:30:00.000Z",
    "userId": null,
    "postId": null
  }
}
```

### 2. Register User (`POST /api/v1/auth/register`)
- **Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "zipCode": "12345678",
  "role": "MERCHANT"
}
```

### 3. Create Post (`POST /api/v1/posts`)
- **Header**: `Authorization: Bearer <your_jwt_token>`
- **Body**:
```json
{
  "title": "Summer Showcase",
  "description": "Check out our newest products available this season!",
  "imageUrl": "http://localhost:3000/uploads/1773488000000-a1b2c3d4e5f67890.png",
  "imageId": "a4d3f2e1-89ab-4cde-8012-3456789abcde"
}
```
