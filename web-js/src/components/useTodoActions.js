import { useTodoActions as useGraphqlTodoActions } from "./useTodoActions_graphql"
import { useTodoActions as useMqlTodoActions } from "./useTodoActions_mql"

const KIND = "graphql"
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
  default: {
    throw new Error(`Invalid todo action kind: "${KIND}". Specifiy "graphql" or "mql" instead.`)
  }
}

export { useTodoActions };
