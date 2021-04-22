import { BSON } from "realm-web";
import React from "react";
import { useRealmApp } from "./RealmApp";

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
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useTodos() {
  const realmApp = useRealmApp();
  const [todos, setTodos] = React.useState([]);
  
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const fetchTodos = async () => {
      await latency(1640)
      return createExampleTodos(realmApp.currentUser.id);
    };
    fetchTodos().then((t) => {
      setTodos(t);
      setLoading(false);
    });
  }, [realmApp.currentUser.id]);
  
  const saveTodo = async (todo) => {
    setTodos((t) => [...t, todo]);
  };
  const toggleTodo = async (todo) => {
    setTodos((oldTodos) => {
      const idx = oldTodos.findIndex((t) => t._id === todo._id);
      return [
        ...oldTodos.slice(0, idx),
        { ...oldTodos[idx], isComplete: !oldTodos[idx].isComplete },
        ...oldTodos.slice(idx + 1),
      ];
    });
  };
  const deleteTodo = async (todo) => {
    setTodos((oldTodos) => {
      const idx = oldTodos.findIndex((t) => t._id === todo._id);
      return [...oldTodos.slice(0, idx), ...oldTodos.slice(idx + 1)];
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
