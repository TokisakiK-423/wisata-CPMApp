import * as fs from 'fs';
import * as path from 'path';

export const FILE_CONFIG = {
  PUBLIC_DIR: process.env.PUBLIC_DIR || 'public',
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/uploads/',
};

export const buildFilePath = (url: string): string => {
  return path.join(process.cwd(), FILE_CONFIG.PUBLIC_DIR, url);
};

export const deleteFileIfExists = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

export const deleteGaleriFiles = (galeri: { url: string }[]): void => {
  for (const g of galeri) {
    const filePath = buildFilePath(g.url);
    deleteFileIfExists(filePath);
  }
};

export const generateUploadUrl = (filename: string): string => {
  return `${FILE_CONFIG.UPLOAD_DIR}${filename}`;
};
