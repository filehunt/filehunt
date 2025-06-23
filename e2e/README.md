# End-to-End Testing

Ce dossier contient les collections de tests end-to-end pour les microservices de FileHunt.

## Git Service - Collections API

### Formats Disponibles

Ce dossier contient **3 formats de collections** pour s'adapter à différents outils :

1. **`git_service.json`** - Format HTTPie Desktop/Core
2. **`git_service_core.json`** - Format HTTPie Core alternatif  
3. **`git_service_postman.json`** - Format Postman/Insomnia

### Prérequis

1. **HTTPie Desktop**, **HTTPie CLI**, **Postman** ou **Insomnia**
2. **Git Service** démarré sur `http://localhost:3000`
3. **LocalStack** configuré et opérationnel

### Installation Outils

```bash
# HTTPie CLI
pip install httpie

# HTTPie Desktop
# Télécharger depuis https://httpie.io/desktop

# Postman Desktop
# Télécharger depuis https://www.postman.com/

# Insomnia
# Télécharger depuis https://insomnia.rest/
```

### Utilisation des Collections

#### Option 1: HTTPie Desktop

1. Ouvrir HTTPie Desktop
2. Aller dans **File > Import**
3. Sélectionner `git_service.json` ou `git_service_core.json`
4. La collection sera importée avec tous les endpoints

#### Option 2: Postman

1. Ouvrir Postman
2. Cliquer sur **Import**
3. Sélectionner `git_service_postman.json`
4. Configurer les variables d'environnement

#### Option 3: Insomnia

1. Ouvrir Insomnia
2. Aller dans **Application > Preferences > Data > Import Data**
3. Sélectionner `git_service_postman.json` (compatible)

#### Méthode 2: HTTPie CLI

```bash
# Exemple d'utilisation des endpoints
cd filehunt/e2e

# Health check
http GET localhost:3000/health

# Créer un repository
http POST localhost:3000/repositories \
  name="test-repo" \
  owner="testuser" \
  description="Test repository"

# Créer un commit
http POST localhost:3000/repositories/testuser_test-repo/commits \
  message="Initial commit" \
  author="test@example.com" \
  file_path="/config/app.yaml" \
  repository_id="testuser_test-repo"

# Lister les commits
http GET localhost:3000/repositories/testuser_test-repo/commits
```

### Structure de la Collection

La collection `git_service.json` contient :

#### 🔍 **Health Checks**
- `health_check` - Statut du service
- `readiness_check` - Readiness probe

#### 📁 **Repository Management**
- `create_repository` - Créer un repository
- `list_repositories` - Lister tous les repositories
- `get_repository` - Détails d'un repository

#### 📝 **Commit Operations**
- `create_commit` - Créer un commit
- `create_second_commit` - Deuxième commit pour tester l'historique
- `list_commits` - Lister les commits
- `list_commits_paginated` - Pagination des commits
- `get_commit` - Détails d'un commit
- `get_commit_details` - Détails complets avec métadonnées
- `get_commit_file` - Télécharger le fichier

#### 🚫 **Error Handling**
- `error_nonexistent_repo` - Repository inexistant
- `error_nonexistent_commit` - Commit inexistant
- `create_invalid_repo` - Données invalides

#### 🏭 **Production Scenarios**
- `create_production_repo` - Repository de production
- `create_hotfix_commit` - Commit de correction urgente

### Scénarios de Test

#### 1. **Complete Workflow**
Workflow complet de A à Z :
1. Health checks
2. Création repository
3. Création commits
4. Listing et pagination

#### 2. **Error Handling**
Tests de gestion d'erreurs :
1. Repository inexistant (404)
2. Commit inexistant (404)
3. Données invalides (400)

#### 3. **Production Simulation**
Simulation environnement de production :
1. Repository production
2. Commit hotfix
3. Vérification état

### Variables d'Environnement

```json
{
  "base_url": "http://localhost:3000",
  "test_repo_id": "testuser_test-repo",
  "prod_repo_id": "devops_production-app"
}
```

### Notes Importantes

⚠️ **Avant de commencer :**
- Démarrer le git-service : `cd apps/git-service && make dev`
- Vérifier LocalStack : `docker ps | grep localstack`

📋 **Ordre d'exécution recommandé :**
1. Health checks en premier
2. Créer repository avant les commits
3. Remplacer `COMMIT_ID_HERE` par les vrais IDs

🔧 **Personnalisation :**
- Modifier `base_url` si le service tourne sur un autre port
- Adapter les données de test selon vos besoins
- Ajouter vos propres scenarios

### Automatisation

Pour automatiser les tests :

```bash
# Script de test automatique
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "🔍 Health Check..."
http GET $BASE_URL/health

echo "📁 Creating Repository..."
REPO_RESPONSE=$(http POST $BASE_URL/repositories \
  name="auto-test" \
  owner="automation" \
  description="Automated test repository")

echo "📝 Creating Commit..."
COMMIT_RESPONSE=$(http POST $BASE_URL/repositories/automation_auto-test/commits \
  message="Automated commit" \
  author="automation@test.com" \
  file_path="/test/auto.txt" \
  repository_id="automation_auto-test")

echo "✅ Tests completed!"
```

### Résolution des Problèmes

#### Service non disponible
```bash
# Vérifier que le service tourne
curl http://localhost:3000/health

# Redémarrer si nécessaire
cd apps/git-service && make dev
```

#### Erreurs S3/LocalStack
```bash
# Vérifier LocalStack
docker logs git-service-localstack

# Recréer le bucket
./apps/git-service/scripts/init-localstack.sh
```

#### Commit IDs manquants
1. Exécuter d'abord `create_commit`
2. Copier l'ID retourné
3. Remplacer `COMMIT_ID_HERE` dans les autres requêtes

Cette collection vous permet de tester complètement l'API git-service de manière interactive et reproductible ! 🚀