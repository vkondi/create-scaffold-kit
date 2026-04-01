import { Command } from 'commander';
import chalk from 'chalk';
import { collectUserInput } from './prompts.js';
import { logger } from './utils/logger.js';
import { detectPackageManager, installDependencies, initGit } from './utils/install.js';
import { scaffoldReact } from './scaffold/react.js';
import { scaffoldNext } from './scaffold/next.js';
import { setupESLint } from './features/eslint.js';
import { setupOxlint } from './features/oxlint.js';
import { setupPrettier } from './features/prettier.js';
import { setupOxfmt } from './features/oxfmt.js';
import { setupHusky } from './features/husky.js';
import { setupVitest } from './features/vitest.js';
import { setupJest } from './features/jest.js';
import { setupTailwind } from './features/tailwind.js';
import { setupDocker } from './features/docker.js';
import { setupGithubActions } from './features/github-actions.js';
import type { ProjectContext } from './context.js';
import { pathExists, joinPath } from './utils/file.js';

const program = new Command();

async function main() {
  console.clear();

  program
    .name('create-scaffold-kit')
    .description('Scaffold opinionated React (Vite) or Next.js applications')
    .version('1.0.0')
    .argument('[project-name]', 'Name of the project')
    .action(async (projectName?: string) => {
      try {
        await runCLI(projectName);
      } catch (error) {
        logger.error('An error occurred:');
        if (error instanceof Error) {
          logger.error(error.message);
        }
        process.exit(1);
      }
    });

  program.parse();
}

async function runCLI(projectName?: string): Promise<void> {
  // Collect user input
  const context = await collectUserInput(projectName);

  // Detect package manager
  context.packageManager = await detectPackageManager();
  logger.info(`Using ${context.packageManager} as package manager`);
  logger.newLine();

  // Display configuration
  displayConfiguration(context);
  logger.newLine();

  // Scaffold project
  await scaffoldProject(context);

  // Setup features
  await setupFeatures(context);

  // Install dependencies
  await installDependencies(context);

  // Initialize git
  await initGit(context.projectPath);

  // Display success message
  displaySuccessMessage(context);
}

function displayConfiguration(context: ProjectContext): void {
  logger.info(chalk.bold('Project Configuration:'));
  logger.info(`  ${chalk.cyan('Name:')} ${context.projectName}`);
  logger.info(
    `  ${chalk.cyan('Framework:')} ${context.framework === 'react' ? 'React (Vite)' : 'Next.js'}`
  );

  if (context.framework === 'react') {
    logger.info(`  ${chalk.cyan('TypeScript:')} ${context.typescript ? 'Yes' : 'No'}`);
    const linterLabel =
      context.linter === 'eslint' ? 'ESLint' : context.linter === 'oxlint' ? 'Oxlint' : 'None';
    logger.info(`  ${chalk.cyan('Linter:')} ${linterLabel}`);
    logger.info(`  ${chalk.cyan('Tailwind CSS:')} ${context.tailwind ? 'Yes' : 'No'}`);
  } else {
    logger.info(
      `  ${chalk.cyan('Note:')} TypeScript, Linter & Tailwind will be configured by create-next-app`
    );
  }

  const testingLabel =
    context.testing === 'vitest' ? 'Vitest' : context.testing === 'jest' ? 'Jest' : 'None';
  logger.info(`  ${chalk.cyan('Testing:')} ${testingLabel}`);
  const formatterLabel =
    context.formatter === 'prettier'
      ? 'Prettier'
      : context.formatter === 'oxfmt'
        ? 'Oxfmt'
        : 'None';
  logger.info(`  ${chalk.cyan('Formatter:')} ${formatterLabel}`);
  logger.info(`  ${chalk.cyan('GitHub Actions:')} ${context.githubActions ? 'Yes' : 'No'}`);
  logger.info(`  ${chalk.cyan('Docker:')} ${context.docker ? 'Yes' : 'No'}`);
}

async function scaffoldProject(context: ProjectContext): Promise<void> {
  logger.newLine();
  logger.step(chalk.bold('Scaffolding project...'));
  logger.newLine();

  if (context.framework === 'react') {
    await scaffoldReact(context);
  } else {
    await scaffoldNext(context);
    // Detect TypeScript choice from create-next-app for Next.js
    const tsconfigPath = joinPath(context.projectPath, 'tsconfig.json');
    context.typescript = await pathExists(tsconfigPath);
  }
}

async function setupFeatures(context: ProjectContext): Promise<void> {
  logger.newLine();
  logger.step(chalk.bold('Setting up features...'));
  logger.newLine();

  // Linter setup - skip for Next.js as create-next-app already configures it
  if (context.framework === 'react') {
    if (context.linter === 'eslint') {
      await setupESLint(context);
    } else if (context.linter === 'oxlint') {
      await setupOxlint(context);
    }
  }

  // Formatter setup
  if (context.formatter === 'prettier') {
    await setupPrettier(context);
  } else if (context.formatter === 'oxfmt') {
    await setupOxfmt(context);
  }

  // Husky for git hooks
  await setupHusky(context);

  // Tailwind CSS - skip for Next.js as create-next-app handles it
  if (context.tailwind && context.framework === 'react') {
    await setupTailwind(context);
  }

  if (context.testing === 'vitest') {
    await setupVitest(context);
  } else if (context.testing === 'jest') {
    await setupJest(context);
  }

  if (context.docker) {
    await setupDocker(context);
  }

  if (context.githubActions) {
    await setupGithubActions(context);
  }
}

function displaySuccessMessage(context: ProjectContext): void {
  logger.newLine();
  logger.success(chalk.bold.green('✨ Project created successfully!'));
  logger.newLine();

  logger.info(chalk.bold('Next steps:'));
  logger.info(`  ${chalk.cyan('cd')} ${context.projectName}`);

  if (context.framework === 'react') {
    logger.info(
      `  ${chalk.cyan(getPackageManagerCommand(context.packageManager, 'run dev'))} - Start dev server`
    );
  } else {
    logger.info(
      `  ${chalk.cyan(getPackageManagerCommand(context.packageManager, 'run dev'))} - Start dev server`
    );
  }

  logger.newLine();
  logger.info(chalk.dim('Happy coding! 🚀'));
}

function getPackageManagerCommand(pm: string, command: string): string {
  if (pm === 'npm') {
    return `npm ${command}`;
  } else if (pm === 'yarn') {
    return `yarn ${command.replace('run ', '')}`;
  } else {
    return `pnpm ${command.replace('run ', '')}`;
  }
}

main();
