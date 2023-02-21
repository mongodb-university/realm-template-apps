import { useApp } from "../components/DataApi";
import { DataApi } from "../data-api";

const DataApiContext = React.createContext(null);

export const DataApiProvider = ({ children }) => {
  const app = useApp();
  const api = useMemo(() => new DataApi(app.id), app.id);
  return <DataApiContext.Provider value={api}>{children}</DataApiContext.Provider>;
}

export function useDataApi() {
  const api = React.useContext(DataApiContext);
  if(!api) {
    throw new Error(`You must call useDataApi() inside of a <DataApiProvider>.`);
  }
  return api;
}
