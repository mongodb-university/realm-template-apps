import { useState } from 'react';
import Realm from 'realm';

const useDraftTodos = () => {
  const [drafts, setDrafts] = useState([]);

  const createDraftTodo = () => {
    const draftTodo = {
      _id: new Realm.BSON.ObjectID(),
      summary: '',
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
};

export default useDraftTodos;
