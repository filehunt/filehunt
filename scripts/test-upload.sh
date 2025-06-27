# Créer un fichier de test
echo "Contenu de test du document PDF" > /tmp/test-document.pdf

# Extraire l'URL pré-signée de la réponse précédente
PRESIGNED_URL="http://localhost:4566/filehunt-files/files/ba734069-72ca-4e69-a78f-c3ac98272f20/versions/e63a497e-710d-4954-9fe3-08c352091a54/test-document.pdf?x-id=PutObject&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=test%2F20250627%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250627T102229Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=content-length%3Bcontent-type%3Bhost%3Bx-amz-server-side-encryption%3Bx-amz-server-side-encryption-aws-kms-key-id&X-Amz-Signature=73f51624b89049742c1f3e8db9cdc50d74775a65067fa0e04d08bb0324465e6d"

# Uploader le fichier
curl -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: application/pdf" \
  --data-binary @/tmp/test-document.pdf \
  -v
