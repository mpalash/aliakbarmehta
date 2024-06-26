// FIX FILE PATHS WITH SPACES IN CONTENT FILES

var path = require('path'),
    fs = require('graceful-fs');

var folderSrc = './content-raw/',
    folderOut = './content/',
    files = [];

fs.readdir(folderSrc, function(err, files) {
  for (var i=0; i<files.length; i++) {
    if (path.extname(files[i]) == '.md') {
      var input = folderSrc + files[i];
      var output = folderOut + files[i];

      var data = fs.readFileSync(input, 'utf8', {encoding:'utf8', flag:'r'});
      var result = data.replace(/\/static\/img\/.*.(?:jpe?g|gif|png)/g, function(match){
        return match.replace(/\s/g,'%20')
        // return match.replace(/\s/g,'%20').replace(/\/static\/img\//g,'https://ik.imagekit.io/mp/aam/tr:w-1000/')
      });
      fs.writeFileSync(output, result, 'utf8', function (err) {
         if (err) return console.log(err);
      });
    }
  }
});
