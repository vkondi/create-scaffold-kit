import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';
import { writeFile, joinPath } from '../utils/file.js';
import { addDevDependencies, addScripts } from '../utils/packageJson.js';

export async function setupPrettier(context: ProjectContext): Promise<void> {
  logger.startSpinner('Setting up Prettier...');

  try {
    // Install dependencies
    await addDevDependencies(context.projectPath, {
      prettier: '^3.2.5',
      'eslint-config-prettier': '^9.1.0',
      'eslint-plugin-prettier': '^5.1.3',
    });

    // Create Prettier config
    await createPrettierConfig(context);

    // Create .prettierignore
    await createPrettierIgnore(context);

    // Add scripts
    await addScripts(context.projectPath, {
      format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"',
      'format:check': 'prettier --check "src/**/*.{ts,tsx,js,jsx,json,css,md}"',
    });

    logger.succeedSpinner('Prettier configured');
  } catch (error) {
    logger.failSpinner('Failed to setup Prettier');
    throw error;
  }
}

async function createPrettierConfig(context: ProjectContext): Promise<void> {
  const config = {
    semi: true,
    trailingComma: 'es5' as const,
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    arrowParens: 'always' as const,
    endOfLine: 'lf' as const,
    bracketSpacing: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed' as const,
  };

  const configPath = joinPath(context.projectPath, '.prettierrc.json');
  await writeFile(configPath, JSON.stringify(config, null, 2));
}

async function createPrettierIgnore(context: ProjectContext): Promise<void> {
  const ignoreContent = `node_modules
dist
build
.next
coverage
pnpm-lock.yaml
package-lock.json
yarn.lock
public
*.min.js
*.min.css
`;

  await writeFile(joinPath(context.projectPath, '.prettierignore'), ignoreContent);
}
