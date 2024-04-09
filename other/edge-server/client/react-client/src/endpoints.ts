import { Todo } from "./types";

// This baseUrl points to the local Express server.
const baseUrl: string = "http://localhost:5055";

export const getTodos = async () => {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const todos: Todo[] = await response.json();

    if (todos) {
      return todos;
    } else {
      console.log("No todos found");
      return undefined;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const addTodo = async (todo: Todo) => {
  try {
    const rawResponse = await fetch(`${baseUrl}/add-todo`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const response = await rawResponse.json();

    if (response && response.message == "Todo added") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const updateTodo = async (todo: Todo) => {
  try {
    const rawResponse = await fetch(`${baseUrl}/update-todo/${todo._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const response = await rawResponse.json();

    if (response && response.message == "Todo updated") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export const deleteTodo = async (id: string) => {
  try {
    const rawResponse = await fetch(`${baseUrl}/delete-todo/${id}`, {
      method: "DELETE",
    });
    const response = await rawResponse.json();

    if (response && response.message == "Todo deleted") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};
