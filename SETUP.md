# Filehunt Setup

## Docker Compose

Le projet utilise maintenant un `docker-compose.yml` centralisé à la racine du projet qui gère l'infrastructure commune pour tous les services.

### Services disponibles

- **LocalStack** : Émule les services AWS (S3) en local
- **S3 Setup** : Configure automatiquement les buckets S3 nécessaires

### Démarrage

```bash
# Démarrer l'infrastructure
docker-compose up -d

# Vérifier que les services sont prêts
docker-compose ps
```

### Buckets S3 créés automatiquement

- `filehunt-git-service` : Pour le service Git
- `filehunt-shared` : Pour les données partagées

## Architecture S3

### Shared-Rust Library

La logique S3 a été déplacée vers `packages/shared-rust` en tant que bibliothèque partagée :

- `src/s3/service.rs` : Service S3 avec toutes les opérations
- `src/s3/config.rs` : Configuration S3 flexible
- `src/s3/mod.rs` : Module exports

### Configuration par service

Chaque service configure son propre client S3 via les variables d'environnement :

```rust
// Dans git-service
let s3_config = shared_rust::s3::S3Config::from_env("git-service");
let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
```

### Variables d'environnement

- `{SERVICE}_S3_BUCKET` : Nom du bucket (ex: `GIT_SERVICE_S3_BUCKET`)
- `S3_REGION` : Région S3 (défaut: `us-east-1`)
- `S3_ENDPOINT` : Endpoint S3 (pour LocalStack: `http://localhost:4566`)
- `AWS_ACCESS_KEY_ID` : Clé d'accès (défaut: `test` pour LocalStack)
- `AWS_SECRET_ACCESS_KEY` : Clé secrète (défaut: `test` pour LocalStack)

## Avantages de cette architecture

1. **Centralisation** : Un seul docker-compose pour toute l'infrastructure
2. **Réutilisabilité** : La logique S3 est partagée entre tous les services
3. **Flexibilité** : Chaque service peut avoir sa propre configuration S3
4. **Évolutivité** : Facile d'ajouter de nouveaux services avec S3

## Développement

### Ajouter un nouveau service avec S3

1. Ajouter `shared-rust` comme dépendance dans `Cargo.toml`
2. Configurer S3 avec `S3Config::from_env("mon-service")`
3. Ajouter le bucket dans `docker-compose.yml` si nécessaire

### Tests locaux

```bash
# Démarrer LocalStack
docker-compose up -d localstack

# Vérifier la connectivité S3
aws --endpoint-url=http://localhost:4566 s3 ls
```