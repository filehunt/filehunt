#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🔧 Comprehensive import fixing for Filehunt web app...");
console.log();

// Get all TypeScript/React files in web app
function getAllFiles(dir, extensions = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', '.next', 'dist', '.turbo'].includes(file)) {
        results = results.concat(getAllFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Fix imports in a single file
function fixImportsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;
  let hasChanges = false;

  // Calculate relative path depth from apps/web/src
  const relativePath = path.relative(path.join(__dirname, 'apps/web/src'), filePath);
  const depth = relativePath.split(path.sep).length - 1;

  // Determine correct relative path to shared.ts
  let sharedPath;
  if (depth === 0) {
    sharedPath = "./shared";
  } else {
    sharedPath = "../".repeat(depth) + "shared";
  }

  console.log(`📁 Processing: ${path.relative(__dirname, filePath)} (depth: ${depth})`);

  // 1. Fix incorrect UI component imports from @shared-ts/types
  const uiComponents = [
    'Alert', 'AlertDescription', 'AlertTitle', 'Button', 'Badge', 'Card', 'CardContent',
    'CardDescription', 'CardHeader', 'CardTitle', 'Input', 'Label', 'Dialog', 'DialogContent',
    'DialogDescription', 'DialogHeader', 'DialogTitle', 'DialogTrigger', 'Popover',
    'PopoverContent', 'PopoverTrigger', 'Select', 'SelectContent', 'SelectItem',
    'SelectTrigger', 'SelectValue', 'Tabs', 'TabsContent', 'TabsList', 'TabsTrigger',
    'Tooltip', 'TooltipContent', 'TooltipProvider', 'TooltipTrigger', 'DropdownMenu',
    'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuTrigger', 'Avatar',
    'AvatarFallback', 'AvatarImage', 'Switch', 'Slider', 'Progress', 'Separator',
    'ScrollArea', 'Checkbox', 'RadioGroup', 'RadioGroupItem', 'Textarea', 'Toggle',
    'ToggleGroup', 'ToggleGroupItem', 'DatePickerWithRange'
  ];

  const damComponents = [
    'AssetCard', 'AppearancePopover', 'FieldsPopover', 'NewFolderDialog',
    'SelectionBar', 'SortPopover', 'TagSuggestionPopover', 'AssetDetailSidebar'
  ];

  // 2. Extract and fix imports from @shared-ts/types that should be UI components
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@shared-ts\/types['"];?/g;
  let match;
  const uiImports = [];
  const damImports = [];
  const typeImports = [];

  // Find all imports from @shared-ts/types
  while ((match = importRegex.exec(content)) !== null) {
    const imports = match[1]
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => imp.length > 0);

    imports.forEach(imp => {
      const cleanImport = imp.replace(/^type\s+/, '');
      if (uiComponents.includes(cleanImport)) {
        uiImports.push(imp);
      } else if (damComponents.includes(cleanImport)) {
        damImports.push(imp);
      } else {
        typeImports.push(imp);
      }
    });
  }

  // Remove all existing @shared-ts/types imports
  content = content.replace(importRegex, '');
  hasChanges = true;

  // 3. Fix type-only imports from @shared-ts/types
  const typeOnlyRegex = /import\s*type\s*\{([^}]+)\}\s*from\s*['"]@shared-ts\/types['"];?/g;
  let typeMatch;
  while ((typeMatch = typeOnlyRegex.exec(content)) !== null) {
    const imports = typeMatch[1]
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => imp.length > 0);

    typeImports.push(...imports.map(imp => `type ${imp}`));
  }

  // Remove type-only imports from @shared-ts/types
  content = content.replace(typeOnlyRegex, '');

  // 4. Add consolidated imports
  const importStatements = [];

  // Add UI component imports from shared
  if (uiImports.length > 0) {
    const uniqueUiImports = [...new Set(uiImports)];
    importStatements.push(`import { ${uniqueUiImports.join(', ')} } from '${sharedPath}';`);
  }

  // Add DAM component imports from shared
  if (damImports.length > 0) {
    const uniqueDamImports = [...new Set(damImports)];
    importStatements.push(`import { ${uniqueDamImports.join(', ')} } from '${sharedPath}';`);
  }

  // Add type imports from @shared-ts/types
  if (typeImports.length > 0) {
    const uniqueTypeImports = [...new Set(typeImports)];
    importStatements.push(`import { ${uniqueTypeImports.join(', ')} } from '@shared-ts/types';`);
  }

  // 5. Find insertion point and add imports
  if (importStatements.length > 0) {
    const lines = content.split('\n');
    let insertIndex = 0;

    // Find where to insert (after existing imports)
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import') && !lines[i].includes('lucide-react')) {
        insertIndex = i + 1;
      } else if (lines[i].trim().startsWith('import') && lines[i].includes('lucide-react')) {
        insertIndex = i + 1;
        break;
      }
    }

    // Insert consolidated imports
    importStatements.forEach((statement, index) => {
      lines.splice(insertIndex + index, 0, statement);
    });

    content = lines.join('\n');
    hasChanges = true;
  }

  // 6. Additional fixes for consistency

  // Fix any remaining @shared-ts imports to use correct alias
  content = content.replace(
    /from\s*['"]@shared-ts\/components\/([^'"]+)['"]/g,
    "from '@filehunt/shared-ts'"
  );

  // Fix @filehunt/shared-ts/simple to @shared-ts/types for types
  content = content.replace(
    /from\s*['"]@filehunt\/shared-ts\/simple['"]/g,
    "from '@shared-ts/types'"
  );

  // 7. Clean up duplicate or empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Write file if changes were made
  if (hasChanges && content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed imports in: ${path.relative(__dirname, filePath)}`);
    return true;
  } else if (!hasChanges) {
    console.log(`⚪ No changes needed in: ${path.relative(__dirname, filePath)}`);
    return false;
  }

  return false;
}

// Main execution
const webSrcPath = path.join(__dirname, 'apps/web/src');
if (!fs.existsSync(webSrcPath)) {
  console.error('❌ apps/web/src directory not found!');
  process.exit(1);
}

console.log(`🔍 Scanning for TypeScript files in: ${webSrcPath}`);
const files = getAllFiles(webSrcPath);
console.log(`📊 Found ${files.length} files to process`);
console.log();

let modifiedCount = 0;
let errorCount = 0;

files.forEach(file => {
  try {
    if (fixImportsInFile(file)) {
      modifiedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    errorCount++;
  }
});

console.log();
console.log("🎉 Import fixing completed!");
console.log(`✅ Files modified: ${modifiedCount}`);
console.log(`⚪ Files unchanged: ${files.length - modifiedCount - errorCount}`);
if (errorCount > 0) {
  console.log(`❌ Files with errors: ${errorCount}`);
}

console.log();
console.log("📝 Summary of changes applied:");
console.log("- ❌ @shared-ts/types → ✅ '../shared' (for UI components)");
console.log("- ❌ @shared-ts/types → ✅ '@shared-ts/types' (for type imports only)");
console.log("- 🔧 Consolidated duplicate imports");
console.log("- 🧹 Cleaned up import organization");

console.log();
console.log("🚀 Next steps:");
console.log("1. Run this script: node fix-imports-comprehensive.js");
console.log("2. Remove duplicate components from web/src/components/dam/");
console.log("3. Update shared.ts to use @filehunt/shared-ts instead of @shared-ts");
console.log("4. Test the application to ensure everything works");
