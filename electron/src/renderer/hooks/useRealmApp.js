import { useContext } from 'react';
import { RealmAppContext } from 'renderer/components/RealmApp';

const useRealmApp = () => {
  const realmApp = useContext(RealmAppContext);
  if (!realmApp) {
    throw new Error(
      `No Realm App found. Make sure to call useRealmApp() inside of a <RealmAppProvider />.`
    );
  }
  return realmApp;
};

export default useRealmApp;
