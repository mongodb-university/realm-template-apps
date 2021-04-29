import { useTodos as useGraphqlTodos } from "./useTodos_graphql"
import { useTodos as useMqlTodos } from "./useTodos_mql"
import { useTodos as useLocalTodos } from "./useTodos_local"

const API_TYPE = process.env.REACT_APP_API_TYPE

let useTodos;
switch(API_TYPE) {
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
    throw new Error(`Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specify "graphql", "mql", or "local" instead.`)
  }
}

export { useTodos };
