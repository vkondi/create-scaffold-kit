import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';
import { writeFile, joinPath } from '../utils/file.js';
import { addDevDependencies, addScripts } from '../utils/packageJson.js';

export async function setupOxfmt(context: ProjectContext): Promise<void> {
  logger.startSpinner('Setting up Oxfmt...');

  try {
    // Install dependencies
    await addDevDependencies(context.projectPath, {
      oxfmt: '^0.1.0',
    });

    // Create Oxfmt config
    await createOxfmtConfig(context);

    // Add scripts
    await addScripts(context.projectPath, {
      format: 'oxfmt format src/',
      'format:check': 'oxfmt check src/',
    });

    logger.succeedSpinner('Oxfmt configured');
  } catch (error) {
    logger.failSpinner('Failed to setup Oxfmt');
    throw error;
  }
}

async function createOxfmtConfig(_context: ProjectContext): Promise<void> {
  const config = {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    singleQuote: true,
    trailingComma: 'es5',
    endOfLine: 'lf',
  };

  await writeFile(joinPath(_context.projectPath, '.oxfmtrc.json'), JSON.stringify(config, null, 2));
}
