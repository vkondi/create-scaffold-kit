import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ProjectContext } from '../context';
import { logger } from '../utils/logger';
import { writeFile, joinPath } from '../utils/file';
import { addDevDependencies, addScripts } from '../utils/packageJson';
import { setupOxfmt } from './oxfmt';

// Mock dependencies
vi.mock('../utils/logger');
vi.mock('../utils/file');
vi.mock('../utils/packageJson');

describe('Oxfmt Feature Setup', () => {
  const mockContext: ProjectContext = {
    projectName: 'test-project',
    projectPath: '/test/project',
    framework: 'react',
    typescript: true,
    linter: 'oxlint',
    formatter: 'oxfmt',
    tailwind: false,
    testing: 'vitest',
    githubActions: true,
    docker: false,
    packageManager: 'npm',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(logger.step).mockImplementation(() => {});
    vi.mocked(logger.success).mockImplementation(() => {});
    vi.mocked(logger.error).mockImplementation(() => {});
    vi.mocked(writeFile).mockResolvedValue(undefined);
    vi.mocked(joinPath).mockImplementation((...args: string[]) => args.join('/'));
    vi.mocked(addDevDependencies).mockResolvedValue(undefined);
    vi.mocked(addScripts).mockResolvedValue(undefined);
  });

  describe('setupOxfmt', () => {
    it('should setup Oxfmt successfully', async () => {
      await setupOxfmt(mockContext);

      expect(vi.mocked(logger.step)).toHaveBeenCalledWith('Setting up Oxfmt...');
      expect(vi.mocked(logger.success)).toHaveBeenCalledWith('Oxfmt configured');
    });

    it('should install oxfmt dependency', async () => {
      await setupOxfmt(mockContext);

      expect(vi.mocked(addDevDependencies)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          oxfmt: expect.any(String),
        })
      );
    });

    it('should add format scripts', async () => {
      await setupOxfmt(mockContext);

      expect(vi.mocked(addScripts)).toHaveBeenCalledWith(
        mockContext.projectPath,
        expect.objectContaining({
          format: expect.stringContaining('oxfmt'),
          'format:check': expect.stringContaining('oxfmt'),
        })
      );
    });

    it('should add check flag to format:check script', async () => {
      await setupOxfmt(mockContext);

      const scriptCall = vi.mocked(addScripts).mock.calls[0];
      expect(scriptCall[1]['format:check']).toContain('check');
    });

    it('should create .oxfmtrc.json config file', async () => {
      await setupOxfmt(mockContext);

      expect(vi.mocked(writeFile)).toHaveBeenCalledWith(
        expect.stringContaining('.oxfmtrc.json'),
        expect.any(String)
      );
    });

    it('should handle setup errors', async () => {
      const error = new Error('Setup failed');
      vi.mocked(addDevDependencies).mockRejectedValueOnce(error);

      await expect(setupOxfmt(mockContext)).rejects.toThrow('Setup failed');
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Failed to setup Oxfmt');
    });
  });

  describe('Oxfmt Config', () => {
    it('should configure printWidth', async () => {
      await setupOxfmt(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config).toHaveProperty('printWidth');
      expect(config.printWidth).toBe(100);
    });

    it('should configure tabWidth', async () => {
      await setupOxfmt(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.tabWidth).toBe(2);
    });

    it('should enable singleQuote', async () => {
      await setupOxfmt(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.singleQuote).toBe(true);
    });

    it('should configure endOfLine to lf', async () => {
      await setupOxfmt(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.endOfLine).toBe('lf');
    });

    it('should configure trailingComma', async () => {
      await setupOxfmt(mockContext);

      const configCall = vi.mocked(writeFile).mock.calls[0];
      const config = JSON.parse(configCall[1] as string);

      expect(config.trailingComma).toBe('es5');
    });
  });
});
