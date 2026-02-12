# Quick Start Guide

## For CLI Users (Creating Projects)

### Installation

No installation needed! Use `npx`:

```bash
npx create-vkondi-app my-app
```

### Quick Examples

**Minimal React App:**
```bash
npx create-vkondi-app my-app
# Select: React, TypeScript, No extras
cd my-app
npm install
npm run dev
```

**Full-Stack Next.js:**
```bash
npx create-vkondi-app my-fullstack
# Select: Next.js, TypeScript, All features
cd my-fullstack
npm install
npm run dev
```

**Production React:**
```bash
npx create-vkondi-app my-prod-app
# Select: React, TypeScript, Tailwind, Vitest, Strict, GitHub Actions, Docker
cd my-prod-app
npm install
npm run dev
```

---

## For CLI Developers (Contributing)

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Git
- Code editor (VS Code recommended)

### Setup Steps

1. **Clone the repository**
   ```bash
git clone https://github.com/yourusername/create-vkondi-app.git
cd create-vkondi-app

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Link for local testing**
   ```bash
   npm link
   ```

5. **Verify installation**
   ```bash
   create-vkondi-app --version
   ```

### Development Workflow

1. **Make changes** in `src/`
2. **Build** with `npm run build` (or `npm run dev` for watch mode)
3. **Test** by running `create-vkondi-app test-app` in a temp directory
4. **Verify** the generated project works correctly
5. **Commit** your changes

### Development Commands

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Testing Your Changes

```bash
# Build the CLI
npm run build

# Create a test project in /tmp
cd /tmp
create-vkondi-app test-project

# Test the generated project
cd test-project
npm install
npm run lint
npm run type-check
npm run test
npm run build
npm run dev
```

### Project Structure Reference

```
create-vkondi-app/
├── src/
│   ├── index.ts              # Start here - CLI entry
│   ├── prompts.ts            # Add/modify prompts here
│   ├── context.ts            # Add context fields here
│   ├── scaffold/             # Add new frameworks here
│   │   ├── react.ts
│   │   └── next.ts
│   ├── features/             # Add new features here
│   │   ├── eslint.ts
│   │   ├── prettier.ts
│   │   ├── husky.ts
│   │   ├── vitest.ts
│   │   ├── tailwind.ts
│   │   ├── docker.ts
│   │   └── github-actions.ts
│   └── utils/                # Utility functions
│       ├── logger.ts
│       ├── file.ts
│       ├── packageJson.ts
│       └── install.ts
├── dist/                     # Built output (generated)
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

### Common Development Tasks

#### Add a New Feature

1. Create `src/features/my-feature.ts`:
   ```typescript
   import type { ProjectContext } from '../context.js';
   import { logger } from '../utils/logger.js';
   
   export async function setupMyFeature(context: ProjectContext): Promise<void> {
     logger.step('Setting up My Feature...');
     // Implementation
     logger.success('My Feature configured');
   }
   ```

2. Update `src/context.ts` if needed:
   ```typescript
   export interface ProjectContext {
     // existing fields...
     myFeature: boolean;
   }
   ```

3. Add prompt in `src/prompts.ts`:
   ```typescript
   {
     type: 'confirm',
     name: 'myFeature',
     message: 'Add My Feature?',
     initial: false,
   }
   ```

4. Integrate in `src/index.ts`:
   ```typescript
   import { setupMyFeature } from './features/my-feature.js';
   
   // In setupFeatures():
   if (context.myFeature) {
     await setupMyFeature(context);
   }
   ```

#### Add a New Framework

1. Create `src/scaffold/my-framework.ts`
2. Update `ProjectContext` type
3. Add to prompts
4. Integrate in main flow

#### Modify Generated Code

Look in the specific scaffold or feature module and update the template strings.

### Debugging

#### Enable Verbose Logging

Modify `src/utils/logger.ts` to add debug logs.

#### Test Specific Features

Comment out other features in `src/index.ts` to test in isolation.

#### Inspect Generated Files

After running the CLI, examine the output in the generated project directory.

### Code Style Guidelines

- Use TypeScript with strict mode
- Use async/await (no callbacks)
- Use named exports (no default exports)
- Keep functions under 50 lines
- Add JSDoc comments for public APIs
- Use descriptive variable names
- Handle errors explicitly

### Before Committing

1. **Build**: `npm run build`
2. **Type check**: `npm run type-check`
3. **Lint**: `npm run lint`
4. **Format**: `npm run format`
5. **Test**: Create a project and verify it works

### Publishing (Maintainers Only)

1. **Update version**:
   ```bash
   npm version patch  # or minor, or major
   ```

2. **Update CHANGELOG.md**

3. **Build**:
   ```bash
   npm run build
   ```

4. **Test published version**:
   ```bash
   npm publish --dry-run
   ```

5. **Publish**:
   ```bash
   npm publish
   ```

6. **Tag release**:
   ```bash
   git push --tags
   ```

---

## Troubleshooting

### "Command not found: create-vkondi-app"

After `npm link`:
```bash
# Check global bin location
npm bin -g

# Ensure it's in PATH
echo $PATH  # Should include npm global bin

# Re-link
npm unlink
npm link
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Generated Project Errors

```bash
# In generated project
rm -rf node_modules
npm install
```

---

## Resources

- [README.md](./README.md) - User documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Detailed contribution guide
- [EXAMPLES.md](./EXAMPLES.md) - Usage examples
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Architecture details

## Getting Help

- Check existing issues on GitHub
- Read the documentation
- Create a new issue with:
  - Node version: `node --version`
  - npm version: `npm --version`
  - CLI version: `create-vkondi-app --version`
  - Steps to reproduce
  - Expected vs actual behavior

---

Happy coding! 🚀
