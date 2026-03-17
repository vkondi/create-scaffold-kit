import { describe, it, expect, beforeEach, vi } from 'vitest';
import { execa } from 'execa';
import type { ProjectContext } from '../context';
import { detectPackageManager, installDependencies, runCommand, initGit } from './install';
import * as loggerModule from './logger';

// Mock execa and logger
vi.mock('execa');
vi.mock('./logger');

describe('Install Utils', () => {
  const mockContext: ProjectContext = {
    projectName: 'test-app',
    projectPath: '/test/project',
    framework: 'react',
    typescript: true,
    tailwind: false,
    testing: 'vitest',
    lintingMode: 'strict',
    githubActions: false,
    docker: false,
    packageManager: 'npm',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('detectPackageManager', () => {
    it('should detect pnpm first if available', async () => {
      vi.mocked(execa).mockImplementationOnce((async () => ({
        stdout: '8.0.0',
      })) as unknown as typeof execa);

      const result = await detectPackageManager();

      expect(result).toBe('pnpm');
      expect(execa).toHaveBeenCalledWith('pnpm', ['--version']);
    });

    it('should detect yarn if pnpm is not available', async () => {
      vi.mocked(execa)
        .mockRejectedValueOnce(new Error('pnpm not found'))
        .mockImplementationOnce((async () => ({ stdout: '1.22.0' })) as unknown as typeof execa);

      const result = await detectPackageManager();

      expect(result).toBe('yarn');
    });

    it('should default to npm if neither pnpm nor yarn is available', async () => {
      vi.mocked(execa)
        .mockRejectedValueOnce(new Error('pnpm not found'))
        .mockRejectedValueOnce(new Error('yarn not found'));

      const result = await detectPackageManager();

      expect(result).toBe('npm');
    });

    it('should call execa with correct arguments', async () => {
      vi.mocked(execa)
        .mockRejectedValueOnce(new Error('not found'))
        .mockRejectedValueOnce(new Error('not found'));

      await detectPackageManager();

      expect(execa).toHaveBeenCalledWith('pnpm', ['--version']);
      expect(execa).toHaveBeenCalledWith('yarn', ['--version']);
    });
  });

  describe('installDependencies', () => {
    it('should install dependencies with npm', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);
      const context: ProjectContext = {
        ...mockContext,
        packageManager: 'npm',
      };

      await installDependencies(context);

      expect(loggerModule.logger.startSpinner).toHaveBeenCalledWith(
        'Installing dependencies with npm...'
      );
      expect(execa).toHaveBeenCalledWith('npm', ['install'], {
        cwd: '/test/project',
        stdio: 'pipe',
      });
    });

    it('should install dependencies with yarn', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);
      const context: ProjectContext = {
        ...mockContext,
        packageManager: 'yarn',
      };

      await installDependencies(context);

      expect(execa).toHaveBeenCalledWith('yarn', ['install'], {
        cwd: '/test/project',
        stdio: 'pipe',
      });
    });

    it('should install dependencies with pnpm', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);
      const context: ProjectContext = {
        ...mockContext,
        packageManager: 'pnpm',
      };

      await installDependencies(context);

      expect(execa).toHaveBeenCalledWith('pnpm', ['install'], {
        cwd: '/test/project',
        stdio: 'pipe',
      });
    });

    it('should show success message on completion', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);

      await installDependencies(mockContext);

      expect(loggerModule.logger.succeedSpinner).toHaveBeenCalledWith(
        'Dependencies installed successfully'
      );
    });

    it('should handle installation errors', async () => {
      const error = new Error('Installation failed');
      vi.mocked(execa).mockRejectedValueOnce(error);

      await expect(installDependencies(mockContext)).rejects.toThrow('Installation failed');
      expect(loggerModule.logger.failSpinner).toHaveBeenCalledWith(
        'Failed to install dependencies'
      );
    });
  });

  describe('runCommand', () => {
    it('should run command with description', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);

      await runCommand('git', ['init'], '/test/project', 'Initializing git');

      expect(loggerModule.logger.startSpinner).toHaveBeenCalledWith('Initializing git');
      expect(execa).toHaveBeenCalledWith('git', ['init'], {
        cwd: '/test/project',
        stdio: 'pipe',
      });
      expect(loggerModule.logger.succeedSpinner).toHaveBeenCalledWith('Initializing git');
    });

    it('should run command without description', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);

      await runCommand('npm', ['list'], '/test/project');

      expect(loggerModule.logger.startSpinner).not.toHaveBeenCalled();
      expect(execa).toHaveBeenCalledWith('npm', ['list'], {
        cwd: '/test/project',
        stdio: 'pipe',
      });
    });

    it('should handle command execution errors', async () => {
      const error = new Error('Command failed');
      vi.mocked(execa).mockRejectedValueOnce(error as unknown as Awaited<ReturnType<typeof execa>>);

      await expect(
        runCommand('git', ['init'], '/test/project', 'Initializing git')
      ).rejects.toThrow('Command failed');
      expect(loggerModule.logger.failSpinner).toHaveBeenCalledWith('Failed: Initializing git');
    });

    it('should pass correct cwd to execa', async () => {
      vi.mocked(execa).mockResolvedValueOnce({
        isCanceled: false,
        stdout: '',
      } as unknown as Awaited<ReturnType<typeof execa>>);
      const customPath = '/custom/path';

      await runCommand('npm', ['run', 'build'], customPath);

      const callArgs = vi.mocked(execa).mock.calls[0] as unknown[];
      expect((callArgs[2] as unknown as Record<string, unknown>).cwd).toBe(customPath);
    });
  });

  describe('initGit', () => {
    it('should initialize git repository', async () => {
      vi.mocked(execa)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '2.40.0' } as unknown as Awaited<
          ReturnType<typeof execa>
        >) // git --version
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >) // git init
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >) // git add
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >); // git commit

      await initGit('/test/project');

      expect(execa).toHaveBeenCalledWith('git', ['--version']);
      expect(execa).toHaveBeenCalledWith('git', ['init'], { cwd: '/test/project' });
      expect(execa).toHaveBeenCalledWith('git', ['add', '.'], { cwd: '/test/project' });
      expect(execa).toHaveBeenCalledWith(
        'git',
        ['commit', '-m', 'Initial commit from create-vkondi-app'],
        {
          cwd: '/test/project',
        }
      );
    });

    it('should show success message when git is initialized', async () => {
      vi.mocked(execa)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '2.40.0' } as unknown as Awaited<
          ReturnType<typeof execa>
        >)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '' } as unknown as Awaited<
          ReturnType<typeof execa>
        >);

      await initGit('/test/project');

      expect(loggerModule.logger.success).toHaveBeenCalledWith('Git repository initialized');
    });

    it('should handle git not being installed', async () => {
      vi.mocked(execa).mockRejectedValueOnce(new Error('git not found'));

      await initGit('/test/project');

      expect(loggerModule.logger.warning).toHaveBeenCalledWith(
        'Git not found, skipping repository initialization'
      );
    });

    it('should handle errors during git operations gracefully', async () => {
      vi.mocked(execa)
        .mockResolvedValueOnce({ isCanceled: false, stdout: '2.40.0' } as unknown as Awaited<
          ReturnType<typeof execa>
        >)
        .mockRejectedValueOnce(new Error('fatal: already a git repository'));

      // initGit catches errors and doesn't re-throw, so it should complete without throwing
      await expect(initGit('/test/project')).resolves.toBeUndefined();
    });
  });
});
