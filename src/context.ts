export interface ProjectContext {
  projectName: string;
  projectPath: string;
  framework: 'react' | 'next';
  typescript: boolean;
  tailwind: boolean;
  testing: 'vitest' | 'none';
  lintingMode: 'strict' | 'standard';
  githubActions: boolean;
  docker: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
}
