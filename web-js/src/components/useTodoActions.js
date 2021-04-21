import { useTodoActions as useGraphqlTodoActions } from "./useTodoActions_graphql"
import { useTodoActions as useMqlTodoActions } from "./useTodoActions_mql"
import { useTodoActions as useLocalTodoActions } from "./useTodoActions_local"

const KIND = "local"
let useTodoActions;
switch(KIND) {
  case "graphql": {
    useTodoActions = useGraphqlTodoActions
    break;
  }
  case "mql": {
    useTodoActions = useMqlTodoActions
    break;
  }
  case "local": {
    useTodoActions = useLocalTodoActions
    break;
  }
  default: {
    throw new Error(`Invalid todo action kind: "${KIND}". Specifiy "graphql" or "mql" instead.`)
  }
}

export { useTodoActions };
