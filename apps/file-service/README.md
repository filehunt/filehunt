# File Service

Service de gestion de fichiers et versioning Git pour l'architecture SaaS Filehunt.

## Fonctionnalités

- **Upload sécurisé** : Génération d'URLs pré-signées S3 avec chiffrement KMS
- **Versioning Git** : Intégration avec git-service pour le versioning des fichiers
- **Métadonnées** : Stockage PostgreSQL avec cache Redis
- **Traitement asynchrone** : Messages SQS pour le traitement en arrière-plan
- **Notifications** : Système de notifications via SQS

## Architecture

```
Client -> File Service -> S3 (upload)
                      -> Git Service (commit)
                      -> PostgreSQL (metadata)
                      -> Redis (cache)
                      -> SQS (processing/notifications)
```

## API Endpoints

### Health Checks
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /live` - Liveness check

### File Operations
- `POST /files/prepare` - Préparer un upload
- `POST /files/complete` - Compléter un upload
- `GET /files/:file_id` - Récupérer un fichier
- `DELETE /files/:file_id` - Supprimer un fichier
- `GET /files` - Lister les fichiers

### Statistics
- `GET /stats` - Statistiques des fichiers

## Configuration

Voir `.env.example` pour la configuration complète.

### Variables principales

```env
SERVER_PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
S3_BUCKET=filehunt-files
GIT_SERVICE_URL=http://localhost:3000
```

## Développement

### Prérequis
- Rust 1.75+
- PostgreSQL 16+
- Redis 7+
- LocalStack (pour AWS services)

### Installation

1. Copier la configuration :
```bash
cp .env.example .env
```

2. Démarrer les services :
```bash
docker-compose up postgres redis localstack aws-setup
```

3. Lancer le service :
```bash
cargo run
```

### Tests

```bash
cargo test
```

## Déploiement

### Docker

```bash
docker-compose up file-service
```

### Production

1. Configurer les variables d'environnement AWS réelles
2. Utiliser une base PostgreSQL managée
3. Utiliser Redis managé
4. Configurer les bonnes URLs des services

## Flux de données

### Upload de fichier

1. **Préparation** : `POST /files/prepare`
   - Validation du fichier
   - Génération URL pré-signée S3
   - Création métadonnées (status: uploading)

2. **Upload** : Client -> S3 directement

3. **Complétion** : `POST /files/complete`
   - Vérification fichier S3
   - Commit git-service
   - Mise à jour métadonnées (status: ready)
   - Messages SQS (processing + notification)

### Traitement asynchrone

- **file-processing-queue** : Traitement du fichier (preview, transcodage)
- **notifications-queue** : Notifications utilisateur

## Services utilisés

- **S3** : Stockage fichiers avec chiffrement KMS
- **SQS** : Files de traitement et notifications (FIFO)
- **KMS** : Chiffrement des fichiers
- **PostgreSQL** : Métadonnées des fichiers
- **Redis** : Cache des métadonnées et URLs pré-signées

## Sécurité

- Chiffrement KMS pour tous les fichiers S3
- Validation des types de fichiers
- Limitation de taille des fichiers
- URLs pré-signées avec expiration
- Isolation par utilisateur

## Monitoring

- Health checks pour tous les services
- Logs structurés avec tracing
- Métriques de performance
- Cache pour optimiser les performances