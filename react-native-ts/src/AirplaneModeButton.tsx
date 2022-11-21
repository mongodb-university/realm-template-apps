import React, {useEffect} from 'react';
import {Pressable, Alert, StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import RealmContext from './RealmContext';

const {useRealm} = RealmContext;

export function AirplaneModeButton() {
  const realm = useRealm();

  const [airplaneMode, setAirplaneMode] = React.useState(
    realm.syncSession?.state === 'inactive',
  );
  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen

  useEffect(() => {
    if (realm.syncSession?.state === 'active' && airplaneMode === true) {
      realm.syncSession.pause();
    } else if (
      realm.syncSession?.state === 'inactive' &&
      airplaneMode === false
    ) {
      realm.syncSession.resume();
    }
  }, [airplaneMode, realm]);

  return (
    <Pressable
      onPress={() => {
        if (!airplaneMode) {
          Alert.alert(
            'Activating Airplane Mode',
            'This will replicate being offline',
            [
              {
                text: 'Yes, Activate Airplane Mode',
                style: 'destructive',
                onPress: () => setAirplaneMode(true),
              },
              {text: 'Cancel', style: 'cancel'},
            ],
          );
        } else {
          setAirplaneMode(false);
        }
      }}>
      <Icon
        style={styles.icon}
        name={airplaneMode ? 'airplanemode-active' : 'airplanemode-inactive'}
        type="material"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {padding: 12},
});
