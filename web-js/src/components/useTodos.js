import React from "react"
import { useTodoActions } from "./useTodoActions"

export function useTodos() {
  const [todos, setTodos] = React.useState([])
  const {
    createTodo,
    saveTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoActions(todos, setTodos)

  return {
    todos,
    createTodo,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
