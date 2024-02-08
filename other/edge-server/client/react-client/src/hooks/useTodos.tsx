import React from "react";
import { getTodos, addTodo, updateTodo, deleteTodo } from "../endpoints";
import {
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTodoIndex,
} from "../utils";
import { Todo } from "../types";

export function useTodos() {
  // Set up a list of todos in state
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch all todos on first load
  React.useEffect(() => {
    (async () => {
      try {
        const todos = await getTodos();

        if (todos?.length) {
          setTodos(todos);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Given a draft todo, format it and then insert it
  const saveTodo = async (draftTodo: Todo) => {
    if (draftTodo.summary) {
      try {
        const document = {
          ...draftTodo,
        };
        const addTodoSucceeded = await addTodo(document);

        if (addTodoSucceeded) {
          setTodos((oldTodos) => {
            const idx = oldTodos.length;
            return addValueAtIndex(oldTodos, idx, {
              ...document,
            });
          });
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name?.match(/^Duplicate key error/)
        ) {
          console.warn(
            `The following error means that this app tried to insert a todo
            multiple times (i.e. an existing todo has the same _id). In this
            app we just catch the error and move on. In your app, you might
            want to debounce the save input or implement an additional loading
            state to avoid sending the request in the first place.`
          );
        }
        console.error(error);
      }
    }
  };

  // Toggle whether or not a given todo is complete
  const toggleTodo = async (todo: Todo) => {
    let updatedTodo = { ...todo };
    updatedTodo.isComplete = !updatedTodo.isComplete;

    const updateTodoSucceeded = await updateTodo(updatedTodo);

    if (updateTodoSucceeded) {
      setTodos((oldTodos) => {
        const idx = getTodoIndex(oldTodos, todo);

        return updateValueAtIndex(oldTodos, idx, (val: Todo) => {
          return { ...val, isComplete: !val.isComplete };
        });
      });
    }
  };

  // Delete a given todo
  const removeTodo = async (todo: Todo) => {
    const deleteTodoSucceeded = await deleteTodo(todo._id.toString());

    if (deleteTodoSucceeded) {
      setTodos((oldTodos) => {
        const idx = getTodoIndex(oldTodos, todo);

        return removeValueAtIndex(oldTodos, idx);
      });
    }
  };

  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    removeTodo,
  };
}
