import React from "react";
import { BSON } from "realm-web";
import { useRealmApp } from "../components/RealmApp";
import {
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
} from "../utils";

const createExampleTodos = (userId = "60810749247a41a9809fba46") => [
  {
    _id: new BSON.ObjectID(),
    _partition: userId,
    summary: "Do the dishes",
    isComplete: false,
  },
  {
    _id: new BSON.ObjectID(),
    _partition: userId,
    summary: "Buy groceries",
    isComplete: false,
  },
];

function latency(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useTodos() {
  const realmApp = useRealmApp();
  const [todos, setTodos] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchTodos = async () => {
      await latency(1640);
      return createExampleTodos(realmApp.currentUser.id);
    };
    fetchTodos().then((t) => {
      setTodos(t);
      setLoading(false);
    });
  }, [realmApp.currentUser.id]);

  const getTodoIndex = (todos, todo) =>
    todos.findIndex((t) => String(t._id) === String(todo._id));
  const saveTodo = async (draftTodo) => {
    if (draftTodo.summary) {
      setTodos((oldTodos) => {
        const idx = oldTodos.length;
        return addValueAtIndex(oldTodos, idx, draftTodo);
      });
    }
  };
  const toggleTodo = async (todo) => {
    setTodos((oldTodos) => {
      const idx = getTodoIndex(oldTodos, todo);
      return updateValueAtIndex(oldTodos, idx, (val) => {
        return { ...val, isComplete: val.isComplete };
      });
    });
  };
  const deleteTodo = async (todo) => {
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
