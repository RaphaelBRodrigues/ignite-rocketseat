const express = require('express')
const users = require('./data/users.js')
const uuid = require('uuid')
const cors = require('cors')
const findByUsername = require('./helpers/findByUsername.js')
const findIndexByUsername = require('./helpers/findIndexByUsername.js')
const normalizeDate = require('./helpers/normalizeDate.js')
const checkExistsUserAccount = require('./middlewares/checkExistsUserAccount.js')
const { buildTodosResponse, buildTodoUpdateResponse } = require('./helpers/buildResponse.js')

const app = express()
app.use(cors())
app.use(express.json())

app.post('/users', (req, res) => {
  const { name, username } = req.body;
  const id = uuid.v4();

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return res.status(400).json({
      error: 'User already exists'
    })
  }

  const newUser = {
    name,
    username,
    todos: []
  };

  users.push({
    ...newUser,
    id
  });

  res
    .status(201)
    .json(
      newUser
    );
});

app.get('/todos', checkExistsUserAccount, (req, res) => {
  const { username } = req.headers;

  const selectedUser = findByUsername(username);

  if (!!selectedUser) {
    return res.json(buildTodosResponse(selectedUser.todos))
  }

  return res.status(204).end()

})

app.post('/todos', checkExistsUserAccount, (req, res) => {
  const { username } = req.headers;
  const { title, deadline } = req.body;

  const formattedDeadline = normalizeDate(deadline);

  const todo = {
    todo: {
      id: uuid.v4(),
      title,
      deadline: formattedDeadline,
      done: false,
      created_at: new Date()
    }
  }

  const userIndex = findIndexByUsername(username);
  const userTodos = users[userIndex].todos;
  userTodos.push(todo);

  users[userIndex].todos = userTodos


  return res.status(201).json({
    title,
    id: todo.todo.id,
    done: false,
    deadline: formattedDeadline,
  });
});

app.put('/todos/:id', checkExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { title, deadline } = req.body;
  const { username } = req.headers

  const formattedDeadline = normalizeDate(deadline);

  const todoData = {
    title,
    deadline: formattedDeadline
  };

  const userIndex = findIndexByUsername(username);
  const userTodos = users[userIndex].todos;

  const todoIndex = userTodos.findIndex(({ todo }) => {
    return todo.id === id
  });

  if (todoIndex < 0) {
    return res.status(404).json({
      error: 'Todo does not exists'
    })
  }



  const updatedTodo = {
    ...userTodos[todoIndex].todo,
    ...todoData
  }


  users[userIndex].todos[todoIndex].todo = updatedTodo;

  return res.json({
    ...users[userIndex].todos[todoIndex].todo,
  });
})

app.patch('/todos/:id/done', checkExistsUserAccount, (req, res) => {
  const { id } = req.params;
  const { username } = req.headers;
  const userIndex = findIndexByUsername(username);
  const todoIndex = users[userIndex].todos.findIndex(({ todo }) => todo.id === id);

  if (todoIndex < 0) {
    return res.status(404).json({
      error: 'Todo does not exists'
    })
  }

  users[userIndex].todos[todoIndex].todo.done = true
  return res.status(200).send(buildTodoUpdateResponse({
    todo: {
      done: true,
      ...users[userIndex].todos[todoIndex].todo
    }
  }));
})

app.delete('/todos/:id', checkExistsUserAccount, (req, res) => {
  const { username } = req.headers;
  const { id } = req.params;

  const userIndex = findIndexByUsername(username);
  const todoIndex = users[userIndex].todos.findIndex(({ todo }) => todo.id === id)

  if (todoIndex < 0) {
    return res.status(404).send({
      error: 'Todo does not exists'
    })
  }

  delete users[userIndex].todos[todoIndex]
  const filteredTodos = users[userIndex].todos.filter((todo) => todo != null);

  users[userIndex].todos = filteredTodos;


  res.status(204).end()
})


module.exports = app;