# 📁 Filehub

**Filehub** is a decentralized, Git-backed file collaboration platform designed for non-technical users (creatives, designers, business teams).
It eliminates folder trees, embraces version timelines, and enables structured file sharing, comments, and reviews — all without exposing Git internals.

---

## ✨ Features

- 🔄 Git-based versioning & decentralized sync (hidden from users)
- ⬆️ File upload with timeline version navigation
- 💬 Comment & review support per file/version
- 📤 Share files via link or internal access
- 🔍 Fast search across content & metadata
- ☁️ Cloud-native architecture (object storage, relational DB, event queue)

---

## 🧠 Core Concepts

- **No folder tree**: Files live in global flat search/index
- **Files = Timelines**: Each file has versions, diffs, comments
- **Decentralized Git**: Each user pushes/pulls silently (via API)
- **Transparent backend**: Git, object storage, SQL used behind the scenes

---

## 🧱 Tech Stack Overview

| Layer           | Technology Type                  |
| --------------- | -------------------------------- |
| Frontend        | Component-based web UI           |
| API Gateway     | Modular backend framework        |
| Git Engine      | Native Git CLI integration       |
| File Upload     | HTTP service with presigned URLs |
| Metadata DB     | Relational SQL database          |
| Search Engine   | Indexing + text search engine    |
| Async Messaging | Pub/Sub and Queuing system       |
| File Workers    | Asynchronous processors          |
| Notifications   | Email and push system            |
| Infrastructure  | Container-based orchestration    |
| CI/CD           | Automated pipelines              |

---

## 🧭 Architecture Overview

**Microservices:**

- `file-service`: presigned uploads, metadata updates, event publication
- `git-service`: Git bare repo management, version diff, push/pull
- `user-service`: user management, authentication, billing sync
- `search-service`: search proxy interface
- `api-gateway`: orchestrator and public API
- `notification-worker`: background emails & push dispatch

**Workers:**

- `file-worker`: preview generation, transcoding, object storage I/O
- `file-indexer`: search indexing

**Storage:**

- Object storage for media & Git repositories
- Relational database for metadata & users
- Search engine for full-text & metadata

**Messaging:**

- Cloud-native pub/sub and queue services for asynchronous workflows

---

## 🛠️ Development

### 🐳 Docker (Local Dev)

```bash
docker-compose up --build
```

Each service has its own `Dockerfile`. See `docker-compose.yml` for orchestration.

### 📦 Monorepo (Turborepo)

```bash
npx turbo run build
npx turbo run dev
```

Rust and TypeScript services are coordinated using a polyglot monorepo setup.

---

## 📁 Project Structure

```
filehub/
├── apps/
│   ├── web/                        # Next.js frontend
│   ├── api-gateway/                # NestJS orchestrateur
│   ├── file-service/               # Rust - file metadata, presigned S3
│   ├── git-service/                # Rust - Git backend
│   ├── user-service/               # NestJS - Prisma, auth, billing, migrations/
│   └── search-service/             # NestJS - OpenSearch
│
├── workers/
│   ├── file-worker/                # Rust - media processing
│   ├── file-indexer/               # Rust - OpenSearch indexing
│   └── notification-worker/        # NestJS - SES & Push (SQS triggered)
│
├── packages/
│   ├── shared-ts/                  # Shared TS libs (DTOs, S3 client, etc.)
│   ├── shared-rust/                # Shared Rust crate (types, config)
│   └── ui/                         # React design system
│
├── docker/                         # Docker setup
│   ├── docker-compose.yml
│   └── base/                       # Optional base images
│
├── iac/                            # Infra as Code (Terraform/CDK)
│   ├── services/                   # ECS task defs, queues, topics
│   ├── storage/                    # S3, RDS, OpenSearch
│   └── identity/                   # Cognito & permissions
│
├── scripts/                        # Helper scripts (build, clean, db)
│   ├── build-all.sh
│   ├── reset-db.sh
│   └── check-env.ts
│
├── config/                         # Static configs
│   └── openapi/                    # OpenAPI contracts
│
├── .env
├── .env.example
├── .github/                        # CI/CD workflows (GitHub Actions)
├── turborepo.json
├── package.json
├── tsconfig.json
├── Cargo.toml
└── README.md
```

---

## 📄 License

**AGPL-3.0**
This project is licensed under the GNU Affero General Public License v3.0.
You must share source code of modifications and network deployments.

See `LICENSE` file for full details.
