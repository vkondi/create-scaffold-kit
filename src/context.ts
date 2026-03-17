export interface ProjectContext {
  projectName: string;
  projectPath: string;
  framework: 'react' | 'next';
  typescript: boolean;
  tailwind: boolean;
  testing: 'vitest' | 'jest' | 'none';
  linter: 'eslint' | 'oxlint' | 'none';
  formatter: 'prettier' | 'oxfmt' | 'none';
  githubActions: boolean;
  docker: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
}
