export function useTodoActions(todos, setTodos) {
  const saveTodo = async (todo) => {
    setTodos((t) => [...t, todo]);
  }
  const toggleTodo = async todo => {
    setTodos((oldTodos) => {
      const idx = oldTodos.findIndex((t) => t._id === todo._id);
      return [
        ...oldTodos.slice(0, idx),
        { ...oldTodos[idx], isComplete: !oldTodos[idx].isComplete },
        ...oldTodos.slice(idx + 1),
      ];
    });
  }
  const deleteTodo = async (todo) => {
    setTodos((oldTodos) => {
      const idx = oldTodos.findIndex((t) => t._id === todo._id);
      return [...oldTodos.slice(0, idx), ...oldTodos.slice(idx + 1)];
    });
  }

  return {
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
