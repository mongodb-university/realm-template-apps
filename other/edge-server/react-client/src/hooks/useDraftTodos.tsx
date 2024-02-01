import React from "react";
import { createObjectId } from "../utils";
import { Todo } from "../types";

export function useDraftTodos() {
  const [drafts, setDrafts] = React.useState<Todo[]>([]);

  const createDraftTodo = () => {
    const draftTodo: Todo = {
      _id: createObjectId(),
      summary: "",
      isComplete: false,
    };

    setDrafts((d) => [...d, draftTodo]);
  };

  const setDraftTodoSummary = (draft: Todo, summary: string) => {
    setDrafts((oldDrafts) => {
      const index = oldDrafts.findIndex((d) => d._id === draft._id);

      return [
        ...oldDrafts.slice(0, index),
        { ...oldDrafts[index], summary },
        ...oldDrafts.slice(index + 1),
      ];
    });
  };

  const deleteDraftTodo = (draft: Todo) => {
    setDrafts((oldDrafts) => {
      const index = oldDrafts.findIndex((d) => d._id === draft._id);

      return [...oldDrafts.slice(0, index), ...oldDrafts.slice(index + 1)];
    });
  };

  return {
    draftTodos: drafts,
    createDraftTodo,
    setDraftTodoSummary,
    deleteDraftTodo,
  };
}
