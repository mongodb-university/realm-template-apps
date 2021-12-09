import { useCallback, useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import path from 'path';
import useRealmApp from './useRealmApp';
import { Todo } from 'schemas';

async function getUserDataPath() {
  const userDataPath = await ipcRenderer.invoke('get-user-data-path');
  return userDataPath;
}

async function openRealm(currentUser, schemas) {
  const userDataPath = await getUserDataPath();
  const config = {
    schema: schemas, // predefined schema
    path: path.join(userDataPath, 'my.realm'),
    sync: {
      user: currentUser, // TODO: this isn't being passed to main process properly.
      partitionValue: currentUser?.id,
    },
  };

  try {
    const res = await ipcRenderer.invoke('open-realm', config);
    if (res) {
      const rendererConfig = { ...config, sync: true };
      const realm = new Realm(rendererConfig);
      return realm;
    } else throw new Error("couldn't communicate with main process");
  } catch (err) {
    if (err instanceof Error) {
      console.error('failed to open realm', err.message);
    }
    return null;
  }
}

const useTodos = () => {
  // TODO
  const [realmDb, setRealmDb] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useRealmApp();

  const openTodoRealmCb = useCallback(async () => {
    if (currentUser?.id) {
      const db = await openRealm(currentUser, [Todo]);
      setRealmDb(db);
    }
  }, [currentUser?.id]);

  // open Todos Realm on component mount and user change
  // close realm when component dismounts
  useEffect(() => {
    openTodoRealmCb();

    return () => realmDb?.close();
  }, [currentUser?.id]);

  const fetchUserTodos = useCallback(() => {
    setLoading(true);
    const todosCollection = realmDb.objects('Todo');
    setTodos(todosCollection);
    setLoading(false);
    return todosCollection;
  }, [realmDb?.schema?.length]);

  useEffect(() => {
    if (realmDb) {
      const todosCollection = fetchUserTodos();
      const todosListener = todosCollection.addListener((collection) => {
        setTodos(collection);
      });
      // TODO: was trying to make this work with the `todosListener` variable declared
      // in the previous line w `todosCollection.removeListener(todosListener)`
      // but it was giving me an error saying todosListener is undefined. seems to go
      // against the JS API. verify what's going on here.
      // the current implementation works fine. just less precise && would be good to figure
      // out why the other implementation doesn't work
      return () => {
        todosCollection?.removeAllListeners();
      };
    }
  }, [realmDb?.schema?.length]);

  const saveTodo = async (draftTodo) => {
    realmDb.write(() => {
      realmDb.create('Todo', draftTodo, true);
    });
  };

  const toggleTodo = async (todo) => {
    realmDb.write(() => {
      todo.isComplete = !todo.isComplete;
    });
  };

  const deleteTodo = async (todo) => {
    realmDb.write(() => {
      realmDb.delete(todo);
    });
  };

  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
};

export default useTodos;
