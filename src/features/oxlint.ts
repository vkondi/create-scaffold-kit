import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';
import { writeFile, joinPath } from '../utils/file.js';
import { addDevDependencies, addScripts } from '../utils/packageJson.js';

export async function setupOxlint(context: ProjectContext): Promise<void> {
  logger.startSpinner('Setting up Oxlint...');

  try {
    // Install dependencies
    await addDevDependencies(context.projectPath, {
      oxlint: '^0.14.0',
    });

    // Create Oxlint config
    await createOxlintConfig(context);

    // Add scripts
    await addScripts(context.projectPath, {
      lint: 'oxlint src/',
      'lint:fix': 'oxlint --fix src/',
    });

    logger.succeedSpinner('Oxlint configured');
  } catch (error) {
    logger.failSpinner('Failed to setup Oxlint');
    throw error;
  }
}

async function createOxlintConfig(context: ProjectContext): Promise<void> {
  const config = {
    $schema:
      'https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/configuration_schema.json',
    plugins: [
      ...(context.framework === 'react' ? ['react', 'react-hooks', 'jsx-a11y'] : []),
      ...(context.typescript ? ['typescript'] : []),
    ],
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'error',
    },
    ignore_patterns: ['dist', 'node_modules', 'build', '.next', 'coverage'],
  };

  await writeFile(joinPath(context.projectPath, '.oxlintrc.json'), JSON.stringify(config, null, 2));
}
