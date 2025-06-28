# 🚀 Turbo Configuration Setup

This document explains the Turbo monorepo setup and task configuration for Filehunt.

## 🔧 Problem Fixed

The error `Missing tasks in project - Could not find task 'test' in project` was occurring because:

1. **turbo.json** was missing task definitions for `test`, `lint`, and other common tasks
2. Some packages were missing required scripts in their `package.json` files
3. Task dependencies and outputs were not properly configured

## ✅ Solution Implemented

### 1. Updated turbo.json

Added comprehensive task definitions:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:watch": {
      "cache": false,
      "persistent": true
    },
    "test:e2e": {
      "dependsOn": ["build"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "format": {},
    "dev": {
      "persistent": true,
      "cache": false
    },
    "start": {
      "dependsOn": ["build"],
      "persistent": true,
      "cache": false
    }
  }
}
```

### 2. Added Missing Scripts

**Packages updated:**
- `packages/shared-ts/` - Added test, lint, build scripts
- `packages/ui/` - Added test, lint, build scripts  
- `apps/web/` - Added test script
- Root `package.json` - Added all turbo script aliases

**Scripts added for packages without proper test setup:**
```json
{
  "scripts": {
    "test": "echo \"No tests configured yet\"",
    "lint": "echo \"No linting configured yet\"",
    "build": "echo \"No build step needed\""
  }
}
```

### 3. Existing Working Scripts

**Rust packages** (already had proper scripts):
- `apps/file-service/`
- `apps/git-service/`
- `apps/desktop/`
- `workers/file-worker/`
- `workers/file-indexer/`
- `packages/shared-rust/`

**NestJS packages** (already had proper scripts):
- `apps/api-gateway/`
- `apps/search-service/`
- `apps/user-service/`
- `workers/notification-worker/`

## 🎯 Task Dependencies

**Dependency flow:**
```
build → test
build → lint
^build → current package build depends on dependencies' build
```

**Task types:**
- **Persistent**: `dev`, `start`, `test:watch` (long-running)
- **Cached**: `build`, `test`, `lint` (output can be cached)
- **No cache**: `dev`, `test:watch` (always run fresh)

## 📋 Available Commands

### Root Level
```bash
npm run dev          # Start all dev servers
npm run build        # Build all packages
npm run test         # Run all tests
npm run lint         # Lint all packages
npm run format       # Format all code
npm run start        # Start all production services
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run e2e tests
```

### With Turbo Filters
```bash
# Run tests for specific packages
npx turbo test --filter="api-gateway"
npx turbo test --filter="@filehunt/shared-*"

# Run dev for only services
npx turbo dev --filter="*-service"

# Build only Rust packages
npx turbo build --filter="file-*"
```

## 🧪 Test Coverage

**Current test setup:**
- ✅ **Jest tests**: NestJS packages (api-gateway, search-service, user-service, notification-worker)
- ✅ **Cargo tests**: Rust packages (all Rust services and workers)
- ⚠️ **Placeholder**: TypeScript shared packages (ready for test addition)
- ⚠️ **Next.js**: Web app (ready for test setup)

## 📊 Package Status

| Package | Test | Lint | Build | Status |
|---------|------|------|-------|--------|
| api-gateway | ✅ Jest | ✅ ESLint | ✅ NestJS | Ready |
| file-service | ✅ Cargo | ✅ Clippy | ✅ Cargo | Ready |
| git-service | ✅ Cargo | ✅ Clippy | ✅ Cargo | Ready |
| web | ⚠️ Placeholder | ✅ Next.js | ✅ Next.js | Ready |
| shared-ts | ⚠️ Placeholder | ⚠️ Placeholder | ⚠️ None needed | Ready |
| shared-rust | ✅ Cargo | ✅ Clippy | ✅ Cargo | Ready |

## 🔄 Adding Tests to Placeholder Packages

### For TypeScript packages (shared-ts, ui):
```bash
cd packages/shared-ts
npm install --save-dev jest @types/jest ts-jest

# Update package.json
{
  "scripts": {
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

### For Next.js web app:
```bash
cd apps/web
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Update package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## 🚀 Next Steps

1. **Add actual tests** to placeholder packages
2. **Configure proper linting** for shared packages
3. **Set up e2e test infrastructure**
4. **Add pre-commit hooks** for test/lint validation
5. **Configure CI/CD** to use turbo tasks

## 🔍 Troubleshooting

### Common issues:

**"No tests configured"** - Expected for packages with placeholder scripts
**"Missing task"** - Check turbo.json has the task defined
**"No outputs found"** - Normal for tasks that don't produce files
**Build dependencies** - Check `dependsOn` in turbo.json

### Verification:
```bash
# Check all tasks work
npx turbo test --dry-run
npx turbo lint --dry-run
npx turbo build --dry-run

# Test specific package
npx turbo test --filter="api-gateway"
```
