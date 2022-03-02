const characters = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getCharacters = (request, response) => {
  const responseJSON = {
    characters,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getCharactersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addCharacter = (request, response, body) => {
  const responseJSON = {
    message: 'Name and type are both required.',
  };

  if (!body.name || !body.characterType) {
    responseJSON.id = 'addTaskMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!characters[body.name]) {
    responseCode = 201;
    characters[body.name] = {};
  }

  characters[body.name].name = body.name;
  characters[body.name].characterType = body.characterType;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getCharacters,
  getCharactersMeta,
  addCharacter,
  notFound,
  notFoundMeta,
};
