const tasks = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getTasks = (request, response) => {
  const responseJSON = {
    tasks,
  };

  respondJSON(request, response, 200, responseJSON);
};

const getTasksMeta = (request, response) => respondJSONMeta(request, response, 200);

const addTask = (request, response, body) => {
  const responseJSON = {
    message: 'Task and due date are both required.',
  };

  if (!body.task || !body.dueDate) {
    responseJSON.id = 'addTaskMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!tasks[body.task]) {
    responseCode = 201;
    tasks[body.task] = {};
  }

  tasks[body.task].task = body.task;
  tasks[body.task].dueDate = body.dueDate;

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
  getTasks,
  getTasksMeta,
  addTask,
  notFound,
  notFoundMeta,
};
