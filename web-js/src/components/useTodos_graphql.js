import React from "react";
import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { APP_ID } from "./App";
import { useRealmApp } from "./RealmApp";

function useApolloClient() {
  const realmApp = useRealmApp();
  if (!realmApp.currentUser) {
    throw new Error(`You must be logged in to Realm to call useApolloClient()`);
  }

  const client = React.useMemo(() => {
    const graphqlUri = `https://realm.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`;
    // Local apps should use a local URI!
    // const graphqlUri = `https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/app/${APP_ID}/graphql`
    async function getValidAccessToken() {
      // An already logged in user's access token might be stale. To guarantee that the token is
      // valid, we refresh the user's custom data which also refreshes their access token.
      await realmApp.currentUser.refreshCustomData();
      return realmApp.currentUser.accessToken
    }
    return new ApolloClient({
      link: new HttpLink({
        uri: graphqlUri,
        // We define a custom fetch handler for the Apollo client that lets us authenticate GraphQL requests.
        // The function intercepts every Apollo HTTP request and adds an Authorization header with a valid
        // access token before sending the request.
        fetch: async (uri, options) => {
          const accessToken = await getValidAccessToken();
          options.headers.Authorization = `Bearer ${accessToken}`;
          return fetch(uri, options);
        },
      }),
      cache: new InMemoryCache(),
    });
  }, [realmApp.currentUser]);

  return client;
}

export function useTodos() {
  const realmApp = useRealmApp();
  const graphql = useApolloClient();
  const taskCollection = React.useMemo(() => {
    const mdb = realmApp.currentUser.mongoClient("mongodb-atlas");
    return mdb.db("todo").collection("Task");
  }, [realmApp.currentUser]);
  const [todos, setTodos] = React.useState([]);
  React.useEffect(() => {
    const fetchTodos = async () => {
      const { data } = await graphql.query({
        query: gql`
          query FetchAllTasks {
            tasks {
              _id
              _partition
              isComplete
              summary
            }
          }
        `,
      });
      return data.tasks
    };

    const watchTodos = async () => {
      for await (const change of taskCollection.watch({ filter: {} })) {
        const getTodoIndex = (todos) =>
          todos.findIndex(
            (t) => String(t._id) === String(change.documentKey._id)
          );
        switch (change.operationType) {
          case "insert": {
            setTodos((t) => [...t, change.fullDocument]);
            break;
          }
          case "update":
          case "replace": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos);
              return [
                ...oldTodos.slice(0, idx),
                change.fullDocument,
                ...oldTodos.slice(idx + 1),
              ];
            });
            break;
          }
          case "delete": {
            setTodos((oldTodos) => {
              const idx = getTodoIndex(oldTodos);
              return [...oldTodos.slice(0, idx), ...oldTodos.slice(idx + 1)];
            });
            break;
          }
          default: {
            // change.operationType will always be one of the specified cases, so we should never hit this default
          }
        }
      }
    };
    fetchTodos().then((t) => {
      setTodos(t);
      watchTodos();
    });
  }, [taskCollection, graphql]);

  const saveTodo = async (draftTodo) => {
    draftTodo._partition = realmApp.currentUser.id;
    await graphql.mutate({
      mutation: gql`
        mutation SaveTask($todo: TaskInsertInput!) {
          insertOneTask(data: $todo) {
            _id
            _partition
            isComplete
            summary
          }
        }
      `,
      variables: { todo: draftTodo },
    });
  };

  const toggleTodo = async (todo) => {
    await graphql.mutate({
      mutation: gql`
        mutation ToggleTaskComplete($taskId: ObjectId!) {
          updateOneTask(query: { _id: $taskId }, set: { isComplete: ${!todo.isComplete} }) {
            _id
            _partition
            isComplete
            summary
          }
        }
      `,
      variables: { taskId: todo._id },
    });
  };

  const deleteTodo = async (todo) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteTask($taskId: ObjectId!) {
          deleteOneTask(query: { _id: $taskId }) {
            _id
          }
        }
      `,
      variables: { taskId: todo._id },
    });
  };

  return {
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
}
