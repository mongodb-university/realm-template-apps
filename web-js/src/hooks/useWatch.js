import React from "react";

const noop = () => {};
const defaultChangeHandlers = {
  onInsert: noop,
  onUpdate: noop,
  onReplace: noop,
  onDelete: noop,
};

export function useWatch(collection, changeHandlers) {
  const filter = React.useMemo(() => ({}), []);
  const handlers = { ...defaultChangeHandlers, ...changeHandlers };
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
