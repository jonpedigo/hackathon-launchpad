var Jimp = require('jimp');

if(process.argv.length !== 4) {
  console.log('must call this script like - node /downloadsprite.js texturename url')
  process.exit()
}

const urlIndex = process.argv[3].indexOf('http')

if(urlIndex < 0 || urlIndex > 0) {
  console.log('last argument must be url')
  process.exit()
}

Jimp.read(process.argv[3])
  .then(pic => {
    console.log('resizing and writing ./client/public/static/img/' + process.argv[2] + '.png')
    return pic
      .resize(8, 8) // resize
      .write('./client/public/static/img/' + process.argv[2] + '.png'); // save
  })
  .catch(err => {
    console.error(err);
  });

// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     // console.log('content-type:', res.headers['content-type']);
//     // console.log('content-length:', res.headers['content-length']);
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };
//
// download(, , function(){
//   console.log('done');
// });
