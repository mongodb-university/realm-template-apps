import React from "react";
// import * as Realm from "realm-web";
import {
  // Container,
  // TextField,
  // Button,
  Button,
  // Card,
  // Typography,
  // InputAdornment,
} from "@material-ui/core";
import { useRealmApp } from "./RealmApp";
import { useTodos } from "./useTodos";

export function TodoItemsPage() {
  const realmApp = useRealmApp();
  const { todos, ...todoActions } = useTodos();
  return (<div>
    {todos.length}
    <Button onClick={todoActions.createTodo}>createTodo</Button>
    <Button onClick={todoActions.saveTodo}>saveTodo</Button>
    <Button onClick={todoActions.toggleTodo}>toggleTodo</Button>
    <Button onClick={todoActions.deleteTodo}>deleteTodo</Button>
  </div>)
}
