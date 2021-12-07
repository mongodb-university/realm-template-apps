import { useState } from 'react';
import { realmApp } from '../realm';

const useTodos = () => {
  // TODO
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTodos = async () => {
    // TODO
  };

  const saveTodo = async (draftTodo) => {
    // TODO
  };

  const toggleTodo = async (todo) => {
    // TODO
  };

  const deleteTodo = async (todo) => {
    // TODO
  };

  // TODO: figure out how to do refresh behavior for todos
  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
};

export default useTodos;
