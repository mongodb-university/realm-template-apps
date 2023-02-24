import { createContext, useContext, useState, useMemo } from "react";
import { DataApi } from "../data-api";

const DataApiContext = createContext(null);

export const DataApiProvider = ({ appId, location, children }) => {

  const deployment_model = location.deployment_model ??
    (location.cloud || location.region ? "LOCAL" : "GLOBAL");

  const { cloud, region } = location;
  const api = useMemo(() => {
    return new DataApi({
      appId,
      deployment_model,
      cloud,
      region,
      onAuthChange: (newCurrentUser) => {
        setCurrentUser(newCurrentUser);
      }
    });
  }, [appId, deployment_model, cloud, region])

  const [currentUser, setCurrentUser] = useState(api.currentUser);

  const contextValue = useMemo(() => {
    return {
      currentUser,
      logIn: api.logIn.bind(api),
      logOut: api.logOut.bind(api),
      registerUser: api.registerUser.bind(api),
      findOne: api.findOne.bind(api),
      find: api.find.bind(api),
      insertOne: api.insertOne.bind(api),
      insertMany: api.insertMany.bind(api),
      updateOne: api.updateOne.bind(api),
      updateMany: api.updateMany.bind(api),
      deleteOne: api.deleteOne.bind(api),
      deleteMany: api.deleteMany.bind(api),
      // aggregate: api.aggregate.bind(api),
    }
  }, [api, currentUser]);
  return (
    <DataApiContext.Provider value={contextValue}>
      {children}
    </DataApiContext.Provider>
  );
};

export function useDataApi() {
  const api = useContext(DataApiContext);
  if (!api) {
    throw new Error(
      `You must call useDataApi() inside of a <DataApiProvider>.`
    );
  }
  return api;
}
