// Core Modules
import * as fs from 'fs';
import * as path from 'path';

// NPM Modules
import { exiftool } from 'exiftool-vendored';

const directoryPath = path.join(__dirname, 'img'); // Replace with your image directory
let count = 0;

async function clearExifData(filePath: string) {
  try {
    // Using the 'deleteAllTags' method which is not deprecated
    await exiftool.deleteAllTags(filePath);
    console.log('Image Count: ', (count += 1));
    console.log(`Cleared EXIF data for ${filePath}`);
  } catch (error) {
    console.error(`Failed to clear EXIF data for ${filePath}:`, error);
  }
}

function processDirectory(directoryPath: string) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Unable to read directory: ${directoryPath}`, err);
      return;
    }

    files.forEach((file) => {
      const fullPath = path.join(directoryPath, file);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(`Unable to stat file: ${fullPath}`, err);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(fullPath);
        } else if (stats.isFile() && /\.(jpg|jpeg|png|tiff|webp)$/i.test(file)) {
          clearExifData(fullPath);
        }
      });
    });
  });
}

processDirectory(directoryPath);

process.on('exit', () => {
  exiftool.end();
});
