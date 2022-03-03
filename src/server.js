const http = require('http');
const url = require('url');

const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./JSONResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Parsing the data received from a post request
const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = query.parse(bodyString);

    handler(request, response, bodyParams);
  });
};

// Handling all post requests to add a character
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addCharacter') {
    parseBody(request, response, jsonHandler.addCharacter);
  }
};

// Handling all possible get requests. Including static files
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/normalize.css') {
    htmlHandler.getNormalizedCSS(request, response);
  } else if (parsedUrl.pathname === '/skeleton.css') {
    htmlHandler.getSkeletonCSS(request, response);
  } else if (parsedUrl.pathname === '/getCharacters') {
    jsonHandler.getCharacters(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/warrior.jpg') {
    mediaHandler.getWarrior(request, response);
  } else if (parsedUrl.pathname === '/knight.jpg') {
    mediaHandler.getKnight(request, response);
  } else if (parsedUrl.pathname === '/thief.jpg') {
    mediaHandler.getThief(request, response);
  } else if (parsedUrl.pathname === '/sorcerer.jpg') {
    mediaHandler.getSorcerer(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// Handling head requests
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getCharacters') {
    jsonHandler.getCharactersMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

// Calling the handler functions for each type of request
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
