import React from "react"
import { useRealmApp } from './RealmApp'

export function useTodos() {
  const realmApp = useRealmApp();
  const mdb = realmApp.currentUser.mongoClient("mongodb-atlas");
  const taskCollection = mdb.db("todo").collection("Task");
  const [todos, setTodos] = React.useState([]);
  React.useEffect(() => {
    setTodos([])
  }, [])

  const saveTodo = async (draftTodo) => {
    console.log("MQL::saveTodo()", draftTodo);
    draftTodo._partition = realmApp.currentUser.id;
    await taskCollection.insertOne(draftTodo);
  }

  const toggleTodo = async (todo) => {
    console.log("MQL::toggleTodo()")
    await taskCollection.updateOne(
      { _id: todo._id },
      { $set: { isComplete: !todo.isComplete } }
    );
  }

  const deleteTodo = async (todo) => {
    console.log("MQL::deleteTodo()")
    await taskCollection.deleteOne({ _id: todo._id });
  }

  return {
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
