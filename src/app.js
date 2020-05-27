const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) return response.json('Repositorio nao encontrado').status(400)

  repositories[repositoryIndex] = {
    id, //id : id
    title: title ? title : repositories[repositoryIndex].title,
    url: url ? url : repositories[repositoryIndex].url,
    techs: techs ? techs : repositories[repositoryIndex].techs,
    likes: repositories[repositoryIndex].likes
  }

  return response.json(repositories[repositoryIndex]) 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryDelete = repositories.findIndex(repository => repository.id == id)

  if(repositoryDelete < 0) return response.status(400).json('Repositorio nao encontado')

  repositories.splice(repositoryDelete, 1)

  return response.send('Repositorio Deletado').status(204)
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repository = repositories.find(repository => repository.id === id)

  if(!repository) return response.status(400).send()

  repository.likes += 1

  return response.json(repository)
});

module.exports = app;
