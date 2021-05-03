// :state-start: development
import { ApiTypeName } from '../components/AppName'
import { useTodos as useGraphqlTodos } from "./useTodos_graphql"
import { useTodos as useMqlTodos } from "./useTodos_mql"
import { useTodos as useLocalTodos } from "./useTodos_local"
let useTodos;
switch(ApiTypeName) {
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
    throw new Error(`Invalid REACT_APP_API_TYPE: "${API_TYPE}". Specify "graphql", "mql", or "local" instead.`)
  }
}
// :state-end:
// :state-uncomment-start: prod-mql
import { useTodos } from "./useTodos_mql"
// :state-uncomment-end:
// :state-uncomment-start: prod-graphql
import { useTodos } from "./useTodos_graphql"
// :state-uncomment-end:
export { useTodos };
