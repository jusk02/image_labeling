var ExifImage = require('exif').ExifImage;
var Jimp = require('jimp');
var fs = require('fs');
var path = require('path');

const baseOriginPath = 'images_to_do';
const baseOutputPath = 'done_images';

const imageNames = fs.readdirSync(baseOriginPath).filter(image => !image.match('.DS_Store'));

const formatDate = (rawString) => {

    const [rawDate, rawTime] = rawString.split(' ');
    const cleanDate = rawDate.replaceAll(':','-');

    const cleanTime = `T${rawTime}`

    const date = new Date(cleanDate+cleanTime);

    date.setHours(date.getHours() + 9);
    const deformatedString = date.toLocaleString('es-CO');
    return deformatedString;
}

function jimpStuff(imagePath) {
    return Jimp.read(imagePath)
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
  }


const processImage = async (imageName) => {
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
            console.log(exifData.exif.DateTimeOriginal)
            imageDate = formatDate(exifData.exif.DateTimeOriginal);
            dateX = exifData.exif.ExifImageWidth;
            dateY = exifData.exif.ExifImageHeight;
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

    return true;
};

if (!fs.existsSync('done_images')) {
 fs.mkdirSync('done_images');
}
if (!fs.existsSync('images_to_do')) {
 fs.mkdirSync('images_to_do');
}


imageNames.forEach(async image => {
    console.log("image", image);
    await processImage(image);
})





