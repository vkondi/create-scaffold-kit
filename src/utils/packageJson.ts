import { readJsonFile, writeJsonFile, joinPath } from './file.js';

export interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  type?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export async function readPackageJson(projectPath: string): Promise<PackageJson> {
  const packageJsonPath = joinPath(projectPath, 'package.json');
  return await readJsonFile<PackageJson>(packageJsonPath);
}

export async function writePackageJson(projectPath: string, data: PackageJson): Promise<void> {
  const packageJsonPath = joinPath(projectPath, 'package.json');
  await writeJsonFile(packageJsonPath, data);
}

export async function addDependencies(
  projectPath: string,
  dependencies: Record<string, string>
): Promise<void> {
  const packageJson = await readPackageJson(projectPath);
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...dependencies,
  };
  await writePackageJson(projectPath, packageJson);
}

export async function addDevDependencies(
  projectPath: string,
  devDependencies: Record<string, string>
): Promise<void> {
  const packageJson = await readPackageJson(projectPath);
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDependencies,
  };
  await writePackageJson(projectPath, packageJson);
}

export async function addScripts(
  projectPath: string,
  scripts: Record<string, string>
): Promise<void> {
  const packageJson = await readPackageJson(projectPath);
  packageJson.scripts = {
    ...packageJson.scripts,
    ...scripts,
  };
  await writePackageJson(projectPath, packageJson);
}

export async function updatePackageJsonField(
  projectPath: string,
  field: string,
  value: unknown
): Promise<void> {
  const packageJson = await readPackageJson(projectPath);
  packageJson[field] = value;
  await writePackageJson(projectPath, packageJson);
}
