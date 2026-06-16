# task-manager-api

A RESTful API for managing tasks and users, built with NestJS and PostgreSQL. Features JWT authentication, role-based access control, integration testing, and CI/CD with GitHub Actions.

---

## Stack

- **Runtime:** Node.js v24+
- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL (TypeORM)
- **Auth:** JWT + bcrypt + Passport
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger / OpenAPI
- **Testing:** Jest + supertest (e2e)
- **CI/CD:** GitHub Actions
- **Infra:** Docker + Docker Compose

---

## Getting Started

### Prerequisites

- Node.js v24+
- Docker and Docker Compose

### Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/vinicius42/task-manager-api.git
cd task-manager-api
npm install
```

2. Copy the example env file and fill in the values:

```bash
cp .env.example .env
```

3. Start PostgreSQL and Adminer:

```bash
docker compose up -d
```

4. Start the application:

```bash
npm run start:dev
```

5. Access the Swagger docs at `http://localhost:3000/api`

---

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=taskdb
JWT_SECRET=your_secret_here
```

---

## Endpoints

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/login | ❌ | Authenticate and receive JWT token |

### Users
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /users | ✅ | List all users |
| GET | /users/:id | ✅ | Get user by id |
| POST | /users | ❌ | Create user |
| PUT | /users/:id | ✅ | Update user |
| DELETE | /users/:id | ✅ | Delete user |

### Tasks
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /tasks | ✅ | List all tasks |
| GET | /tasks/:id | ✅ | Get task by id |
| POST | /tasks | ✅ | Create task |
| PUT | /tasks/:id | ✅ | Update task |
| DELETE | /tasks/:id | ✅ | Delete task |

---

## Testing

Integration tests run against an isolated PostgreSQL instance on a separate port, fully torn down and seeded between suites.

```bash
npm run test:e2e
```

Covers, among other scenarios: user creation and validation, login with valid/invalid credentials, and a concurrency test that fires two simultaneous signup requests with the same email to confirm the database-level unique constraint correctly rejects the race condition with a 409 Conflict.

---

## Key Concepts Applied

- **NestJS architecture** — modules, controllers, services, dependency injection
- **TypeORM** — entities, repositories, relations, UUID primary keys
- **Authentication** — JWT with PassportStrategy, route protection with Guards, bcrypt password hashing
- **Validation** — DTOs with class-validator, global ValidationPipe with whitelist and transform
- **Error handling** — NestJS exceptions (NotFoundException, ConflictException, UnauthorizedException) instead of a custom Result pattern, with unknown errors delegated to the global exception filter
- **Data integrity** — unique constraint on email at the database level, combined with an application-level pre-check for fast feedback
- **Testing** — integration tests with Jest and supertest, isolated test database, concurrency/race-condition testing with Promise.all
- **CI/CD** — automated test runs via GitHub Actions with a dedicated PostgreSQL service container
- **API documentation** — Swagger with bearer auth support for protected routes