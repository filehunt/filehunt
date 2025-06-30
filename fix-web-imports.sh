#!/bin/bash

echo "🔧 Fixing imports in apps/web..."
echo

# Counter for files modified
modified_count=0

# Find all TypeScript and JavaScript files in apps/web/src
find "apps/web/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
  # Create backup
  cp "$file" "$file.bak"

  # Track if file was modified
  file_modified=false

  # Fix @/shared imports for types
  if sed -i.tmp 's/from '\''@\/shared'\''/from '\''@shared-ts\/types'\''/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  # Fix @filehunt/shared imports
  if sed -i.tmp 's/from '\''@filehunt\/shared'\''/from '\''@shared-ts\/types'\''/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  # Fix @filehunt/shared-ts/simple imports
  if sed -i.tmp 's/from '\''@filehunt\/shared-ts\/simple'\''/from '\''@shared-ts\/types'\''/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  # Fix @filehunt/shared-ts/types imports
  if sed -i.tmp 's/from '\''@filehunt\/shared-ts\/types'\''/from '\''@shared-ts\/types'\''/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  # Fix double quotes variants
  if sed -i.tmp 's/from "@\/shared"/from "@shared-ts\/types"/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  if sed -i.tmp 's/from "@filehunt\/shared"/from "@shared-ts\/types"/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  if sed -i.tmp 's/from "@filehunt\/shared-ts\/simple"/from "@shared-ts\/types"/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  if sed -i.tmp 's/from "@filehunt\/shared-ts\/types"/from "@shared-ts\/types"/g' "$file" 2>/dev/null; then
    if ! cmp -s "$file" "$file.bak"; then
      file_modified=true
    fi
  fi

  # Now we need to handle component imports differently - these should go to ../shared or ../../shared
  # But first let's check the current relative path depth

  # Count directory depth from apps/web/src
  depth=$(echo "$file" | sed 's|apps/web/src/||' | tr -cd '/' | wc -c)

  # Determine correct relative path to shared.ts
  if [ "$depth" -eq 0 ]; then
    shared_path="./shared"
  elif [ "$depth" -eq 1 ]; then
    shared_path="../shared"
  else
    # Build the relative path
    shared_path=""
    for ((i=0; i<depth; i++)); do
      shared_path="../$shared_path"
    done
    shared_path="${shared_path}shared"
  fi

  # For component imports, we need to be more careful and check if the line contains component names
  # Let's handle specific cases where we know components are being imported

  # First, let's fix any remaining ../shared patterns to use consistent path
  if [[ "$file" == *"/components/"* ]]; then
    # If we're in a components subdirectory, use ../shared
    if sed -i.tmp "s|from '../shared'|from '../shared'|g" "$file" 2>/dev/null; then
      if ! cmp -s "$file" "$file.bak"; then
        file_modified=true
      fi
    fi
    if sed -i.tmp "s|from '../../shared'|from '../shared'|g" "$file" 2>/dev/null; then
      if ! cmp -s "$file" "$file.bak"; then
        file_modified=true
      fi
    fi
  fi

  # Clean up temp files
  rm -f "$file.tmp"

  if [ "$file_modified" = true ]; then
    echo "✅ Fixed imports in: $file"
    modified_count=$((modified_count + 1))
  fi

  # Remove backup
  rm -f "$file.bak"
done

echo
echo "✨ Complete! Fixed imports in $modified_count files."
echo
echo "📝 Summary of changes:"
echo "- @/shared → @shared-ts/types"
echo "- @filehunt/shared → @shared-ts/types"
echo "- @filehunt/shared-ts/* → @shared-ts/*"
echo "- Normalized relative shared paths"
