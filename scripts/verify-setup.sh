#!/bin/bash

# Script de vérification de l'environnement Filehunt
set -e

echo "🔍 Vérification de l'environnement Filehunt..."

# Vérifier Docker Compose
echo "📦 Vérification de Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Vérifier la configuration Docker Compose
echo "🐳 Validation de la configuration Docker Compose..."
docker-compose config --quiet
echo "✅ Configuration Docker Compose valide"

# Vérifier Rust et Cargo
echo "🦀 Vérification de Rust..."
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust/Cargo n'est pas installé"
    exit 1
fi

# Compiler shared-rust
echo "📚 Compilation de shared-rust..."
cd packages/shared-rust
cargo check --quiet
cd ../..
echo "✅ shared-rust compile correctement"

# Compiler git-service
echo "🔧 Compilation de git-service..."
cd apps/git-service
cargo check --quiet
cd ../..
echo "✅ git-service compile correctement"

# Démarrer l'infrastructure en arrière-plan
echo "🚀 Démarrage de l'infrastructure..."
docker-compose up -d --quiet-pull

# Attendre que LocalStack soit prêt
echo "⏳ Attente que LocalStack soit prêt..."
timeout=60
counter=0
while ! curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout: LocalStack n'est pas prêt après ${timeout}s"
        docker-compose logs localstack
        exit 1
    fi
    sleep 1
    counter=$((counter + 1))
done

# Vérifier que S3 fonctionne
echo "🪣 Vérification de S3..."
if ! docker run --rm --network filehunt_filehunt-network \
    -e AWS_ACCESS_KEY_ID=test \
    -e AWS_SECRET_ACCESS_KEY=test \
    amazon/aws-cli:2.13.25 \
    aws --endpoint-url=http://localstack:4566 s3 ls > /dev/null 2>&1; then
    echo "❌ Impossible de se connecter à S3"
    exit 1
fi

# Vérifier que les buckets existent
echo "📂 Vérification des buckets S3..."
buckets=$(docker run --rm --network filehunt_filehunt-network \
    -e AWS_ACCESS_KEY_ID=test \
    -e AWS_SECRET_ACCESS_KEY=test \
    amazon/aws-cli:2.13.25 \
    aws --endpoint-url=http://localstack:4566 s3 ls)

if echo "$buckets" | grep -q "filehunt-git-service" && echo "$buckets" | grep -q "filehunt-shared"; then
    echo "✅ Buckets S3 configurés correctement"
else
    echo "❌ Buckets S3 manquants"
    echo "Buckets trouvés:"
    echo "$buckets"
    exit 1
fi

echo ""
echo "🎉 Environnement Filehunt configuré et fonctionnel !"
echo ""
echo "📋 Services disponibles:"
echo "  - LocalStack S3: http://localhost:4566"
echo "  - Buckets: filehunt-git-service, filehunt-shared"
echo ""
echo "🔧 Commandes utiles:"
echo "  - Arrêter: docker-compose down"
echo "  - Logs: docker-compose logs"
echo "  - Redémarrer: docker-compose restart"