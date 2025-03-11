// Core Modules
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// NPM Modules
import { exiftool } from 'exiftool-vendored';

// Promisify `fs.readdir` and `fs.stat`
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const directoryPath = path.join(__dirname, 'img');
let count = 0;

async function clearExifData(filePath: string): Promise<void> {
  try {
    await exiftool.deleteAllTags(filePath);
    count++;
    console.log(`(${count}) Cleared EXIF data for: ${filePath}`);
  } catch (error) {
    console.error(`Failed to clear EXIF data for ${filePath}:`, error);
  }
}

async function processDirectory(directoryPath: string): Promise<void> {
  try {
    const files = await readdir(directoryPath);
    const tasks = files.map(async (file) => {
      const fullPath = path.join(directoryPath, file);
      const fileStats = await stat(fullPath);

      if (fileStats.isDirectory()) {
        return processDirectory(fullPath);
      } else if (fileStats.isFile() && /\.(jpg|jpeg|png|tiff|webp)$/i.test(file)) {
        return clearExifData(fullPath);
      }
    });

    await Promise.all(tasks); // Wait for all tasks in the directory to complete
  } catch (error) {
    console.error(`Error processing directory: ${directoryPath}`, error);
  }
}

// Execute and track completion
(async () => {
  console.log('Starting EXIF data removal...');
  await processDirectory(directoryPath);
  console.log('All files processed.');
  await exiftool.end();
})();
