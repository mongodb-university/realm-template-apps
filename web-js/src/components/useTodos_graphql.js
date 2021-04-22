import React from "react"

export function useTodos() {
  const [todos, setTodos] = React.useState([]);
  React.useEffect(() => {
    setTodos([])
  }, [])

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
    todos,
    createTodo,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
