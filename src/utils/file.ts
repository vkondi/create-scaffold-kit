import fs from 'fs-extra';
import path from 'path';

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

export async function copyFile(source: string, destination: string): Promise<void> {
  await fs.copy(source, destination);
}

export async function pathExists(filePath: string): Promise<boolean> {
  return await fs.pathExists(filePath);
}

export async function removeFile(filePath: string): Promise<void> {
  await fs.remove(filePath);
}

export function joinPath(...paths: string[]): string {
  return path.join(...paths);
}

export function resolvePath(...paths: string[]): string {
  return path.resolve(...paths);
}

export async function readJsonFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath);
  return JSON.parse(content) as T;
}

export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  await writeFile(filePath, content);
}
