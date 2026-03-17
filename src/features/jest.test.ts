import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ProjectContext } from '../context';
import { logger } from '../utils/logger';
import { writeFile, joinPath, ensureDir } from '../utils/file';
import { addDevDependencies, addScripts } from '../utils/packageJson';
import { setupJest } from './jest';

// Mock dependencies
vi.mock('../utils/logger');
vi.mock('../utils/file');
vi.mock('../utils/packageJson');

describe('Jest Feature Setup', () => {
  const mockContext: ProjectContext = {
    projectName: 'test-project',
    projectPath: '/test/project',
    framework: 'react',
    typescript: true,
    linter: 'eslint',
    formatter: 'prettier',
    tailwind: true,
    testing: 'jest',
    githubActions: true,
    docker: true,
    packageManager: 'npm',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(logger.step).mockImplementation(() => {});
    vi.mocked(logger.success).mockImplementation(() => {});
    vi.mocked(logger.error).mockImplementation(() => {});
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(joinPath).mockImplementation((...args: string[]) => args.join('/'));
    vi.mocked(ensureDir).mockResolvedValue(undefined);
    vi.mocked(addDevDependencies).mockResolvedValue(undefined);
    vi.mocked(addScripts).mockResolvedValue(undefined);
  });

  describe('setupJest', () => {
    it('should setup Jest successfully', async () => {
      await setupJest(mockContext);

      expect(vi.mocked(logger.step)).toHaveBeenCalledWith('Setting up Jest...');
      expect(vi.mocked(logger.success)).toHaveBeenCalledWith('Jest configured');
    });

    it('should install jest dependency', async () => {
      await setupJest(mockContext);

      expect(vi.mocked(addDevDependencies)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          jest: expect.any(String),
          '@types/jest': expect.any(String),
        })
      );
    });

    it('should install ts-jest for TypeScript projects', async () => {
      const tsContext = { ...mockContext, typescript: true };

      await setupJest(tsContext);

      const callArgs = vi.mocked(addDevDependencies).mock.calls[0];
      expect(callArgs[1]).toHaveProperty('ts-jest');
    });

    it('should install babel-jest for non-TypeScript projects', async () => {
      const jsContext = { ...mockContext, typescript: false };

      await setupJest(jsContext);

      const callArgs = vi.mocked(addDevDependencies).mock.calls[0];
      expect(callArgs[1]).toHaveProperty('babel-jest');
      expect(callArgs[1]).toHaveProperty('@babel/core');
    });

    it('should install React Testing Library for React projects', async () => {
      const reactContext = { ...mockContext, framework: 'react' as const };

      await setupJest(reactContext);

      const callArgs = vi.mocked(addDevDependencies).mock.calls[0];
      expect(callArgs[1]).toHaveProperty('@testing-library/react');
      expect(callArgs[1]).toHaveProperty('@testing-library/jest-dom');
      expect(callArgs[1]).toHaveProperty('jest-environment-jsdom');
    });

    it('should not install React Testing Library for Next.js projects', async () => {
      const nextContext = { ...mockContext, framework: 'next' as const };

      await setupJest(nextContext);

      const callArgs = vi.mocked(addDevDependencies).mock.calls[0];
      expect(callArgs[1]).not.toHaveProperty('@testing-library/react');
    });

    it('should create Jest config file', async () => {
      await setupJest(mockContext);

      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.stringContaining('jest.config'),
        expect.any(String)
      );
    });

    it('should create jest.config.ts for TypeScript projects', async () => {
      const tsContext = { ...mockContext, typescript: true };

      await setupJest(tsContext);

      expect(vi.mocked(joinPath)).toHaveBeenCalledWith(expect.any(String), 'jest.config.ts');
    });

    it('should create jest.config.js for non-TypeScript projects', async () => {
      const jsContext = { ...mockContext, typescript: false };

      await setupJest(jsContext);

      expect(vi.mocked(joinPath)).toHaveBeenCalledWith(expect.any(String), 'jest.config.js');
    });

    it('should add test scripts', async () => {
      await setupJest(mockContext);

      expect(vi.mocked(addScripts)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          test: expect.stringContaining('jest'),
          'test:watch': expect.stringContaining('--watch'),
          'test:coverage': expect.stringContaining('--coverage'),
        })
      );
    });

    it('should handle setup errors', async () => {
      const error = new Error('Setup failed');
      vi.mocked(addDevDependencies).mockRejectedValueOnce(error);

      await expect(setupJest(mockContext)).rejects.toThrow('Setup failed');
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Failed to setup Jest');
    });
  });

  describe('Jest Config', () => {
    it('should use jsdom environment for React projects', async () => {
      const reactContext = { ...mockContext, framework: 'react' as const };

      await setupJest(reactContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = configCall[1] as string;

      expect(config).toContain('jsdom');
    });

    it('should use node environment for non-React projects', async () => {
      const nextContext = { ...mockContext, framework: 'next' as const };

      await setupJest(nextContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = configCall[1] as string;

      expect(config).toContain('node');
    });

    it('should include coverage configuration', async () => {
      await setupJest(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = configCall[1] as string;

      expect(config).toContain('coverage');
    });

    it('should include moduleNameMapper for path aliases', async () => {
      await setupJest(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = configCall[1] as string;

      expect(config).toContain('moduleNameMapper');
    });
  });

  describe('Test Scripts', () => {
    it('should include test script', async () => {
      await setupJest(mockContext);

      const scriptCall = vi.mocked(addScripts).mock.calls[0];
      expect(scriptCall[1]).toHaveProperty('test');
    });

    it('should include test:watch script', async () => {
      await setupJest(mockContext);

      const scriptCall = vi.mocked(addScripts).mock.calls[0];
      expect(scriptCall[1]).toHaveProperty('test:watch');
      expect(scriptCall[1]['test:watch']).toContain('--watch');
    });

    it('should include test:coverage script', async () => {
      await setupJest(mockContext);

      const scriptCall = vi.mocked(addScripts).mock.calls[0];
      expect(scriptCall[1]).toHaveProperty('test:coverage');
      expect(scriptCall[1]['test:coverage']).toContain('--coverage');
    });
  });
});
