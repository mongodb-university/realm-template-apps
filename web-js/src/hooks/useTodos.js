// :state-start: development
import { useTodos as useGraphqlTodos } from "./useTodos_graphql"
import { useTodos as useMqlTodos } from "./useTodos_mql"
import { useTodos as useLocalTodos } from "./useTodos_local"
import { API_TYPE_NAME } from '../components/AppName'

let useTodos;
switch(API_TYPE_NAME) {
  case "GraphQL": {
    useTodos = useGraphqlTodos
    break;
  }
  case "MQL": {
    useTodos = useMqlTodos
    break;
  }
  case "Local": {
    useTodos = useLocalTodos
    break;
  }
  default: {
    throw new Error(`Invalid REACT_APP_API_TYPE: "${API_TYPE_NAME}". Specify "graphql", "mql", or "local" instead.`)
  }
}

export { useTodos };
// :state-end:
// :state-uncomment-start: prod-mql
// export { useTodos } from "./useTodos_mql"
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
// export { useTodos } from "./useTodos_graphql"
// :state-uncomment-end:
