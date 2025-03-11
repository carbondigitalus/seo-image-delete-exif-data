// Core Modules
const path = require('path');
const fs = require('fs');

// NPM Modules
const gulp = require('gulp');

gulp.task('clean-original-images', async () => {
  const del = (await import('del')).deleteAsync; // Dynamic import
  const IMG_DIR = path.join(__dirname, 'src/img');

  // Search for matching files before deleting
  const filesToDelete = [];

  function scanDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath); // Recursively scan subdirectories
      } else {
        console.log(`Checking file: ${file}`);

        // Match files ending in `_original` (AFTER the extension)
        if (file.endsWith('_original')) {
          console.log(`  ➜ Match found: ${fullPath}`);
          filesToDelete.push(fullPath);
        }
      }
    });
  }

  scanDirectory(IMG_DIR);

  if (filesToDelete.length) {
    console.log(`Found ${filesToDelete.length} matching files:`);
    filesToDelete.forEach((file) => console.log(`- ${file}`));

    const deletedFiles = await del(filesToDelete, { force: true });

    console.log(`Deleted ${deletedFiles.length} files.`);
  } else {
    console.log('No _original files found.');
  }
});
