import type { ProjectContext } from '../context.js';
import { logger } from '../utils/logger.js';
import { writeFile, joinPath, ensureDir } from '../utils/file.js';
import { addDevDependencies, addScripts } from '../utils/packageJson.js';

export async function setupJest(context: ProjectContext): Promise<void> {
  logger.startSpinner('Setting up Jest...');

  try {
    // Install dependencies
    const devDeps = getJestDependencies(context);
    await addDevDependencies(context.projectPath, devDeps);

    // Create Jest config
    await createJestConfig(context);

    // Create test setup file
    await createTestSetup(context);

    // Create example test
    await createExampleTest(context);

    // Add scripts
    await addScripts(context.projectPath, {
      test: 'jest',
      'test:watch': 'jest --watch',
      'test:coverage': 'jest --coverage',
    });

    logger.succeedSpinner('Jest configured');
  } catch (error) {
    logger.failSpinner('Failed to setup Jest');
    throw error;
  }
}

function getJestDependencies(context: ProjectContext): Record<string, string> {
  const deps: Record<string, string> = {
    jest: '^29.7.0',
    '@types/jest': '^29.5.12',
  };

  if (context.typescript) {
    deps['ts-jest'] = '^29.1.2';
  } else {
    deps['babel-jest'] = '^29.7.0';
    deps['@babel/core'] = '^7.24.0';
    deps['@babel/preset-env'] = '^7.24.0';
    if (context.framework === 'react') {
      deps['@babel/preset-react'] = '^7.23.3';
    }
  }

  if (context.framework === 'react') {
    deps['@testing-library/react'] = '^14.2.1';
    deps['@testing-library/jest-dom'] = '^6.4.2';
    deps['@testing-library/user-event'] = '^14.5.2';
    deps['jest-environment-jsdom'] = '^29.7.0';
  }

  return deps;
}

async function createJestConfig(context: ProjectContext): Promise<void> {
  const isReact = context.framework === 'react';
  const useTs = context.typescript;

  const config = `${useTs ? "import type { Config } from 'jest';" : ''}

const config${useTs ? ': Config' : ''} = {
  ${useTs ? "preset: 'ts-jest'," : ''}
  testEnvironment: '${isReact ? 'jsdom' : 'node'}',
  ${isReact ? "setupFilesAfterFramework: ['<rootDir>/src/test/setup.ts']," : ''}
  testMatch: [
    '**/__tests__/**/*.${useTs ? 'ts' : 'js'}${isReact ? 'x?' : ''}',
    '**/*.{spec,test}.${useTs ? 'ts' : 'js'}${isReact ? 'x?' : ''}',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{${useTs ? 'ts' : 'js'}${isReact ? ',tsx' : ''}}',
    '!src/test/**',
    '!**/*.{spec,test}.{${useTs ? 'ts' : 'js'}${isReact ? ',tsx' : ''}}',
  ],
  coverageReporters: ['text', 'json', 'html'],
};

export default config;
`;

  const configPath = joinPath(
    context.projectPath,
    context.typescript ? 'jest.config.ts' : 'jest.config.js'
  );
  await writeFile(configPath, config);
}

async function createTestSetup(context: ProjectContext): Promise<void> {
  const testDir = joinPath(context.projectPath, 'src', 'test');
  await ensureDir(testDir);

  let setupContent = '';

  if (context.framework === 'react') {
    setupContent = `import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
`;
  } else {
    setupContent = `// Global test setup
afterEach(() => {
  // Cleanup logic
});
`;
  }

  const ext = context.typescript ? 'ts' : 'js';
  await writeFile(joinPath(testDir, `setup.${ext}`), setupContent);
}

async function createExampleTest(context: ProjectContext): Promise<void> {
  const testDir = joinPath(context.projectPath, 'src', 'test');
  await ensureDir(testDir);

  const ext = context.typescript
    ? context.framework === 'react'
      ? 'tsx'
      : 'ts'
    : context.framework === 'react'
      ? 'jsx'
      : 'js';

  const exampleTest = `describe('Example test suite', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
`;

  await writeFile(joinPath(testDir, `example.test.${ext}`), exampleTest);
}
