const express = require('express')
const users = require('./data/users.js')
const uuid = require('uuid')
const cors = require('cors')
const findByUsername = require('./helpers/findByUsername.js')
const findIndexByUsername = require('./helpers/findIndexByUsername.js')
const stringToDate = require('./helpers/stringToDate.js')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/users', (req, res) => {
  const { name, username } = req.body;
  const id = uuid.v4();

  const newUser = {
    id,
    name,
    username,
    todos: []
  };

  users.push(newUser);

  res
    .status(201)
    .json({
      user: newUser
    });
});

app.get('/todos', (req, res) => {
  const { username } = req.headers;

  const selectedUser = findByUsername(username, users);

  if (!!selectedUser) {
    return res.json({
      todos: selectedUser.todos
    })
  }

  return res.status(204).end()

})

app.post('/todos', (req, res) => {
  const { username } = req.headers;
  const { title, deadline } = req.body;

  const formattedDeadline = stringToDate(deadline);

  const todo = {
    id: uuid.v4(),
    title,
    deadline: formattedDeadline,
    done: false,
    created_at: new Date()
  }

  const userIndex = findIndexByUsername(username, users);
  const userTodos = users[userIndex].todos;
  userTodos.push(todo);

  users[userIndex].todos = userTodos

  return res.json({
    todo
  });
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, deadline } = req.body;
  const { username } = req.headers

  const formattedDeadline = stringToDate(deadline);

  const todoData = {
    title,
    deadline: formattedDeadline
  };

  const userIndex = findIndexByUsername(username, users);
  const userTodos = users[userIndex].todos;

  const todoIndex = userTodos.findIndex((todo) => {
    return todo.id === id
  });

  const updatedTodo = {
    ...userTodos[todoIndex],
    ...todoData
  }

  users[userIndex].todos[todoIndex] = updatedTodo;


  return res.status(204).end();
})

app.patch('/todos/:id/done', (req, res) => {
  const { id } = req.params;
  const { username } = req.headers;

  const userIndex = findIndexByUsername(username, users);
  const todoIndex = users[userIndex].todos.findIndex((todo) => todo.id === id);

  users[userIndex].todos[todoIndex].done = true

  return res.status(204).end();
})

app.delete('/todos/:id', (req, res) => {
  const { username } = req.headers;
  const { id } = req.params;

  const userIndex = findIndexByUsername(username, users);
  const todoIndex = users[userIndex].todos.findIndex((todo) => todo.id === id)

  delete users[userIndex].todos[todoIndex]
  const filteredTodos = users[userIndex].todos.filter((todo) => todo != null);

  users[userIndex].todos = filteredTodos;


  res.status(204).end()
})

app.listen(3000)           