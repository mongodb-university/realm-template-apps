import React, {useEffect} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import RealmContext from './RealmContext';

const {useRealm} = RealmContext;

export function OfflineModeButton() {
  const realm = useRealm();

  const [offlineMode, setOfflineMode] = React.useState(
    realm.syncSession?.state === 'inactive',
  );
  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen

  useEffect(() => {
    if (realm.syncSession?.state === 'active' && offlineMode === true) {
      realm.syncSession.pause();
    } else if (
      realm.syncSession?.state === 'inactive' &&
      offlineMode === false
    ) {
      realm.syncSession.resume();
    }
  }, [offlineMode, realm]);

  return (
    <Pressable
      onPress={() => {
        setOfflineMode(!offlineMode);
      }}>
      <Icon
        style={styles.icon}
        name={offlineMode ? 'wifi-off' : 'wifi'}
        type="material"
        tvParallaxProperties={undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {padding: 12},
});
