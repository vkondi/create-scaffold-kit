# create-vkondi-app

> Scaffold opinionated React (Vite) or Next.js applications

A production-grade CLI tool for creating modern web applications with best practices baked in.

## Features

✨ **Framework Support**
- React with Vite
- Next.js (App Router)

🎯 **Development Tools**
- TypeScript (optional)
- ESLint with strict/standard modes
- Prettier for consistent formatting
- Husky + lint-staged for pre-commit hooks

🧪 **Testing**
- Vitest with React Testing Library
- Coverage reporting
- Example tests included

🎨 **Styling**
- Tailwind CSS (optional)
- Clean, organized structure

🐳 **DevOps**
- Docker setup with multi-stage builds
- Docker Compose for full-stack apps
- GitHub Actions CI/CD workflows

## Quick Start

```bash
npx create-vkondi-app my-app
```

Or with a specific package manager:

```bash
npm create vkondi-app my-app
# or
pnpm create vkondi-app my-app
# or
yarn create vkondi-app my-app
```

## Usage

### Interactive Mode

Simply run the CLI and answer the prompts:

```bash
npx create-vkondi-app
```

### With Project Name

Provide the project name as an argument:

```bash
npx create-vkondi-app my-awesome-app
```

## What You Get

### React (Vite) Projects

- ⚡ Lightning-fast HMR with Vite
- 📁 Feature-based folder structure
- 🎯 Path aliases configured (`@/`, `@features/`, etc.)
- 🔒 Strict TypeScript configuration
- 🧹 Clean, minimal boilerplate

### Next.js Projects

- 🚀 App Router with RSC
- 🔐 Security headers configured
- 📦 Absolute imports
- ⚡ Optimized production builds
- 🎯 TypeScript strict mode

### Development Tooling

**ESLint**
- Flat config (ESLint 9+)
- Import ordering
- React-specific rules
- Strict mode: no default exports, stricter rules

**Prettier**
- Opinionated formatting
- Integrated with ESLint
- Pre-commit formatting

**Husky + lint-staged**
- Pre-commit: lint + format + test
- Pre-push: type-check

**Vitest**
- Fast unit testing
- React Testing Library integration
- Coverage reporting
- UI mode for interactive testing

### CI/CD

**GitHub Actions**
- Multi-version Node.js testing
- Type checking
- Linting and formatting checks
- Test execution with coverage
- Build verification

### Docker

**Frontend**
- Multi-stage builds for optimized images
- Production-ready Nginx (React) or standalone Node (Next.js)

## Project Structure

### React (Vite)

```
my-app/
├── src/
│   ├── app/           # Application-level components
│   ├── features/      # Feature modules
│   ├── shared/        # Shared components
│   ├── lib/           # Utility libraries
│   ├── hooks/         # Custom React hooks
│   ├── types/         # TypeScript types
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── .github/
│   └── workflows/
│       └── ci.yml     # CI/CD pipeline
├── eslint.config.js   # ESLint configuration
├── vite.config.ts     # Vite configuration
├── vitest.config.ts   # Vitest configuration
└── package.json
```

### Next.js

```
my-app/
├── src/
│   ├── app/           # App Router pages
│   ├── components/    # React components
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
├── public/            # Static assets
├── .github/
│   └── workflows/
│       └── ci.yml     # CI/CD pipeline
├── eslint.config.js   # ESLint configuration
├── next.config.ts     # Next.js configuration
└── package.json
```

## Development

After creating your project:

### Frontend

```bash
cd my-app
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # TypeScript check
npm run test         # Run tests
npm run test:ui      # Interactive test UI
npm run test:coverage # Coverage report
```

### Docker

```bash
# Frontend only
docker build -t my-app .
docker run -p 80:80 my-app
```

## Extensibility

The CLI is designed for future extension commands:

```bash
# Planned features
vkondi add auth          # Add authentication
vkondi add stripe        # Add Stripe integration
vkondi add shadcn        # Add shadcn/ui
vkondi upgrade           # Upgrade dependencies
```

## Architecture

### Modular Design

Each feature is isolated in its own module:

- **Scaffold modules**: Framework-specific scaffolding
- **Feature modules**: Independent, reusable features
- **Utility modules**: Shared helper functions
- **Clean separation**: No interdependencies between features

### Principles

- ✅ Single Responsibility
- ✅ Dependency Injection ready
- ✅ Easy to test
- ✅ Easy to extend
- ✅ No magic, explicit code

## Requirements

- Node.js 18+
- npm, yarn, or pnpm
- Git (optional, for repository initialization)
- Docker (if using Docker setup)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT

## Acknowledgments

Built with:
- [Vite](https://vitejs.dev/)
- [Next.js](https://nextjs.org/)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Made with ❤️ for the developer community
