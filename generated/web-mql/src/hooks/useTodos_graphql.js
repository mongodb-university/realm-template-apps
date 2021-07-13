import React from "react";
import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import jwt_decode from "jwt-decode";
import { useWatch } from "./useWatch";
import { useCollection } from "./useCollection";
import { useRealmApp } from "../components/RealmApp";
import { baseUrl, dataSourceName } from "../realm.json";
import {
  addValueAtIndex,
  replaceValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  getTodoIndex,
} from "../utils";

function useApolloClient() {
  const realmApp = useRealmApp();
  if (!realmApp.currentUser) {
    throw new Error(`You must be logged in to Realm to call useApolloClient()`);
  }

  const client = React.useMemo(() => {
    const graphqlUri = `${baseUrl}/api/client/v2.0/app/${realmApp.id}/graphql`;
    // Local apps should use a local URI!
    // const graphqlUri = `https://us-east-1.aws.stitch.mongodb.com/api/client/v2.0/app/${realmApp.id}/graphql`

    async function getValidAccessToken() {
      // An already logged in user's access token might be expired. We decode the token and check its
      // expiration to find out whether or not their current access token is stale.
      const { exp } = jwt_decode(realmApp.currentUser.accessToken);
      const isExpired = Date.now() >= exp * 1000;
      if (isExpired) {
        // To manually refresh the user's expired access token, we refresh their custom data
        await realmApp.currentUser.refreshCustomData();
      }
      // The user's access token is now guaranteed to be valid (unless their account is disabled or deleted)
      return realmApp.currentUser.accessToken;
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
  }, [realmApp.currentUser, realmApp.id]);

  return client;
}

export function useTodos() {
  // Get a graphql client and set up a list of todos in state
  const realmApp = useRealmApp();
  const graphql = useApolloClient();
  const [todos, setTodos] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch all todos on load and whenever our graphql client changes (i.e. either the current user OR App ID changes)
  React.useEffect(() => {
    const query = gql`
      query FetchAllTodos {
        tasks {
          _id
          _partition
          isComplete
          summary
        }
      }
    `;
    graphql.query({ query }).then(({ data }) => {
      setTodos(data.tasks);
      setLoading(false);
    });
  }, [graphql]);

  // Use a MongoDB change stream to reactively update state when operations succeed
  const taskCollection = useCollection({
    cluster: dataSourceName,
    db: "todo",
    collection: "Task",
  });
  useWatch(taskCollection, {
    onInsert: (change) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx =
          getTodoIndex(oldTodos, change.fullDocument) ?? oldTodos.length;
        if (idx === oldTodos.length) {
          return addValueAtIndex(oldTodos, idx, change.fullDocument);
        } else {
          return oldTodos;
        }
      });
    },
    onUpdate: (change) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, change.fullDocument);
        return updateValueAtIndex(oldTodos, idx, () => {
          return change.fullDocument;
        });
      });
    },
    onReplace: (change) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, change.fullDocument);
        return replaceValueAtIndex(oldTodos, idx, change.fullDocument);
      });
    },
    onDelete: (change) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, { _id: change.documentKey._id });
        if (idx >= 0) {
          return removeValueAtIndex(oldTodos, idx);
        } else {
          return oldTodos;
        }
      });
    },
  });

  // Given a draft todo, format it and then insert it with a mutation
  const saveTodo = async (draftTodo) => {
    if (draftTodo.summary) {
      draftTodo._partition = realmApp.currentUser.id;
      try {
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
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that we tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  // Toggle whether or not a given todo is complete
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

  // Delete a given todo
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
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
}
