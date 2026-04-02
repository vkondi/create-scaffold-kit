import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ProjectContext } from '../context';
import { logger } from '../utils/logger';
import { writeFile, joinPath } from '../utils/file';
import { addDevDependencies, addScripts } from '../utils/packageJson';
import { setupOxlint } from './oxlint';

// Mock dependencies
vi.mock('../utils/logger');
vi.mock('../utils/file');
vi.mock('../utils/packageJson');

describe('Oxlint Feature Setup', () => {
  const mockContext: ProjectContext = {
    projectName: 'test-project',
    projectPath: '/test/project',
    framework: 'react',
    typescript: true,
    linter: 'oxlint',
    formatter: 'prettier',
    tailwind: true,
    testing: 'vitest',
    githubActions: true,
    docker: true,
    packageManager: 'npm',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(logger.startSpinner).mockImplementation(() => {});
    vi.mocked(logger.succeedSpinner).mockImplementation(() => {});
    vi.mocked(logger.failSpinner).mockImplementation(() => {});
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(joinPath).mockImplementation((...args: string[]) => args.join('/'));
    vi.mocked(addDevDependencies).mockResolvedValue(undefined);
    vi.mocked(addScripts).mockResolvedValue(undefined);
  });

  describe('setupOxlint', () => {
    it('should setup Oxlint successfully', async () => {
      await setupOxlint(mockContext);

      expect(vi.mocked(logger.startSpinner)).toHaveBeenCalledWith('Setting up Oxlint...');
      expect(vi.mocked(logger.succeedSpinner)).toHaveBeenCalledWith('Oxlint configured');
    });

    it('should install oxlint dependency', async () => {
      await setupOxlint(mockContext);

      expect(vi.mocked(addDevDependencies)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          oxlint: expect.any(String),
        })
      );
    });

    it('should add lint scripts', async () => {
      await setupOxlint(mockContext);

      expect(vi.mocked(addScripts)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          lint: expect.stringContaining('oxlint'),
          'lint:fix': expect.stringContaining('oxlint'),
        })
      );
    });

    it('should add --fix flag to lint:fix script', async () => {
      await setupOxlint(mockContext);

      const scriptCall = vi.mocked(addScripts).mock.calls[0];
      expect(scriptCall[1]['lint:fix']).toContain('--fix');
    });

    it('should create .oxlintrc.json config file', async () => {
      await setupOxlint(mockContext);

      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.stringContaining('.oxlintrc.json'),
        expect.any(String)
      );
    });

    it('should handle setup errors', async () => {
      const error = new Error('Setup failed');
      vi.mocked(addDevDependencies).mockRejectedValueOnce(error);

      await expect(setupOxlint(mockContext)).rejects.toThrow('Setup failed');
      expect(vi.mocked(logger.failSpinner)).toHaveBeenCalledWith('Failed to setup Oxlint');
    });
  });

  describe('Oxlint Config', () => {
    it('should include React plugins for React projects', async () => {
      const reactContext = { ...mockContext, framework: 'react' as const };

      await setupOxlint(reactContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.plugins).toContain('react');
      expect(config.plugins).toContain('react-hooks');
    });

    it('should include TypeScript plugin when TypeScript is enabled', async () => {
      const tsContext = { ...mockContext, typescript: true };

      await setupOxlint(tsContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.plugins).toContain('typescript');
    });

    it('should not include TypeScript plugin when TypeScript is disabled', async () => {
      const noTsContext = { ...mockContext, typescript: false };

      await setupOxlint(noTsContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.plugins).not.toContain('typescript');
    });

    it('should not include React plugins for Next.js projects', async () => {
      const nextContext = { ...mockContext, framework: 'next' as const };

      await setupOxlint(nextContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.plugins).not.toContain('react');
    });

    it('should include ignore_patterns', async () => {
      await setupOxlint(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.ignore_patterns).toContain('node_modules');
      expect(config.ignore_patterns).toContain('dist');
    });
  });
});
