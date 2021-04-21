export function useTodoActions(todos, setTodos) {
  const createTodo = () => {
    console.log("GRAPHQL::createTodo()")
  }

  const saveTodo = (draftTodo) => {
    console.log("GRAPHQL::saveTodo()")
  }

  const toggleTodo = () => {
    console.log("GRAPHQL::toggleTodo()")
  }

  const deleteTodo = () => {
    console.log("GRAPHQL::deleteTodo()")
  }

  return {
    createTodo,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
