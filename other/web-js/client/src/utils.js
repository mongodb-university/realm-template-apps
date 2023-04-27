// :state-start: development
import { API_TYPE_NAME } from "./components/AppName";
// :state-end:
// :state-start: development
import * as Realm from "realm-web";
// :state-end:
// :state-uncomment-start: prod-mql
// import * as Realm from "realm-web";
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// import * as Realm from "realm-web";
// :state-uncomment-end:
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
  // :state-uncomment-start: prod-mql
  // return new Realm.BSON.ObjectId()
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // return new Realm.BSON.ObjectId()
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // return EJSON.serialize(new ObjectId())
  // :state-uncomment-end:
};

export const getTodoId = (todo) => {
  // :state-start: development
  if (todo._id instanceof Realm.BSON.ObjectId) {
    return todo._id.toHexString();
  } else if (todo._id instanceof Object) {
    return todo._id.$oid;
  } else {
    return todo._id;
  }
  // :state-end:
  // :state-uncomment-start: prod-mql
  // if (todo._id instanceof Realm.BSON.ObjectId) {
  //   return todo._id.toHexString();
  // }
  // return todo._id
  // :state-uncomment-end:
  // :state-uncomment-start: prod-graphql
  // if (todo._id instanceof Realm.BSON.ObjectId) {
  //   return todo._id.toHexString();
  // }
  // return todo._id
  // :state-uncomment-end:
  // :state-uncomment-start: prod-data-api
  // return todo._id.$oid
  // :state-uncomment-end:
};

export const isSameTodo = (todo1, todo2) =>
  getTodoId(todo1) === getTodoId(todo2);

export const getTodoIndex = (todos, todo) => {
  const idx = todos.findIndex((t) => isSameTodo(t, todo));
  return idx >= 0 ? idx : null;
}
