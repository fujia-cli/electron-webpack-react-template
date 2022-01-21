import fs from 'fs';
import { readFile, writeFile, rename, unlink, access } from 'fs/promises';

export const read = async (path: string, encoding: BufferEncoding) =>
  await readFile(path, {
    encoding: encoding || 'utf-8',
  });

export const write = async (path: string, content: string, encoding: BufferEncoding) =>
  await writeFile(path, content, {
    encoding: encoding || 'utf-8',
  });

export const renameFile = async (oldPath: string, newPath: string) => await rename(oldPath, newPath);

export const deleteFile = async (path: string) => await unlink(path);

export const isExist = async (path: string) => {
  try {
    await access(path, fs.constants.F_OK);

    return true;
  } catch (error) {
    return false;
  }
};

export const canWrite = async (path: string) => {
  try {
    await access(path, fs.constants.W_OK);

    return true;
  } catch (error) {
    return false;
  }
};

export const canRead = async (path: string) => {
  try {
    await access(path, fs.constants.R_OK);

    return true;
  } catch (error) {
    return false;
  }
};
