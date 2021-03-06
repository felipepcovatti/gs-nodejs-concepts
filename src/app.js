const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const newRepo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(newRepo);
  response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repo = repositories.find(repo => repo.id == id);
  const dataToUpdate = request.body;
  const updatableData = [
    'title',
    'url',
    'techs'
  ];

  if (!repo) return response.status(400).send("Bad Request");

  for (data in dataToUpdate) {
    if (updatableData.includes(data)) {
      repo[data] = dataToUpdate[data];
    }
  }
  response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repoIndex = repositories.findIndex(repo => repo.id == id);

  if (repoIndex < 0) return response.status(400).send("Bad Request");

  repositories.splice(repoIndex, 1);
  response.status(204).end();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repo = repositories.find(repo => repo.id == id);

  if (!repo) return response.status(400).send("Bad Request");

  repo.likes += 1;
  response.json(repo);
});

module.exports = app;
