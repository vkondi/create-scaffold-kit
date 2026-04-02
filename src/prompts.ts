import prompts, { type PromptObject } from 'prompts';
import type { ProjectContext } from './context.js';
import { logger } from './utils/logger.js';
import { pathExists } from './utils/file.js';
import path from 'path';

export async function collectUserInput(projectName?: string): Promise<ProjectContext> {
  logger.info('Welcome to create-scaffold-kit! 🚀');
  logger.newLine();

  let questions: PromptObject<string>[] = [];

  if (!projectName) {
    questions.push({
      type: 'text' as const,
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-app',
      validate: (value: string) => (value.length > 0 ? true : 'Project name cannot be empty'),
    });
  }

  questions.push({
    type: 'select' as const,
    name: 'framework',
    message: 'Select a framework:',
    choices: [
      { title: 'React (Vite)', value: 'react' },
      { title: 'Next.js', value: 'next' },
    ],
    initial: 0,
  });

  // Get project name and framework first
  const answers = await prompts(questions, {
    onCancel: () => {
      logger.error('Operation cancelled');
      process.exit(1);
    },
  });

  const framework = answers.framework;
  questions = [];

  // Only ask about linting for React (Next.js has its own linter options)
  if (framework === 'react') {
    questions.push(
      {
        type: 'select' as const,
        name: 'typescript',
        message: 'Use TypeScript?',
        choices: [
          { title: 'Yes', value: true },
          { title: 'No', value: false },
        ],
        initial: 0,
      },
      {
        type: 'select' as const,
        name: 'linter',
        message: 'Select a linter:',
        choices: [
          { title: 'ESLint', value: 'eslint' },
          { title: 'Oxlint', value: 'oxlint' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      }
    );
  } else {
    questions.push(
      {
        type: 'select' as const,
        name: 'typescript',
        message: 'Use TypeScript?',
        choices: [
          { title: 'Yes', value: true },
          { title: 'No', value: false },
        ],
        initial: 0,
      },
      {
        type: 'select' as const,
        name: 'linter',
        message: 'Select a linter:',
        choices: [
          { title: 'ESLint', value: 'eslint' },
          { title: 'None', value: 'none' },
        ],
        initial: 0,
      }
    );
  }

  // Always ask about Tailwind
  questions.push({
    type: 'select' as const,
    name: 'tailwind',
    message: 'Add Tailwind CSS?',
    choices: [
      { title: 'Yes', value: true },
      { title: 'No', value: false },
    ],
    initial: 0,
  });

  questions.push(
    {
      type: 'select' as const,
      name: 'testing',
      message: 'Testing framework:',
      choices: [
        { title: 'Vitest', value: 'vitest' },
        { title: 'Jest', value: 'jest' },
        { title: 'None', value: 'none' },
      ],
      initial: 0,
    },
    {
      type: 'select' as const,
      name: 'formatter',
      message: 'Select a formatter:',
      choices: [
        { title: 'Prettier', value: 'prettier' },
        { title: 'Oxfmt', value: 'oxfmt' },
        { title: 'None', value: 'none' },
      ],
      initial: 0,
    },
    {
      type: 'select' as const,
      name: 'githubActions',
      message: 'Add GitHub Actions CI?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 0,
    },
    {
      type: 'select' as const,
      name: 'docker',
      message: 'Add Docker setup?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No', value: false },
      ],
      initial: 1,
    }
  );

  // Get remaining answers
  const moreAnswers = await prompts(questions, {
    onCancel: () => {
      logger.error('Operation cancelled');
      process.exit(1);
    },
  });

  Object.assign(answers, moreAnswers);

  const finalProjectName = projectName || answers.projectName;
  const projectPath = path.resolve(process.cwd(), finalProjectName);

  if (await pathExists(projectPath)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${finalProjectName} already exists. Overwrite?`,
      initial: false,
    });

    if (!overwrite) {
      logger.error('Operation cancelled');
      process.exit(1);
    }
  }

  return {
    projectName: finalProjectName,
    projectPath,
    framework: answers.framework,
    typescript: answers.typescript,
    tailwind: answers.tailwind,
    testing: answers.testing,
    linter: answers.linter,
    formatter: answers.formatter,
    githubActions: answers.githubActions,
    docker: answers.docker,
    packageManager: 'yarn', // Will be detected later
  };
}
