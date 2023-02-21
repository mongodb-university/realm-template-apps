import React, { useMemo } from "react";
import { useApp } from "../components/DataApi";
import appConfig from "../realm.json";
import { useDataApi } from "./useDataApi";

const { dataSourceName } = appConfig;

const taskCollection = {
  dataSource: dataSourceName,
  database: "todo",
  collection: "Task",
}

export function useTodos() {
  // Set up a list of todos in state
  const app = useApp();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const api = useDataApi();

  // Fetch all todos on load and whenever our collection changes (e.g. if the current user changes)
  React.useEffect(() => {
    if (app.currentUser) {
      (async () => {
        try {
          const { documents } = await api.find({
            ...taskCollection,
            filter: {},
          });
          setTodos(documents);
          setLoading(false);
        } catch (err) {
          console.error(err)
        }
      })();
    }
  }, [app.currentUser?.id]);

  // Given a draft todo, format it and then insert it
  const saveTodo = async (draftTodo) => {
    if (draftTodo.summary) {
      draftTodo._partition = app.currentUser.id;
      try {
        await api.insertOne({
          ...taskCollection,
          document: draftTodo,
        });
      } catch (err) {
        if (err.error.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that we tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Toggle whether or not a given todo is complete
  const toggleTodo = async (todo) => {
    await api.updateOne({
      ...taskCollection,
      filter: { _id: todo._id },
      update: { $set: { isComplete: !todo.isComplete } },
    });
  };

  // Delete a given todo
  const deleteTodo = async (todo) => {
    await api.deleteOne({
      ...taskCollection,
      filter: { _id: todo._id }
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
