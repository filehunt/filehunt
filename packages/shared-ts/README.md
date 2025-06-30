# @filehunt/shared-ts

Shared React components, utilities, and types that are truly reusable across different applications and contexts.

## Overview

This package contains only genuinely reusable components, hooks, utilities, and types. Application-specific components (like DAM-specific components) have been moved to their respective applications (e.g., `apps/web/src/components/dam/`).

## What's included

- **UI Components**: Generic, unstyled components (buttons, inputs, dialogs, etc.) from Radix UI
- **Common Components**: Generic utility components (LoadingSpinner, EmptyState, etc.)
- **Utilities**: Helper functions for common tasks (formatting, file handling, etc.)
- **Types**: Shared TypeScript interfaces and types
- **Hooks**: Reusable React hooks

## What's NOT included

This package should NOT contain application-specific components. Components specific to Filehunt's DAM functionality have been moved to `apps/web/src/components/dam/`.

## Installation

```bash
npm install @filehunt/shared-ts
```

## Usage

### UI Components

```tsx
import { Button, Input, Dialog } from '@filehunt/shared-ts';

function MyComponent() {
  return (
    <div>
      <Button>Click me</Button>
      <Input placeholder="Enter text" />
    </div>
  );
}
```

### Common Components

```tsx
import { LoadingSpinner, EmptyState } from '@filehunt/shared-ts';

function MyComponent() {
  return (
    <div>
      <LoadingSpinner size="md" />
      <EmptyState message="No items found" />
    </div>
  );
}
```

### Utilities

```tsx
import { formatFileSize, formatDate } from '@filehunt/shared-ts';

const fileSize = formatFileSize(1024); // "1 KB"
const date = formatDate(new Date()); // Formatted date string
```

### Types

```tsx
import type { Asset, Collection, Branch } from '@filehunt/shared-ts';
```

## Development

### Prerequisites

- Node.js 18+
- npm 8+

### Setup

```bash
# Install dependencies
npm install

# Start Storybook for component development
npm run storybook

# Build the package
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

### Storybook

Storybook is available at http://localhost:6006 when running `npm run storybook`. It provides:

- Component documentation
- Interactive component playground
- Visual testing environment

### Available Scripts

- `npm run dev` - Start Storybook development server
- `npm run build` - Build the package for distribution
- `npm run storybook` - Start Storybook on port 6006
- `npm run build-storybook` - Build Storybook for production
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Package Structure

```
packages/shared-ts/
├── components/          # React components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── screens/        # Screen-level components
│   ├── sidebars/       # Sidebar components
│   └── ...             # Other component categories
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # Global styles and CSS
├── stories/            # Storybook stories
├── .storybook/         # Storybook configuration
├── simple.ts           # Simple export file for main components
└── index.ts            # Main export file
```

## Components

### Core Components

- **FilehuntApp** - Main application component
- **AssetCard** - Display asset information with thumbnail
- **Header** - Application header with navigation
- **Footer** - Application footer
- **MainContent** - Main content area wrapper

### UI Components

- **Button** - Styled button with variants
- **Badge** - Small status/label badges
- **Dialog** - Modal dialog components
- **Dropdown** - Dropdown menu components
- **Input** - Form input components
- **Popover** - Popover/tooltip components

### Screen Components

- **UploadScreen** - File upload interface
- **SearchScreen** - Search and filter interface
- **CollectionsScreen** - Collections management
- **BranchesScreen** - Git branches management
- **ActivitiesScreen** - Activity timeline
- **SettingsScreen** - Application settings

### Sidebar Components

- **LeftSidebar** - Main navigation sidebar
- **RightSidebar** - Context-sensitive sidebar
- Various specialized sidebars for different screens

## Styling

The package uses:

- **Tailwind CSS** for utility-first styling
- **CSS Custom Properties** for theming
- **Dark/Light mode** support
- **Responsive design** patterns

Global styles are included in `/styles/global.css` and should be imported in your application.

## TypeScript

This package is written in TypeScript and exports all necessary types. The main types include:

- `Asset` - Digital asset metadata
- `Collection` - Asset collection information  
- `Branch` - Git branch information
- `User` - User account information
- `Tag` - Asset tagging system
- `TimelineCommit` - Git commit timeline

## Integration

### With Next.js (apps/web)

```tsx
// pages/dam.tsx
'use client';

import { FilehuntApp } from '@filehunt/shared-ts/simple';
import '@filehunt/shared-ts/styles/global.css';

export default function DAMPage() {
  return (
    <div className="w-full h-screen">
      <FilehuntApp />
    </div>
  );
}
```

### With Other React Apps

```tsx
import { FilehuntApp } from '@filehunt/shared-ts/simple';
import '@filehunt/shared-ts/styles/global.css';

function App() {
  return <FilehuntApp />;
}
```

## Contributing

1. Make changes to components in the appropriate directories
2. Add or update Storybook stories for new/modified components
3. Run type checking and linting before committing
4. Test components in Storybook
5. Update this README if adding new major components or features

## Dependencies

This package relies on:

- React 18/19
- Radix UI primitives
- Lucide React icons
- Tailwind CSS
- Class Variance Authority
- Various other utility libraries

Peer dependencies (must be provided by consuming application):
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## License

MIT License - see LICENSE file for details.