# Git Service - Deployment Guide

## Project Summary

Le git-service est un microservice Rust développé avec Axum qui fournit des fonctionnalités de versioning de fichiers dans un style Git simplifié pour la plateforme SaaS FileHunt. Il utilise S3 comme stockage principal pour les fichiers et métadonnées, sans dépendance de base de données.

### Fonctionnalités Implémentées

- ✅ Gestion de repositories par utilisateur
- ✅ Création de commits avec métadonnées
- ✅ Historique des commits avec pagination
- ✅ Stockage versionné dans S3 (LocalStack compatible)
- ✅ API REST complète avec gestion d'erreurs
- ✅ Health checks pour monitoring
- ✅ Tests unitaires et script de test d'intégration
- ✅ Documentation technique complète

### Points d'Intégration TODO

- `// TODO: call file-service here` - Intégration avec le service de fichiers
- Authentification/autorisation (actuellement trust inter-service)
- Métriques et observabilité avancée

## Architecture Déployée

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Gateway   │────│   Git Service    │────│   S3 Storage    │
│                 │    │   (Port 3000)    │    │   (LocalStack)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   File Service   │
                       │     (TODO)       │
                       └──────────────────┘
```

## Prérequis de Déploiement

### Environnement de Développement
- Rust 1.70+
- Docker & Docker Compose
- AWS CLI (pour LocalStack)
- Make (optionnel)

### Environnement de Production
- Kubernetes ou Docker Swarm
- AWS S3 ou stockage S3-compatible
- Load balancer avec health checks
- Monitoring stack (Prometheus/Grafana)

## Configuration

### Variables d'Environnement

```bash
# Obligatoires
SERVER_PORT=3000
S3_BUCKET=git-service-bucket
S3_REGION=us-east-1

# S3 Configuration
S3_ENDPOINT=http://localhost:4566  # LocalStack uniquement
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Optionnelles
LOG_LEVEL=info
```

### Fichier .env
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

## Déploiement Local (Développement)

### Méthode 1: Make (Recommandée)
```bash
# Setup complet
make setup

# Démarrer LocalStack + Service
make dev

# Tests d'intégration
make test-api
```

### Méthode 2: Manuel
```bash
# 1. Démarrer LocalStack
docker-compose -f docker-compose.dev.yml up -d

# 2. Initialiser S3
./scripts/init-localstack.sh

# 3. Démarrer le service
cargo run

# 4. Tester
./test_api.sh
```

## Déploiement Production

### Option 1: Docker Container

```dockerfile
# Dockerfile (à créer)
FROM rust:1.70-slim as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/git-service /usr/local/bin/git-service
EXPOSE 3000
CMD ["git-service"]
```

```bash
# Build et déploiement
docker build -t git-service:latest .
docker run -d --name git-service \
  -p 3000:3000 \
  -e S3_BUCKET=prod-git-service \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  git-service:latest
```

### Option 2: Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: git-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: git-service
  template:
    metadata:
      labels:
        app: git-service
    spec:
      containers:
      - name: git-service
        image: git-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: SERVER_PORT
          value: "3000"
        - name: S3_BUCKET
          value: "prod-git-service"
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: access-key-id
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: secret-access-key
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: git-service
spec:
  selector:
    app: git-service
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## Monitoring et Observabilité

### Health Checks
- `GET /health` - Status détaillé du service
- `GET /ready` - Readiness pour load balancer

### Logs
- Format JSON structuré via tracing
- Niveaux configurables via LOG_LEVEL
- Logs de requêtes HTTP automatiques

### Métriques (À implémenter)
```rust
// TODO: Ajouter des métriques Prometheus
// - Nombre de repositories
// - Commits par minute
// - Latence des requêtes S3
// - Taille du stockage utilisée
```

## Sécurité

### Configurations Actuelles
- Validation d'entrée basique
- Gestion d'erreurs sans exposition d'informations sensibles
- CORS configuré pour développement

### À Implémenter
- Authentification JWT/API Key
- Autorisation par repository
- Rate limiting
- Audit logging
- Chiffrement des métadonnées sensibles

## Backup et Disaster Recovery

### Stratégie S3
- Versioning activé sur le bucket
- Cross-region replication (production)
- Lifecycle policies pour archivage

### Procédure de Restauration
1. Restaurer le bucket S3 depuis backup
2. Redéployer le service
3. Vérifier la cohérence des données
4. Tests de fumée avec test_api.sh

## Performance et Scalabilité

### Optimisations Actuelles
- Architecture stateless
- Pagination native
- Connexions S3 poolées
- Processing async avec Tokio

### Scaling Horizontal
- Ajout d'instances sans coordination
- Load balancing standard HTTP
- Pas de session sticky nécessaire

## Troubleshooting

### Problèmes Courants

**Service ne démarre pas**
```bash
# Vérifier la configuration
cargo check
# Vérifier S3 connectivity
aws s3 ls --endpoint-url=$S3_ENDPOINT
```

**Erreurs S3**
```bash
# LocalStack
docker logs git-service-localstack
# Production
aws s3api head-bucket --bucket $S3_BUCKET
```

**Tests d'intégration échouent**
```bash
# Vérifier que le service tourne
curl http://localhost:3000/health
# Relancer les tests
make test-api
```

### Logs de Debug
```bash
LOG_LEVEL=debug cargo run
```

## Maintenance

### Mise à Jour
1. Tests unitaires: `cargo test`
2. Tests d'intégration: `make test-api`
3. Build de production: `cargo build --release`
4. Déploiement blue-green recommandé

### Monitoring de Production
- Surveiller les métriques /health
- Alertes sur erreurs 5xx
- Monitoring de la latence S3
- Surveillance de l'utilisation du stockage

## Développement Futur

### Roadmap Technique
1. **Phase 2**: Intégration file-service complète
2. **Phase 3**: Fonctionnalités Git avancées (branch, merge)
3. **Phase 4**: Optimisations performance (cache Redis)
4. **Phase 5**: Interface Web pour administration

### Métriques de Succès
- Latence < 100ms pour les opérations de lecture
- Disponibilité > 99.9%
- Temps de récupération < 5 minutes
- Zero data loss sur incidents