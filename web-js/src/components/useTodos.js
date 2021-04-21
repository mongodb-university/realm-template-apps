import React from "react"
// import { useRealmApp } from "./RealmApp";
import { useTodoActions } from "./useTodoActions"

export function useTodos() {
  // const realmApp = useRealmApp();
  const [todos, setTodos] = React.useState([
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
  ])
  
  const {
    saveTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoActions(todos, setTodos)

  return {
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
