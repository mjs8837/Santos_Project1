const fs = require('fs'); // pull in the file system module
const path = require('path');

// Took most of this code from the streaming media demo
const errorCheck = (response, err) => {
  if (err) {
    if (err.code === 'ENOENT') {
      response.writeHead(404);
    }
    return response.end(err);
  }

  return null;
};

const responseSetup = (response, start, end, total, chunksize, contentType) => {
  response.writeHead(200, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': contentType,
  });
};

const loadFile = (request, response, filePath, contentType) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    errorCheck(response, err);

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;

    responseSetup(response, start, end, total, chunksize, contentType);

    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

// Function to get the knight image
const getKnight = (request, response) => {
  loadFile(request, response, '../client/knight.jpg', 'image/jpeg');
};

// Function to get the warrior image
const getWarrior = (request, response) => {
  loadFile(request, response, '../client/warrior.jpg', 'image/jpeg');
};

// Function to get the thief image
const getThief = (request, response) => {
  loadFile(request, response, '../client/thief.jpg', 'image/jpeg');
};

// Function to get the sorcerer image
const getSorcerer = (request, response) => {
  loadFile(request, response, '../client/sorcerer.jpg', 'image/jpeg');
};

module.exports = {
  getKnight,
  getWarrior,
  getThief,
  getSorcerer,
};
