# SEO Image Delete EXIF Data

This is a really simple app. It quickly just deletes the EXIF data found in your images. Fortunately, it is recursive so you can use your entire image folder to clean up the EXIF data before you use it online.

## Where to put images?

Put all of the images in the `/src/img/` folder.

## How to run the app?

```zsh
npm run start:dev
```

## Clean Original Images

When you run the app, all of the images that are updated will clone the image and rename the original image by appending `_original` to the end of the image file extension. Use this Gulp task to delete all of those unwanted images.

```zsh
npm run clean-images
```
