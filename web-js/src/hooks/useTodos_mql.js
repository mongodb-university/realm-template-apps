import React from "react";
import { useRealmApp } from "../components/RealmApp";
import {
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTodoIndex,
} from "../components/utils";

export function useTodos() {
  const realmApp = useRealmApp();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const taskCollection = React.useMemo(() => {
    const mdb = realmApp.currentUser.mongoClient("mongodb-atlas");
    return mdb.db("todo").collection("Task");
  }, [realmApp.currentUser]);

  React.useEffect(() => {
    const fetchTodos = async () => {
      return await taskCollection.find({});
    };

    const watchTodos = async () => {
      for await (const change of taskCollection.watch({ filter: {} })) {
        const todo = change.fullDocument ?? change.documentKey;
        switch (change.operationType) {
          case "insert": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos, todo) ?? oldTodos.length;
              return addValueAtIndex(oldTodos, idx, todo);
            });
            break;
          }
          case "update":
          case "replace": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos, todo);
              if (idx !== null) {
                return updateValueAtIndex(oldTodos, idx, () => {
                  return todo;
                });
              } else {
                console.warn(
                  `Received an UPDATE or REPLACE event for a todo that is not in state. Todo._id=${todo._id}`
                );
                return oldTodos;
              }
            });
            break;
          }
          case "delete": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos, todo);
              console.log(oldTodos, todo, idx, idx !== null)
              if (idx !== null) {
                return removeValueAtIndex(oldTodos, idx);
              } else {
                console.warn(
                  `Received a DELETE event for a todo that is not in state. Todo._id=${todo._id}`
                );
                return oldTodos;
              }
            });
            break;
          }
          default: {
            // change.operationType will always be one of the specified cases, so we should never hit this default
            throw new Error(
              `Invalid change operation type: ${change.operationType}`
            );
          }
        }
      }
    };
    fetchTodos().then((fetchedTodos) => {
      setTodos(fetchedTodos);
      watchTodos();
      setLoading(false);
    });
  }, [taskCollection]);

  const saveTodo = async (draftTodo) => {
    console.log("saveTodo called")
    if (draftTodo.summary) {
      draftTodo._partition = realmApp.currentUser.id;
      try {
        await taskCollection.insertOne(draftTodo);
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(`The following error means that we tried to insert a todo with the same _id as an existing todo. In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`)
        }
        console.error(err)
      }
    }
  };

  const toggleTodo = async (todo) => {
    await taskCollection.updateOne(
      { _id: todo._id },
      { $set: { isComplete: !todo.isComplete } }
    );
  };

  const deleteTodo = async (todo) => {
    await taskCollection.deleteOne({ _id: todo._id });
  };

  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
}
