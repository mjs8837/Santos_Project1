const characters = {};

// Base function to handle json responses
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Base function to handle head requests
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Getting the characters object
const getCharacters = (request, response) => {
  respondJSON(request, response, 200, characters);
};

const getCharactersMeta = (request, response) => respondJSONMeta(request, response, 200);

const addCharacter = (request, response, body) => {
  const responseJSON = {};

  if (!body.name || !body.characterType || !body.strength || !body.dexterity
    || !body.endurance || !body.intelligence || !body.vigor) {
    responseJSON.errorMessage = 'Name, character type, and all other stats required.';
    responseJSON.id = 'addCharacterMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  const statTotal = Number(body.strength) + Number(body.dexterity)
  + Number(body.endurance) + Number(body.intelligence) + Number(body.vigor);

  if (statTotal > 25) {
    responseJSON.errorMessage = 'Character stats greater than allowed value.';
    responseJSON.id = 'characterStatsTooHigh';
    return respondJSON(request, response, 400, responseJSON);
  }

  if (statTotal < 25) {
    responseJSON.errorMessage = 'Character stats lower than required value.';
    responseJSON.id = 'characterStatsTooLow';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!characters[body.name]) {
    responseCode = 201;
    characters[body.name] = {};
  }

  characters[body.name].name = body.name;
  characters[body.name].characterType = body.characterType;
  characters[body.name].strength = body.strength;
  characters[body.name].dexterity = body.dexterity;
  characters[body.name].endurance = body.endurance;
  characters[body.name].intelligence = body.intelligence;
  characters[body.name].vigor = body.vigor;

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
