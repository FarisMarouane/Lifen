var chokidar = require('chokidar');
var fs = require('fs');

var Rx = require('rxjs/Rx');

const subject = new Rx.Subject();

function isFileRightSize(size) {
  if (size > 2000000) {
    return false;
  }
  return true;
}

function checkIfPdf(buffer) {
  if (!buffer || buffer.length < 4) {
    return false;
  }

  // First bytes are pdf's magic number
  return (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  );
}

const homePath =
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

let files = [];

function watcher() {
  var watcher = chokidar.watch(homePath + '/FHIR', {
    persistent: true,
  });

  watcher.on('add', function(path, stats) {
    if (isFileRightSize(stats.size)) {
      fs.readFile(path, (err, data) => {
        if (checkIfPdf(data)) {
          console.log('Just added a file');
          subject.next(data);
          files.push(data);
        }
      });
    }
  });
  return subject;
}

watcher();
exports.$watcher = subject;
