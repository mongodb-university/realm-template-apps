import { useTodos as useGraphqlTodos } from "./useTodos_graphql"
import { useTodos as useMqlTodos } from "./useTodos_mql"
import { useTodos as useLocalTodos } from "./useTodos_local"

const KIND = "mql"
let useTodos;
switch(KIND) {
  case "graphql": {
    useTodos = useGraphqlTodos
    break;
  }
  case "mql": {
    useTodos = useMqlTodos
    break;
  }
  case "local": {
    useTodos = useLocalTodos
    break;
  }
  default: {
    throw new Error(`Invalid todo action kind: "${KIND}". Specifiy "graphql" or "mql" instead.`)
  }
}

export { useTodos };
