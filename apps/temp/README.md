# Filehunt Web App

Next.js web application for the Filehunt Digital Asset Management platform.

## Overview

This is the main web application that provides the user interface for Filehunt DAM. It's built with Next.js 15 and uses shared components from `@filehunt/shared-ts`.

## Features

- **Digital Asset Management Interface** - Complete DAM functionality through shared components
- **Next.js App Router** - Modern routing with the app directory
- **Server-Side Rendering** - Optimized performance with SSR
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Mode** - Theme switching support

## Getting Started

### Prerequisites

- Node.js 18+
- npm 8+

### Installation

```bash
# Install dependencies (from project root)
npm install

# Or install locally
cd apps/web
npm install
```

### Development

```bash
# Start development server
npm run dev

# Or from project root
cd apps/web && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Routes

- `/` - Landing page with navigation to DAM app
- `/dam` - Full Digital Asset Management application

## Project Structure

```
apps/web/
├── src/
│   └── app/
│       ├── globals.css      # Global styles
│       ├── layout.tsx       # Root layout
│       ├── page.tsx         # Home page
│       ├── dam/
│       │   └── page.tsx     # DAM application page
│       └── styles/
│           └── globals.css  # Shared component styles
├── public/                  # Static assets
├── next.config.ts          # Next.js configuration
├── package.json
└── tsconfig.json
```

## Dependencies

### Main Dependencies
- `next` - Next.js framework
- `react` - React library
- `react-dom` - React DOM
- `@filehunt/shared-ts` - Shared components and utilities

### Development Dependencies
- `typescript` - TypeScript support
- `@types/*` - Type definitions
- `tailwindcss` - Utility-first CSS
- `eslint` - Code linting

## Configuration

### Next.js Configuration

The app is configured to:
- Ignore TypeScript errors during build (temporary)
- Ignore ESLint errors during build (temporary)
- Support the app directory structure

### TypeScript

Full TypeScript support with strict mode disabled for rapid development.

### Tailwind CSS

Configured for utility-first styling with custom design tokens.

## Integration with Shared Components

The web app imports components from `@filehunt/shared-ts`:

```tsx
import { FilehuntApp } from '@filehunt/shared-ts/simple';
```

Styles are imported from the shared package:

```tsx
import '../styles/globals.css';
```

## Development Workflow

1. **Start the development server**: `npm run dev`
2. **Make changes** to pages or components
3. **Hot reload** will automatically update the browser
4. **Build and test** before deploying: `npm run build`

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended for Next.js apps)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

Build command: `npm run build`
Start command: `npm run start`

## Environment Variables

Currently no environment variables are required, but you can add them in:
- `.env.local` for local development
- `.env.production` for production builds

## Performance

The app is optimized for performance with:
- Static generation where possible
- Automatic code splitting
- Image optimization
- CSS optimization

## Contributing

1. Make changes to the web app
2. Test locally with `npm run dev`
3. Build and verify with `npm run build`
4. Update this README if adding new routes or major features

## License

MIT License - see LICENSE file for details.