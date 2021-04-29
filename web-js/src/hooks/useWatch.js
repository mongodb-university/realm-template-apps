import React from "react";

// By default we won't do anything for a change event unless the caller passed in a change handler
// for the change event type.
const noop = () => {};
const defaultChangeHandlers = {
  onInsert: noop,
  onUpdate: noop,
  onReplace: noop,
  onDelete: noop,
};

/**
 * Opens/manages a change stream and calls provided change handlers for a given MongoDB collection.
 * @param {Realm.Services.MongoDB.MongoDBCollection<T>} collection - A MongoDB collection client object.
 * @param {Object} changeHandlers - A set of callback functions to call in response to changes.
 * @param {(change: Realm.Services.MongoDB.InsertEvent<T>) => void} [changeHandlers.onInsert] - A change handler callback that receives an Insert event.
 * @param {(change: Realm.Services.MongoDB.UpdateEvent<T>) => void} [changeHandlers.onUpdate] - A change handler callback that receives an Update event.
 * @param {(change: Realm.Services.MongoDB.ReplaceEvent<T>) => void} [changeHandlers.onReplace] - A change handler callback that receives a Replace event.
 * @param {(change: Realm.Services.MongoDB.DeleteEvent<T>) => void} [changeHandlers.onDelete] - A change handler callback that receives a Delete event.
 */
export function useWatch(collection, changeHandlers) {
  const filter = React.useMemo(() => ({}), []);
  const handlers = { ...defaultChangeHandlers, ...changeHandlers };
  // We copy the handlers into a ref so that we can always call the latest version of each handler
  // without causing a re-render when the callbacks change. This can prevent infinite render loops
  // that would otherwise happen if the caller doesn't memoize their change handler functions.
  const handlersRef = React.useRef(handlers);
  React.useEffect(() => {
    handlersRef.current = {
      onInsert: handlers.onInsert,
      onUpdate: handlers.onUpdate,
      onReplace: handlers.onReplace,
      onDelete: handlers.onDelete,
    };
  }, [
    handlers.onInsert,
    handlers.onUpdate,
    handlers.onReplace,
    handlers.onDelete,
  ]);
  // Set up a MongoDB change stream that calls the provided change handler callbacks.
  React.useEffect(() => {
    const watchTodos = async () => {
      for await (const change of collection.watch({ filter })) {
        switch (change.operationType) {
          case "insert": {
            handlersRef.current.onInsert(change);
            break;
          }
          case "update": {
            handlersRef.current.onUpdate(change);
            break;
          }
          case "replace": {
            handlersRef.current.onReplace(change);
            break;
          }
          case "delete": {
            handlersRef.current.onDelete(change);
            break;
          }
          default: {
            // change.operationType will always be one of the specified cases, so we should never hit this default
            throw new Error(
              `Invalid change operation type: ${change.operationType}`
            );
          }
        }
      }
    };
    watchTodos();
  }, [collection, filter]);
}
