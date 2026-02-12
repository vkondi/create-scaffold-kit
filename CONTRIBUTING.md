# Contributing to create-vkondi-app

Thank you for your interest in contributing! This document provides guidelines for developing and extending the CLI.

## Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd create-vkondi-app
```

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

Now you can test the CLI locally:

```bash
create-vkondi-app test-app
```

## Project Structure

```
src/
├── index.ts           # CLI entry point
├── prompts.ts         # User input collection
├── context.ts         # Shared context type
├── scaffold/          # Framework scaffolding
│   ├── react.ts       # React + Vite setup
│   └── next.ts        # Next.js setup
├── features/          # Isolated feature modules
│   ├── eslint.ts      # ESLint configuration
│   ├── prettier.ts    # Prettier configuration
│   ├── husky.ts       # Git hooks setup
│   ├── vitest.ts      # Testing framework
│   ├── tailwind.ts    # Tailwind CSS
│   ├── docker.ts      # Docker setup
│   └── github-actions.ts # CI/CD workflows
└── utils/             # Shared utilities
    ├── logger.ts      # Logging utilities
    ├── file.ts        # File operations
    ├── packageJson.ts # package.json manipulation
    └── install.ts     # Installation utilities
```

## Architecture Principles

### 1. Modularity

Each feature is completely isolated:

```typescript
// ✅ Good: Self-contained feature module
export async function setupESLint(context: ProjectContext): Promise<void> {
  await addDevDependencies(context.projectPath, deps);
  await createESLintConfig(context);
  await addScripts(context.projectPath, scripts);
}

// ❌ Bad: Feature depends on another feature
export async function setupESLint(context: ProjectContext): Promise<void> {
  await setupPrettier(context); // Don't do this!
}
```

### 2. Single Responsibility

Each function does one thing:

```typescript
// ✅ Good: Focused functions
async function createESLintConfig(context: ProjectContext): Promise<void>
async function installESLintDependencies(context: ProjectContext): Promise<void>
async function addESLintScripts(context: ProjectContext): Promise<void>

// ❌ Bad: Function does too much
async function setupEverything(context: ProjectContext): Promise<void>
```

### 3. Explicit Over Implicit

Be explicit about what's happening:

```typescript
// ✅ Good: Clear and explicit
logger.step('Setting up ESLint...');
await addDevDependencies(context.projectPath, {
  'eslint': '^8.56.0',
  '@typescript-eslint/parser': '^6.20.0',
});
logger.success('ESLint configured');

// ❌ Bad: Magic behavior
await magicSetup(context); // What does this do?
```

### 4. Error Handling

Always handle errors gracefully:

```typescript
// ✅ Good: Proper error handling
try {
  await setupFeature(context);
  logger.success('Feature configured');
} catch (error) {
  logger.error('Failed to setup feature');
  throw error; // Re-throw for upstream handling
}

// ❌ Bad: Silent failures
await setupFeature(context).catch(() => {});
```

## Adding a New Feature

1. **Create the feature module**

Create a new file in `src/features/`:

```typescript
// src/features/my-feature.ts
import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';
import { addDevDependencies, addScripts } from '../utils/packageJson.js';
import { writeFile, joinPath } from '../utils/file.js';

export async function setupMyFeature(context: ProjectContext): Promise<void> {
  logger.step('Setting up My Feature...');

  try {
    // 1. Install dependencies
    await addDevDependencies(context.projectPath, {
      'my-package': '^1.0.0',
    });

    // 2. Create configuration files
    await createConfig(context);

    // 3. Add npm scripts
    await addScripts(context.projectPath, {
      'my-feature': 'my-feature-command',
    });

    logger.success('My Feature configured');
  } catch (error) {
    logger.error('Failed to setup My Feature');
    throw error;
  }
}

async function createConfig(context: ProjectContext): Promise<void> {
  const config = {
    // Your config here
  };

  const configPath = joinPath(context.projectPath, 'my-feature.config.js');
  await writeFile(configPath, JSON.stringify(config, null, 2));
}
```

2. **Add to context (if needed)**

If your feature needs a user choice:

```typescript
// src/context.ts
export interface ProjectContext {
  // ...existing fields
  myFeature: boolean; // Add your field
}
```

3. **Add prompts (if needed)**

```typescript
// src/prompts.ts
{
  type: 'confirm',
  name: 'myFeature',
  message: 'Add My Feature?',
  initial: false,
}
```

4. **Integrate into main flow**

```typescript
// src/index.ts
import { setupMyFeature } from './features/my-feature.js';

async function setupFeatures(context: ProjectContext): Promise<void> {
  // ...existing features
  
  if (context.myFeature) {
    await setupMyFeature(context);
  }
}
```

## Adding a New Scaffold

For adding support for a new framework:

1. **Create scaffold module**

```typescript
// src/scaffold/my-framework.ts
import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';

export async function scaffoldMyFramework(context: ProjectContext): Promise<void> {
  logger.step('Creating My Framework project...');
  
  // Your scaffolding logic
}
```

2. **Update context**

```typescript
// src/context.ts
export interface ProjectContext {
  framework: 'react' | 'next' | 'my-framework';
  // ...
}
```

3. **Add to prompts**

```typescript
// src/prompts.ts
{
  type: 'select',
  name: 'framework',
  message: 'Select a framework:',
  choices: [
    { title: 'React (Vite)', value: 'react' },
    { title: 'Next.js', value: 'next' },
    { title: 'My Framework', value: 'my-framework' },
  ],
}
```

4. **Integrate**

```typescript
// src/index.ts
import { scaffoldMyFramework } from './scaffold/my-framework.js';

async function scaffoldProject(context: ProjectContext): Promise<void> {
  if (context.framework === 'my-framework') {
    await scaffoldMyFramework(context);
  }
  // ...
}
```

## Code Style

- **Use TypeScript**: All code should be strongly typed
- **Use async/await**: No callbacks or `.then()` chains
- **Use ESM**: Import/export, not require
- **No default exports**: Use named exports for better refactoring
- **Descriptive names**: `createESLintConfig` not `makeConfig`
- **Small functions**: Keep functions under 50 lines
- **Comments**: Only when necessary, code should be self-documenting

## Testing Locally

1. **Build and link**

```bash
npm run build
npm link
```

2. **Test in a temporary directory**

```bash
cd /tmp
create-vkondi-app test-project
cd test-project
npm install
npm run dev
```

3. **Test all variations**

- React + TypeScript + all features
- Next.js + JavaScript + minimal features
- Different linting modes
- Different testing options

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add: My Feature"`
6. Push to your fork: `git push origin feature/my-feature`
7. Open a Pull Request with:
   - Clear description of changes
   - Screenshots/examples if applicable
   - Test results

## Commit Message Convention

- `Add:` New features
- `Fix:` Bug fixes
- `Update:` Changes to existing features
- `Refactor:` Code improvements without functional changes
- `Docs:` Documentation updates
- `Test:` Test additions or updates

Examples:
```
Add: Tailwind CSS feature module
Fix: ESLint config generation for Next.js
Update: Vitest configuration with latest best practices
Refactor: Extract file utilities to separate module
Docs: Add contribution guidelines
```

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about architecture
- Help with contributing

Thank you for contributing! 🎉
