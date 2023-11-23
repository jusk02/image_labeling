var ExifImage = require('exif').ExifImage;
var Jimp = require('jimp');
var fs = require('fs');
var path = require('path');

const baseOriginPath = 'images_to_do';
const baseOutputPath = 'done_images';

const pos = Number(process.argv[2])

console.log(pos);

const formatDate = (rawString) => {

 const [rawDate, rawTime] = rawString.split(' ');
 const cleanDate = rawDate.replaceAll(':','-');

 const cleanTime = `T${rawTime}`

 const date = new Date(cleanDate+cleanTime);

//  date.setHours(date.getHours() + 9);
 const deformatedString = date.toLocaleString('es-CO');
 return deformatedString;
}

 var jimpStuff = function (imageName) {
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
           imageDate = formatDate(exifData.exif.DateTimeOriginal);
           dateX = exifData.exif.ExifImageWidth;
           dateY = exifData.exif.ExifImageHeight;
           shouldFlip = exifData.image.Orientation === 6;
   });
} catch (error) {
    console.log('Error: ' + error.message);
}
  return new Promise(function (resolve, reject) {
   return Jimp.read(imagePath)
   .then(function (image) {
    console.log("started " + image);
    loadedImage = image;
    return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
   })
   .then(function (font) {

    if (shouldFlip) {
     loadedImage.print(font, dateY * 2, dateX - 800, imageDate)
     loadedImage.rotate(90);
    } else {
      loadedImage.print(font, 500, pos, imageDate)

    //  loadedImage.print(font, (dateX/3) * 2, dateY - 800, imageDate)
    }
      console.log(outputPath);
      loadedImage.write(outputPath);
   })
  .then(()=>console.log("done"))
  .then(()=>resolve("Stuff worked!"))
  .catch((err)=> reject(Error(err)));/* stuff using username, password */
  });
};

const imageNames = fs.readdirSync(baseOriginPath).filter(image => !image.match('.DS_Store'));

const run = async(images) => {
 let i = 0;
 while (i < images.length) {
  await jimpStuff(images[i])
  i++;
 }
};

run(imageNames);