// SCALE MULTIPLE AND COMPRESS ALL IMAGES

var sharp  = require('sharp'),
    path = require('path'),
    fs = require('graceful-fs'),
    compress_images = require('compress-images');

var folderSrc = './static/images/',
    folderOut = ['./static/images-l/', './static/images-m/', './static/images-s/', './static/images-xs/'],
    dim = [2000, 1000, 600, 300],
    files = [];
// var folderSrc = './static/images/',
//     folderOut = ['./static/images-l/'],
//     dim = [2000];

fs.readdir(folderSrc, function(err, files) {
  // ALL IMAGES
  for(var j=0; j<dim.length; j++) {

    // MAKE FOLDERS
    fs.mkdir(folderOut[j], function(err) {
      if (err) {
        console.log(err)
      }
    });

    // RESIZE
    for (var i=0; i<files.length; i++) {
      var input = folderSrc + files[i];
      var output = folderOut[j] + files[i];

      if (path.extname(files[i]) == '.jpg' || path.extname(files[i]) == '.jpeg') {
        sharp(input).resize(dim[j], null, {
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
          quality: 80
        }).toFile(output, function(err, info) {
          // console.log(i, err, info);
        });
      } else {
        sharp(input).resize(dim[j], null, {
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        }).toFile(output, function(err, info) {
          // console.log(i, err, info);
        });
      }
    }

    // COMPRESS
    compress_images(folderOut[j] + '/*', folderOut[j] + '~', { compress_force: false, statistic: true, autoupdate: true }, false,
                { jpg: {engine: 'mozjpeg', command: ['-quality', '50'] } },
                { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
                { svg: { engine: false, command: false } },
                { gif: { engine: false, command: false } },
      function(err, completed, statistic){
        if(err === null && statistic != undefined){
          fs.unlink(statistic.input, (err) => {
            if (err) throw err;
            fs.rename(statistic.path_out_new, statistic.input, (error) => {
              if (error) { console.log(error); }
            });
            console.log('successfully compressed and deleted '+statistic.input);
          });
        }
    });

  }
});
