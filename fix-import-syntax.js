#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔧 Fixing broken import syntax in Filehunt web app...");
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

// Fix import syntax in a single file
function fixImportSyntaxInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;
  let hasChanges = false;

  console.log(`📁 Processing: ${path.relative(__dirname, filePath)}`);

  // Fix broken import syntax patterns
  const brokenPatterns = [
    // Pattern: import {\nimport { ... } from '...';
    {
      pattern: /import\s*\{\s*\nimport\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*\n([^}]*)\}\s*from\s*['"]lucide-react['"];?/gs,
      replacement: (match, sharedImports, sharedPath, lucideImports) => {
        return `import {\n${lucideImports.trim()}\n} from 'lucide-react';\nimport { ${sharedImports.trim()} } from '${sharedPath}';`;
      }
    },

    // Pattern: import {\nimport { Button, Badge } from '../../shared';
    {
      pattern: /import\s*\{\s*\nimport\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*\n/g,
      replacement: (match, imports, importPath) => {
        return `import { ${imports.trim()} } from '${importPath}';\n\nimport {\n`;
      }
    },

    // General pattern for doubled import statements
    {
      pattern: /import\s*\{\s*import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,
      replacement: (match, imports, importPath) => {
        return `import { ${imports.trim()} } from '${importPath}';\n\nimport {`;
      }
    }
  ];

  // Apply pattern fixes
  brokenPatterns.forEach((fix, index) => {
    if (typeof fix.replacement === 'function') {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
        console.log(`  ✅ Applied pattern fix ${index + 1}`);
      }
    } else {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
        console.log(`  ✅ Applied pattern fix ${index + 1}`);
      }
    }
  });

  // Additional manual fixes for common issues

  // Fix: import {\nimport { Button } from '../../shared';
  // Should become: import { Button } from '../../shared';\nimport {
  content = content.replace(
    /import\s*\{\s*\nimport\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"];?\s*\n/g,
    "import { $1 } from '$2';\n\nimport {\n"
  );

  // Fix orphaned closing braces and unclosed imports
  const lines = content.split('\n');
  const fixedLines = [];
  let inImportBlock = false;
  let importBuffer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if we're starting an import block
    if (trimmedLine.startsWith('import {') && !trimmedLine.includes('}')) {
      inImportBlock = true;
      importBuffer = line;
      continue;
    }

    // If we're in an import block, accumulate lines
    if (inImportBlock) {
      importBuffer += '\n' + line;

      // Check if this line closes the import
      if (trimmedLine.includes('} from ')) {
        inImportBlock = false;
        fixedLines.push(importBuffer);
        importBuffer = '';
        continue;
      }

      // If we hit another import or non-import line, close the previous import
      if (trimmedLine.startsWith('import ') || (!trimmedLine.startsWith(' ') && trimmedLine.length > 0 && !trimmedLine.includes(','))) {
        // Close the previous import block
        if (importBuffer && !importBuffer.includes('} from ')) {
          importBuffer += "\n} from 'lucide-react';";
        }
        fixedLines.push(importBuffer);
        fixedLines.push(line);
        inImportBlock = false;
        importBuffer = '';
        continue;
      }

      continue;
    }

    fixedLines.push(line);
  }

  // Handle case where file ends with an unclosed import
  if (inImportBlock && importBuffer) {
    if (!importBuffer.includes('} from ')) {
      importBuffer += "\n} from 'lucide-react';";
    }
    fixedLines.push(importBuffer);
  }

  const newContent = fixedLines.join('\n');
  if (newContent !== content) {
    content = newContent;
    hasChanges = true;
    console.log(`  ✅ Applied manual import cleanup`);
  }

  // Clean up extra whitespace
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Write file if changes were made
  if (hasChanges && content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed import syntax in: ${path.relative(__dirname, filePath)}`);
    return true;
  } else if (!hasChanges) {
    console.log(`⚪ No syntax issues found in: ${path.relative(__dirname, filePath)}`);
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
    if (fixImportSyntaxInFile(file)) {
      modifiedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    errorCount++;
  }
});

console.log();
console.log("🎉 Import syntax fixing completed!");
console.log(`✅ Files modified: ${modifiedCount}`);
console.log(`⚪ Files unchanged: ${files.length - modifiedCount - errorCount}`);
if (errorCount > 0) {
  console.log(`❌ Files with errors: ${errorCount}`);
}

console.log();
console.log("📝 Summary of fixes applied:");
console.log("- 🔧 Fixed doubled import statements");
console.log("- 🔧 Closed unclosed import blocks");
console.log("- 🔧 Separated mixed import syntax");
console.log("- 🧹 Cleaned up extra whitespace");

console.log();
console.log("🚀 Next step: Try building the web app again");
console.log("   cd apps/web && npm run build");
