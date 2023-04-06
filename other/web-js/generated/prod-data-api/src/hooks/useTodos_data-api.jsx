import React from "react";
import atlasConfig from "../atlasConfig.json";
import { useDataApi } from "./useDataApi";
import {
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTodoIndex,
} from "../utils";

const { dataSourceName } = atlasConfig;

const todoItemCollection = {
  dataSource: dataSourceName,
  database: "todo",
  collection: "Item",
}

export function useTodos() {
  // Set up a list of todos in state
  const api = useDataApi();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  React.useEffect(() => {
    if (api.currentUser) {
      (async () => {
        try {
          const { documents } = await api.find({
            ...todoItemCollection,
            filter: {},
          });
          setTodos(documents);
          setLoading(false);
        } catch (err) {
          console.error(err)
        }
      })();
    }
  }, [api, api.currentUser?.id]);

  // Given a draft todo, format it and then insert it
  const saveTodo = async (draftTodo) => {
    if (draftTodo.summary) {
      try {
        const document = {
          ...draftTodo,
          owner_id: api.currentUser.id,
        };
        await api.insertOne({
          ...todoItemCollection,
          document,
        });
        setTodos((oldTodos) => {
          const idx = oldTodos.length;
          return addValueAtIndex(oldTodos, idx, {
            ...document,
          });
        });
      } catch (err) {
        if (err.error?.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Toggle whether or not a given todo is complete
  const toggleTodo = async (todo) => {
    await api.updateOne({
      ...todoItemCollection,
      filter: { _id: todo._id },
      update: { $set: { isComplete: !todo.isComplete } },
    });
    setTodos((oldTodos) => {
      const idx = getTodoIndex(oldTodos, todo);
      return updateValueAtIndex(oldTodos, idx, (val) => {
        return { ...val, isComplete: !val.isComplete };
      });
    });
  };

  // Delete a given todo
  const deleteTodo = async (todo) => {
    await api.deleteOne({
      ...todoItemCollection,
      filter: { _id: todo._id }
    });
    setTodos((oldTodos) => {
      const idx = getTodoIndex(oldTodos, todo);
      return removeValueAtIndex(oldTodos, idx);
    });
  };

  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
}
