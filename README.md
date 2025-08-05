# 🍽️ Swift Meal API

Swift Meal API is a backend service for managing fast food orders, built with [NestJS](https://nestjs.com/).
It powers the backend of a digital restaurant system — managing menu items, orders, payments, and external integrations.

The architecture follows **Domain-Driven Design (DDD)** and **Clean Architecture**, enabling scalability, testability, and clear separation of concerns.
It also integrates with **Mercado Pago** to generate and track PIX payments through webhooks.

## 🧰 Tech Stack

- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Framework:** [NestJS](https://nestjs.com/)
- **Architecture:** Clean Architecture + DDD
- **Database:** [Postgres](https://www.postgresql.org)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Payment Gateway:** [Mercado Pago](https://www.mercadopago.com.br/developers/en/docs) - PIX
- **Documentation:** Swagger
- **Code Quality:** [Biome](https://biomejs.dev/) for linting and formatting

## 🧠 Key Concepts & Architecture

- **Domain-Driven Design (DDD):** Use cases, entities, and repositories modeled explicitly in the domain layer.
- **Clean Architecture:** Structured in layers — `domain`, `application`, `infra`, `presentation`.
- **SOLID Principles:** Applied consistently across use cases, services, and abstractions.
- **Event-Driven Design:** Internal domain events and external gateway events (e.g. payment status) decouple business logic.
- **External Integration via Ports & Adapters:** Ex: Mercado Pago gateway for PIX payment generation and status updates.
- **Testability First:** Each layer is testable in isolation with mocks and in-memory implementations.

## 🚀 Getting Started

You can run Swift Meal API using either **Docker** (recommended) or your **local environment**.

### ▶️ Option 1: Run with Docker (Recommended)

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed.

```bash
# Start the services (API + PostgreSQL)
docker-compose up -d --build
```

> The API will be available at `http://localhost:3333`
> Swagger docs at `http://localhost:3333/docs`

### 💻 Option 2: Run Locally

#### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL running locally

#### Installation

```bash
npm install
```

#### Environment Setup

Copy and configure the `.env` file:

```bash
cp .env.example .env
```

Update the database connection string if needed.

#### Database Setup

```bash
npx prisma generate
npx prisma migrate dev
```

#### Run the App

```bash
npm run start:dev
```

> Access the docs at `http://localhost:3333/docs`
