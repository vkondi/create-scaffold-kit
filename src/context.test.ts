import { describe, it, expect } from 'vitest';
import type { ProjectContext } from './context';

describe('ProjectContext Type', () => {
  it('should have all required fields', () => {
    const mockContext: ProjectContext = {
      projectName: 'test-app',
      projectPath: '/home/user/test-app',
      framework: 'react',
      typescript: true,
      tailwind: true,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: true,
      docker: true,
      packageManager: 'npm',
    };

    expect(mockContext.projectName).toBe('test-app');
    expect(mockContext.framework).toBe('react');
    expect(mockContext.typescript).toBe(true);
    expect(mockContext.tailwind).toBe(true);
    expect(mockContext.testing).toBe('vitest');
    expect(mockContext.linter).toBe('eslint');
    expect(mockContext.formatter).toBe('prettier');
    expect(mockContext.githubActions).toBe(true);
    expect(mockContext.docker).toBe(true);
  });

  it('should support next.js framework', () => {
    const nextContext: ProjectContext = {
      projectName: 'next-app',
      projectPath: '/home/user/next-app',
      framework: 'next',
      typescript: true,
      tailwind: false,
      testing: 'none',
      linter: 'eslint',
      formatter: 'none',
      githubActions: false,
      docker: false,
      packageManager: 'yarn',
    };

    expect(nextContext.framework).toBe('next');
    expect(nextContext.packageManager).toBe('yarn');
  });

  it('should support pnpm package manager', () => {
    const context: ProjectContext = {
      projectName: 'app',
      projectPath: '/app',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: true,
      docker: false,
      packageManager: 'pnpm',
    };

    expect(context.packageManager).toBe('pnpm');
  });

  it('should support all testing options', () => {
    const vitestContext: ProjectContext = {
      projectName: 'app1',
      projectPath: '/app1',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const jestContext: ProjectContext = {
      projectName: 'app2',
      projectPath: '/app2',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'jest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const noneContext: ProjectContext = {
      projectName: 'app3',
      projectPath: '/app3',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'none',
      linter: 'none',
      formatter: 'none',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    expect(vitestContext.testing).toBe('vitest');
    expect(jestContext.testing).toBe('jest');
    expect(noneContext.testing).toBe('none');
  });

  it('should support all linter options', () => {
    const eslintContext: ProjectContext = {
      projectName: 'app1',
      projectPath: '/app1',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const oxlintContext: ProjectContext = {
      projectName: 'app2',
      projectPath: '/app2',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'oxlint',
      formatter: 'prettier',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const noneLinterContext: ProjectContext = {
      projectName: 'app3',
      projectPath: '/app3',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'none',
      linter: 'none',
      formatter: 'none',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    expect(eslintContext.linter).toBe('eslint');
    expect(oxlintContext.linter).toBe('oxlint');
    expect(noneLinterContext.linter).toBe('none');
  });

  it('should support all formatter options', () => {
    const prettierContext: ProjectContext = {
      projectName: 'app1',
      projectPath: '/app1',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'prettier',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const oxfmtContext: ProjectContext = {
      projectName: 'app2',
      projectPath: '/app2',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'vitest',
      linter: 'eslint',
      formatter: 'oxfmt',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    const noneFormatterContext: ProjectContext = {
      projectName: 'app3',
      projectPath: '/app3',
      framework: 'react',
      typescript: true,
      tailwind: false,
      testing: 'none',
      linter: 'none',
      formatter: 'none',
      githubActions: false,
      docker: false,
      packageManager: 'npm',
    };

    expect(prettierContext.formatter).toBe('prettier');
    expect(oxfmtContext.formatter).toBe('oxfmt');
    expect(noneFormatterContext.formatter).toBe('none');
  });
});
