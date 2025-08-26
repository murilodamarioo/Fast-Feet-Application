# Fast-Feet Application 🚚✨
A modern delivery management system built with NestJS, Prisma, and a robust domain-driven design. This project streamlines courier, recipient, and order management for delivery businesses, featuring authentication, role-based access control, notifications, and more.

## 🛠️ **Features**

- 🛡️ Role-based Access Control (Admin, Courier)
- 🔒 JWT Authentication
- 📦 Order Creation & Status Tracking
- 👤 Courier & Recipient Management
- 📸 Photo Uploads for Orders
- 🔔 Real-time Notifications
- 🗄️ Prisma ORM with PostgreSQL
- 🧪 Comprehensive Unit & E2E Tests

## 💻 **Tech Stack**
- NestJS – Backend framework
- Prisma – ORM for PostgreSQL
- TypeScript – Type safety
- Jest/Vitest – Testing
- Docker – Local development
- Zod – Validation

---

## 🧪 **Tests**

### 1. **Unit Tests**
Runs all unit tests located in `src/domain` directory.
```bash
npm run test
```

### 2. **E2E Tests**
Runs the tests for integration/HTTP files located in the `src/infra/http` directory, typically used for testing client-server communication.
```bash
npm run test:e2e
```