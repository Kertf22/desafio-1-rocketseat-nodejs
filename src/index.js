const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui


  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  };

  request.user = user;
  next()

}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userAlreadyExists = users.find(user => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists!" });
  };

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  };

  users.push(user);

  return response.status(200).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;

  const user = request.user;

  const userIndex = users.findIndex(user => user.username === user.username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  };

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  users[userIndex] = user;

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;

  const { title, deadline } = request.body;

  const user = request.user;

  const userIndex = users.findIndex(user => user.username === user.username);

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found!" });
  };

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  todo.title = title;
  todo.deadline = deadline;

  user.todos[todoIndex] = todo;

  users[userIndex] = user

  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { id } = request.params;

  const user = request.user;

  const userIndex = users.findIndex(user => user.username === user.username);

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found!" });
  };

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  todo.done = true;

  user.todos[todoIndex] = todo;

  users[userIndex] = user;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { id } = request.params;

  const user = request.user;

  const userIndex = users.findIndex(user => user.username === user.username);

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Todo not found!" });
  };
  
  // const todoIndex = user.todos.findIndex(todo => todo.id === id);

  // user.todos.splice(todoIndex, 1);

  const todos = user.todos.filter(todo => todo.id != id);

  user.todos = todos;

  users[userIndex] = user;

  return response.status(204).json();
});

module.exports = app;