#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Files to fix
const filesToFix = [
  "apps/web/src/components/layout/Footer.tsx",
  "apps/web/src/components/layout/MainContent.tsx",
  "apps/web/src/components/layout/RightSidebar.tsx",
  "apps/web/src/components/layout/Header.tsx",
  "apps/web/src/components/layout/LeftSidebar.tsx",
  "apps/web/src/components/screens/UploadScreen.tsx",
  "apps/web/src/components/screens/BranchesScreen.tsx",
  "apps/web/src/components/screens/SearchScreen.tsx",
  "apps/web/src/components/screens/CollectionsScreen.tsx",
  "apps/web/src/components/screens/SettingsScreen.tsx",
  "apps/web/src/components/screens/ActivitiesScreen.tsx",
  "apps/web/src/components/AssetDetailSidebar.tsx",
];

// Import replacements
const replacements = [
  // UI imports
  { from: /from '\.\/(ui\/[^']+)'/g, to: "from '../shared'" },
  { from: /from '\.\.\/(ui\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(ui\/[^']+)'/g, to: "from '../../../shared'" },

  // Common component imports
  { from: /from '\.\/(common\/[^']+)'/g, to: "from '../shared'" },
  { from: /from '\.\.\/(common\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(common\/[^']+)'/g, to: "from '../../../shared'" },

  // Figma component imports
  { from: /from '\.\/(figma\/[^']+)'/g, to: "from '../shared'" },
  { from: /from '\.\.\/(figma\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(figma\/[^']+)'/g, to: "from '../../../shared'" },

  // Reusable component imports
  {
    from: /from '\.\/(AssetCard|AppearancePopover|FieldsPopover|NewFolderDialog|SelectionBar|SortPopover|TagSuggestionPopover)'/g,
    to: "from '../shared'",
  },
  {
    from: /from '\.\.\/(AssetCard|AppearancePopover|FieldsPopover|NewFolderDialog|SelectionBar|SortPopover|TagSuggestionPopover)'/g,
    to: "from '../../shared'",
  },
  {
    from: /from '\.\.\.\/(AssetCard|AppearancePopover|FieldsPopover|NewFolderDialog|SelectionBar|SortPopover|TagSuggestionPopover)'/g,
    to: "from '../../../shared'",
  },

  // Type imports
  {
    from: /from '\.\.\/(types\/[^']+)'/g,
    to: "from '@filehunt/shared-ts/simple'",
  },
  {
    from: /from '\.\.\.\/(types\/[^']+)'/g,
    to: "from '@filehunt/shared-ts/simple'",
  },
  {
    from: /from '\.\/(types\/[^']+)'/g,
    to: "from '@filehunt/shared-ts/simple'",
  },

  // Hook imports
  { from: /from '\.\.\/(hooks\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(hooks\/[^']+)'/g, to: "from '../../../shared'" },
  { from: /from '\.\/(hooks\/[^']+)'/g, to: "from '../shared'" },

  // Utils imports
  { from: /from '\.\.\/(utils\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(utils\/[^']+)'/g, to: "from '../../../shared'" },
  { from: /from '\.\/(utils\/[^']+)'/g, to: "from '../shared'" },

  // Lib imports
  { from: /from '\.\.\/(lib\/[^']+)'/g, to: "from '../../shared'" },
  { from: /from '\.\.\.\/(lib\/[^']+)'/g, to: "from '../../../shared'" },
  { from: /from '\.\/(lib\/[^']+)'/g, to: "from '../shared'" },
];

function fixImportsInFile(filePath) {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, "utf8");
  let hasChanges = false;

  replacements.forEach((replacement) => {
    if (replacement.from.test(content)) {
      content = content.replace(replacement.from, replacement.to);
      hasChanges = true;
    }
  });

  // Additional specific fixes for import consolidation
  if (content.includes("from '../shared'")) {
    // Extract all imports from shared
    const sharedImports = [];
    const importRegex =
      /import\s*\{([^}]+)\}\s*from\s*['"]\.\.\/\.\.\/shared['"];?/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const imports = match[1]
        .split(",")
        .map((imp) => imp.trim())
        .filter((imp) => imp.length > 0);
      sharedImports.push(...imports);
    }

    if (sharedImports.length > 0) {
      // Remove duplicate imports
      const uniqueImports = [...new Set(sharedImports)];

      // Remove all existing shared imports
      content = content.replace(importRegex, "");

      // Add consolidated import at the top (after other imports)
      const importLines = content.split("\n");
      let insertIndex = 0;

      // Find where to insert (after the last import)
      for (let i = 0; i < importLines.length; i++) {
        if (
          importLines[i].trim().startsWith("import") &&
          !importLines[i].includes("shared")
        ) {
          insertIndex = i + 1;
        }
      }

      const consolidatedImport = `import { ${uniqueImports.join(", ")} } from '../../shared';`;
      importLines.splice(insertIndex, 0, consolidatedImport);
      content = importLines.join("\n");
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed imports in: ${filePath}`);
  } else {
    console.log(`No changes needed in: ${filePath}`);
  }
}

console.log("Fixing imports in component files...");

filesToFix.forEach((filePath) => {
  fixImportsInFile(filePath);
});

console.log("Import fixing completed!");
