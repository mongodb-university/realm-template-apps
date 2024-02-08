import { Document } from "bson";

export interface Todo {
  _id: Document;
  summary: string;
  isComplete: boolean;
}

export interface TodoActions {
  saveTodo: (draftTodo: any) => Promise<void>;
  toggleTodo: (todo: any) => Promise<void>;
  removeTodo: (todo: any) => Promise<void>;
}

export interface DraftTodoActions {
  createDraftTodo: () => void;
  setDraftTodoSummary: (draft: any, summary: any) => void;
  deleteDraftTodo: (draft: any) => void;
}

export interface DraftTodoItemProps {
  todo: Todo;
  todoActions: TodoActions;
  draftTodoActions: DraftTodoActions;
}

export interface TodoItemProps {
  todo: Todo;
  todoActions: TodoActions;
}
