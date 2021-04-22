import React from "react"
import { useRealmApp } from './RealmApp'

export function useTodos() {
  const realmApp = useRealmApp();
  const taskCollection = React.useMemo(() => {
    const mdb = realmApp.currentUser.mongoClient("mongodb-atlas");
    return mdb.db("todo").collection("Task")
  }, [realmApp.currentUser]);
  const [todos, setTodos] = React.useState([]);
  
  React.useEffect(() => {
    const fetchTodos = async () => {
      return await taskCollection.find({});
    }
    
    const watchTodos = async () => {
      for await (const change of taskCollection.watch({ filter: {} })) {
        const getTodoIndex = todos => todos.findIndex((t) => String(t._id) === String(change.documentKey._id));
        switch(change.operationType) {
          case "insert": {
            setTodos(t => [...t, change.fullDocument])
            break;
          }
          case "update":
          case "replace": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos)
              return [
                ...oldTodos.slice(0, idx),
                change.fullDocument,
                ...oldTodos.slice(idx + 1),
              ];
            });
            break;
          }
          case "delete": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos)
              return [...oldTodos.slice(0, idx), ...oldTodos.slice(idx + 1)]
            });
            break;
          }
          default: {
            // change.operationType will always be one of the specified cases, so we should never hit this default
          }
        }
      }
    }
    fetchTodos().then(t => {
      setTodos(t)
      watchTodos()
    })
  }, [taskCollection])
  
  const saveTodo = async (draftTodo) => {
    draftTodo._partition = realmApp.currentUser.id;
    await taskCollection.insertOne(draftTodo);
  }
  
  const toggleTodo = async (todo) => {
    await taskCollection.updateOne(
      { _id: todo._id },
      { $set: { isComplete: !todo.isComplete } }
    );
  }
  
  const deleteTodo = async (todo) => {
    await taskCollection.deleteOne({ _id: todo._id });
  }
  
  return {
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  }
}
