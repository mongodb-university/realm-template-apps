import React from "react";
// :state-start: prod-mql, prod-graphql
import * as Realm from "realm-web";
// :state-end:
// :state-start: development
import { API_TYPE_NAME } from "../components/AppName";
// :state-end:

export function useDraftTodos() {
  const [drafts, setDrafts] = React.useState([]);

  const createDraftTodo = () => {
    const draftTodo = {
      // :state-start: development
      _id:
        API_TYPE_NAME === "Data API"
          ? { $oid: new Realm.BSON.ObjectId().toHexString() }
          : new Realm.BSON.ObjectId(),
      // :state-end:
      // :state-uncomment-start: prod-mql, prod-graphql
      // _id: new Realm.BSON.ObjectID(),
      // :state-uncomment-end:
      // :state-uncomment-start: prod-data-api
      // _id: { $oid: new Realm.BSON.ObjectId().toHexString() },
      // :state-uncomment-end:
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
