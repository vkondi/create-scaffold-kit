# Usage Examples

## Basic Usage

### Create a Simple React App

```bash
npx create-vkondi-app my-react-app
```

Then select:
- Framework: React (Vite)
- TypeScript: Yes
- Tailwind: No
- Testing: Vitest
- Linting: Standard
- GitHub Actions: No
- Docker: No

### Create a Production Next.js App

```bash
npx create-vkondi-app my-nextjs-app
```

Then select:
- Framework: Next.js
- TypeScript: Yes
- Tailwind: Yes
- Testing: Vitest
- Linting: Strict
- GitHub Actions: Yes
- Docker: Yes

## Common Scenarios

### Scenario 1: Production-Ready React SaaS Frontend

Perfect for building a modern SaaS application frontend.

**Configuration:**
- Framework: React (Vite)
- Backend: None (or connect to existing API)
- TypeScript: Yes
- Tailwind: Yes
- Testing: Vitest
- Linting: Strict
- GitHub Actions: Yes
- Docker: Yes

**What you get:**
- Lightning-fast Vite dev server
- Strict TypeScript for fewer bugs
- Tailwind for rapid UI development
- Comprehensive testing setup
- CI/CD pipeline
- Production Docker image

**Getting Started:**
```bash
npx create-vkondi-app my-saas-frontend
cd my-saas-frontend
npm install
npm run dev
```

### Scenario 2: Next.js Landing Page with Analytics

Great for marketing sites, landing pages, or content-heavy sites.

**Configuration:**
- Framework: Next.js
- Backend: None
- TypeScript: Yes
- Tailwind: Yes
- Testing: None (optional)
- Linting: Standard
- GitHub Actions: Yes
- Docker: No

**What you get:**
- SEO-optimized Next.js
- Server components for performance
- Tailwind for beautiful UI
- Static export capability
- Vercel-ready deployment

### Scenario 3: Component Library Development

Building a React component library.

**Configuration:**
- Framework: React (Vite)
- Backend: None
- TypeScript: Yes
- Tailwind: No
- Testing: Vitest
- Linting: Strict
- GitHub Actions: Yes
- Docker: No

**What you get:**
- Strict linting for consistency
- Vitest for component testing
- TypeScript for type-safe APIs
- CI for automated testing
- No default exports (better for tree-shaking)

### Scenario 4: Rapid Prototyping

Quick iteration without strict rules.

**Configuration:**
- Framework: React (Vite)
- Backend: None
- TypeScript: No
- Tailwind: Yes
- Testing: None
- Linting: Standard
- GitHub Actions: No
- Docker: No

**What you get:**
- Fast setup, minimal tooling
- JavaScript for flexibility
- Tailwind for quick styling
- Standard linting (not too strict)
- Focus on speed over process

## Feature Combinations

### TypeScript + Strict Linting

Recommended for:
- Large teams
- Long-term projects
- Libraries
- Production applications

Benefits:
- Catch errors early
- Better refactoring
- Improved code quality
- Enforced best practices

### Tailwind + Vitest

Recommended for:
- Component-driven development
- Design systems
- UI-heavy applications

Benefits:
- Rapid UI development
- Visual regression testing capability
- Component testing with RTL

### Docker + GitHub Actions

Recommended for:
- Production deployments
- Cloud deployments
- Team projects

Benefits:
- Consistent environments
- Automated testing
- Easy deployment
- Reproducible builds

## Advanced Usage

### Monorepo Setup

Create multiple apps and share code:

```bash
mkdir my-monorepo
cd my-monorepo

# Create apps
npx create-vkondi-app web
npx create-vkondi-app admin
npx create-vkondi-app mobile

# Add workspace configuration
npm init -y
```

### Customizing After Creation

#### Adding Features

After creation, you can manually add:

**Zustand (State Management):**
```bash
npm install zustand
```

**React Query (Data Fetching):**
```bash
npm install @tanstack/react-query
```

**React Router (Routing - for React):**
```bash
npm install react-router-dom
```

**Zod (Validation):**
```bash
npm install zod
```

#### Modifying Configs

All configurations are editable:

- `eslint.config.js` - Linting rules
- `vite.config.ts` / `next.config.ts` - Bundler config
- `vitest.config.ts` - Test configuration
- `tailwind.config.js` - Tailwind customization
- `.prettierrc.json` - Code formatting

### Environment Variables

#### React (Vite)

Create `.env`:
```
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=My App
```

Use in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

#### Next.js

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
API_SECRET=secret-key
```

Use in code:
```typescript
// Public (client-side)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Server-side only
const secret = process.env.API_SECRET;
```

### Deployment

#### Vercel (Next.js)

```bash
npm install -g vercel
vercel
```

#### Netlify (React)

```bash
npm run build
# Upload dist/ folder
```

#### Docker Production

```bash
# Build
docker build -t my-app:latest .

# Run
docker run -p 80:80 my-app:latest
```

### Testing Strategies

#### Unit Tests

```bash
npm run test
```

#### With Coverage

```bash
npm run test:coverage
```

#### Interactive Mode

```bash
npm run test:ui
```

#### Watch Mode (Development)

```bash
npm run test -- --watch
```

### CI/CD Workflows

The generated GitHub Actions workflow runs:

1. **Install** - Dependencies
2. **Type Check** - TypeScript validation
3. **Lint** - Code quality
4. **Format Check** - Code style
5. **Test** - Unit tests
6. **Build** - Production build

Customize in `.github/workflows/ci.yml`.

## Tips and Tricks

### Fast Iteration

For maximum speed during development:

```bash
# Use pnpm for faster installs
pnpm create vkondi-app my-app

# Skip optional features
# Choose: No Backend, No Docker, No GitHub Actions
```

### Production Best Practices

For production applications:

```bash
# Always choose:
# ✅ TypeScript
# ✅ Strict Linting
# ✅ Vitest
# ✅ GitHub Actions
# ✅ Docker (if deploying to containers)
```

### Team Projects

For team collaboration:

1. Use TypeScript (team consistency)
2. Enable Husky (prevent bad commits)
3. Strict linting (code quality)
4. GitHub Actions (automated checks)
5. Vitest (prevent regressions)

### Learning Projects

For personal learning:

1. Start simple (no backend, no docker)
2. Use TypeScript (good practice)
3. Add Tailwind (learn utility-first CSS)
4. Add Vitest (learn testing)

## Troubleshooting

### Dependencies Not Installing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Or try different package manager
pnpm install
```

### ESLint Errors

```bash
# Fix automatically
npm run lint:fix

# Check for issues
npm run lint
```

### TypeScript Errors

```bash
# Check types
npm run type-check

# Update tsconfig.json if needed
```

### Port Already in Use

```bash
# React (Vite) - Change in package.json
"dev": "vite --port 5174"

# Next.js
npm run dev -- -p 3001
```

## Next Steps

After creating your project:

1. **Read the generated README** in your project
2. **Run `npm run dev`** to start development
3. **Explore the folder structure**
4. **Customize configurations** as needed
5. **Start building!** 🚀

## Getting Help

- Check [README.md](./README.md) for overall documentation
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development details
- Open an issue on GitHub for bugs or questions
- Review the generated files in your project
