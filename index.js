var ExifImage = require('exif').ExifImage;
var Jimp = require('jimp');
var fs = require('fs');
var path = require('path');

const baseOriginPath = 'images_to_do';
const baseOutputPath = 'done_images';

const imageNames = fs.readdirSync(baseOriginPath);



const processImage = (imageName) => {
 var loadedImage;
 const imagePath = path.join(baseOriginPath, imageName);
 const outputPath = path.join(baseOutputPath, imageName);
 let imageDate = '';
 let dateY = '';
 let dateX = '';
 let shouldFlip = false;
 try {
    new ExifImage({ image :  imagePath}, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message);
        else
            console.log(imagePath);
            imageDate = exifData.exif.DateTimeOriginal;
            dateX = exifData.image.ImageWidth;
            dateY = exifData.image.ImageHeight;
            console.log("width: " + exifData.image.ImageWidth);
            console.log("height: " + exifData.image.ImageHeight);
            console.log("positionX: " + dateX);
            console.log("positionY: " + dateY);
            shouldFlip = exifData.image.Orientation === 6;
            console.log('shouldFlip', shouldFlip);
    });
 } catch (error) {
     console.log('Error: ' + error.message);
 }

 Jimp.read(imagePath)
    .then(function (image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    })
    .then(function (font) {

     if (shouldFlip) {
      loadedImage.print(font, (dateY/3) * 2, dateX - 400, imageDate)
      loadedImage.rotate(90);
     } else {
      loadedImage.print(font, (dateX/3) * 2, dateY - 400, imageDate)
     }
       loadedImage.write(outputPath);
    })
    .catch(function (err) {
        console.error(err);
    });
};

if (!fs.existsSync('done_images')) {
 fs.mkdirSync('done_images');
}
if (!fs.existsSync('images_to_do')) {
 fs.mkdirSync('images_to_do');
}

imageNames.forEach(image => {
 processImage(image);
})
