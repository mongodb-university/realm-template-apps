// :state-start: development
import { API_TYPE_NAME } from "./components/AppName";
// :state-end:
// :state-start: prod-mql prod-graphql
import * as Realm from "realm-web";
// :state-end:
// :state-start: prod-data-api
import { EJSON, ObjectId } from "bson";
// :state-end:
export const toggleBoolean = (prev) => !prev;

const isValidArrayIndex = (arr, idx) => {
  return !(idx < 0 || idx >= arr.length);
};

export function addValueAtIndex(arr, idx, value) {
  if (!isValidArrayIndex(arr, idx) && idx !== arr.length) {
    throw new Error(`Cannot add value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), value, ...arr.slice(idx)];
}

export function replaceValueAtIndex(arr, idx, newValue) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot replace value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)];
}

export function updateValueAtIndex(arr, idx, updater) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot update value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), updater(arr[idx]), ...arr.slice(idx + 1)];
}

export function removeValueAtIndex(arr, idx) {
  if (!isValidArrayIndex(arr, idx)) {
    throw new Error(`Cannot remove value. Array index out of bounds.`);
  }
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export const createObjectId = () => {
  // :state-start: development
  return API_TYPE_NAME === "Data API"
    ? EJSON.serialize(new ObjectId())
    : new Realm.BSON.ObjectId();
  // :state-end:
  // :state-uncomment-start: prod-mql prod-graphql
  // return new Realm.BSON.ObjectID()
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // return EJSON.serialize(new ObjectId())
  // :state-uncomment-end:
};

export const getTodoId = (todo) => {
  // :state-start: development
  return API_TYPE_NAME === "Data API" ? todo._id.$oid : todo._id.toHexString();
  // :state-end:
  // :state-uncomment-start: prod-mql prod-graphql
  // return todo._id.$oid
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // return todo._id.toHexString()
  // :state-uncomment-end:
};

export const isSameTodo = (todo1, todo2) =>
  getTodoId(todo1) === getTodoId(todo2);

export const getTodoIndex = (todos, todo) => {
  const idx = todos.findIndex((t) => isSameTodo(t, todo));
  return idx >= 0 ? idx : null;
};
