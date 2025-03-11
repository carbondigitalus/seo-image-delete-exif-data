// Core Modules
const path = require('path');

// NPM Modules
const gulp = require('gulp');
const del = require('del');

// Define the path to the image directory
const IMG_DIR = path.join(__dirname, 'src/img');

// Gulp Task: Remove all images ending in "_original"
gulp.task('clean-original-images', async () => {
  const deletedFiles = await del([`${IMG_DIR}/**/*_original.*`], { force: true });

  if (deletedFiles.length) {
    console.log(`Deleted ${deletedFiles.length} files:`);
    deletedFiles.forEach((file) => console.log(`- ${file}`));
  } else {
    console.log('No _original files found.');
  }
});
