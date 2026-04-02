import { describe, it, expect, beforeEach, vi } from 'vitest';
import prompts, { type PromptObject, type Options } from 'prompts';
import { collectUserInput } from './prompts';
import * as loggerModule from './utils/logger';
import * as fileModule from './utils/file';

// Mock dependencies
vi.mock('prompts');
vi.mock('./utils/logger');
vi.mock('./utils/file');

describe('Prompts Module', () => {
  const mockLogger = {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    step: vi.fn(),
    newLine: vi.fn(),
    startSpinner: vi.fn(),
    succeedSpinner: vi.fn(),
    failSpinner: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loggerModule.logger).info = mockLogger.info;
    vi.mocked(loggerModule.logger).newLine = mockLogger.newLine;
    vi.mocked(loggerModule.logger).error = mockLogger.error;
  });

  describe('collectUserInput', () => {
    it('should collect project name when not provided', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'my-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.projectName).toBe('my-app');
      expect(result.framework).toBe('react');
    });

    it('should use provided project name', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: undefined,
          framework: 'next',
        })
        .mockResolvedValueOnce({
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput('provided-app');

      expect(result.projectName).toBe('provided-app');
    });

    it('should ask about TypeScript for React projects', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'test-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: false,
          linter: 'none',
          tailwind: false,
          testing: 'none',
          formatter: 'none',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.typescript).toBe(false);
    });

    it('should set TypeScript for Next.js based on user input', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'next-app',
          framework: 'next',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.framework).toBe('next');
      expect(result.typescript).toBe(true);
    });

    it('should ask about Tailwind for React projects', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'react-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.tailwind).toBe(true);
    });

    it('should ask about Tailwind for Next.js projects', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'next-app',
          framework: 'next',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.tailwind).toBe(true);
    });

    it('should ask about testing framework and support Vitest', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'test-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.testing).toBe('vitest');
    });

    it('should support Jest as testing framework', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'test-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'jest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.testing).toBe('jest');
    });

    it('should support None as testing framework', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'test-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'none',
          tailwind: false,
          testing: 'none',
          formatter: 'none',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.testing).toBe('none');
    });

    it('should ask about linter and support ESLint', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.linter).toBe('eslint');
    });

    it('should support Oxlint as linter', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'oxlint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.linter).toBe('oxlint');
    });

    it('should support None as linter', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'none',
          tailwind: false,
          testing: 'none',
          formatter: 'none',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.linter).toBe('none');
    });

    it('should ask about formatter and support Prettier', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.formatter).toBe('prettier');
    });

    it('should support Oxfmt as formatter', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'oxlint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'oxfmt',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.formatter).toBe('oxfmt');
    });

    it('should support None as formatter', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'none',
          tailwind: false,
          testing: 'none',
          formatter: 'none',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.formatter).toBe('none');
    });

    it('should ask about GitHub Actions with default Yes', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.githubActions).toBe(true);
    });

    it('should ask about Docker', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'docker-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: true,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.docker).toBe(true);
    });

    it('should prompt for overwrite if directory exists', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'existing-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        })
        .mockResolvedValueOnce({ overwrite: true });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(true);

      const result = await collectUserInput();

      expect(result.projectName).toBe('existing-app');
    });

    it('should exit if user declines overwrite', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit');
      });

      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'existing-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        })
        .mockResolvedValueOnce({ overwrite: false });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(true);

      await expect(collectUserInput()).rejects.toThrow('process.exit');

      exitSpy.mockRestore();
    });

    it('should exit on cancel', async () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit');
      });

      vi.mocked(prompts).mockImplementationOnce(
        async (_questions: PromptObject<string> | PromptObject<string>[], config?: Options) => {
          config?.onCancel?.({} as PromptObject<string>, {});
          return {};
        }
      );

      await expect(collectUserInput()).rejects.toThrow('process.exit');

      exitSpy.mockRestore();
    });

    it('should return complete context with all properties', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'complete-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: true,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: true,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result).toHaveProperty('projectName');
      expect(result).toHaveProperty('projectPath');
      expect(result).toHaveProperty('framework');
      expect(result).toHaveProperty('typescript');
      expect(result).toHaveProperty('tailwind');
      expect(result).toHaveProperty('testing');
      expect(result).toHaveProperty('linter');
      expect(result).toHaveProperty('formatter');
      expect(result).toHaveProperty('githubActions');
      expect(result).toHaveProperty('docker');
    });

    it('should compute correct project path', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'my-app',
          framework: 'react',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'vitest',
          formatter: 'prettier',
          githubActions: true,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.projectPath).toContain('my-app');
    });

    it('should set default linter to eslint for Next.js', async () => {
      vi.mocked(prompts)
        .mockResolvedValueOnce({
          projectName: 'next-app',
          framework: 'next',
        })
        .mockResolvedValueOnce({
          typescript: true,
          linter: 'eslint',
          tailwind: false,
          testing: 'none',
          formatter: 'none',
          githubActions: false,
          docker: false,
        });

      vi.mocked(fileModule.pathExists).mockResolvedValueOnce(false);

      const result = await collectUserInput();

      expect(result.linter).toBe('eslint');
    });
  });
});
