function buildTodosResponse(todos) {
  return todos.map(({ todo }) => {
    const { deadline, done, title, id } = todo;
    return {
      deadline,
      done,
      title,
      id
    };
  });
}

function buildTodoUpdateResponse({ todo }) {
  return {
    deadline: todo.deadline,
    done: todo.done,
    id: todo.id,
    title: todo.title,
  }
}

module.exports = {
  buildTodosResponse, buildTodoUpdateResponse
}