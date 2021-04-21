export function useTodoActions(todos, setTodos) {
  const createTodo = () => {
    console.log("MQL::createTodo()")    
  }

  const saveTodo = (draftTodo) => {
    console.log("MQL::saveTodo()")
  }

  const toggleTodo = () => {
    console.log("MQL::toggleTodo()")
  }

  const deleteTodo = () => {
    console.log("MQL::deleteTodo()")
  }

  return {
    createTodo,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
