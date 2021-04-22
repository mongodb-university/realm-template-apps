import React from "react"

export function useTodos() {
  const [todos, setTodos] = React.useState([])

  const fetchTodos = async () => {
    return [
      {
        _id: "abcde",
        _partition: "123",
        summary: "Do the dishes",
        isComplete: false,
      },
      {
        _id: "efghi",
        _partition: "123",
        summary: "Buy groceries",
        isComplete: false,
      },
      {
        _id: "zxcv",
        _partition: "123",
        summary: "This is a longer one to see how things wrap.",
        isComplete: false,
      },
    ]
  }

  React.useEffect(() => {
    fetchTodos().then(t => setTodos(t))
  }, [])
  
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
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
