import React from "react";
import * as Realm from "realm-web";

export function useDraftTodos() {
  const [drafts, setDrafts] = React.useState([]);

  const createDraftTodo = () => {
    const draftTodo = {
      _id: new Realm.BSON.ObjectID(),
      summary: "",
      isComplete: false,
    };
    setDrafts((d) => [...d, draftTodo]);
  };

  const setDraftTodoSummary = (draft, summary) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], summary },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const deleteDraftTodo = (draft) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [...oldDrafts.slice(0, idx), ...oldDrafts.slice(idx + 1)];
    });
  };

  return {
    draftTodos: drafts,
    createDraftTodo,
    setDraftTodoSummary,
    deleteDraftTodo,
  };
}
