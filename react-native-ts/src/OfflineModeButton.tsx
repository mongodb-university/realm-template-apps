import React, {useEffect, useReducer} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {ConnectionNotificationCallback} from 'realm';
import {useRerender} from './Hooks';
import {realmContext} from './RealmContext';

const {useRealm} = realmContext;

export function OfflineModeButton() {
  const realm = useRealm();

  const rerender = useRerender();

  // Call the rerender function when the connection state changes
  useEffect(() => {
    const notificationCallback: ConnectionNotificationCallback = newState => {
      rerender();
    };
    realm.syncSession?.addConnectionNotification(notificationCallback);
    return () => {
      realm.syncSession?.removeConnectionNotification(notificationCallback);
    };
  }, [realm, rerender]);

  return (
    <Pressable
      onPress={() => {
        if (realm.syncSession?.state === 'active') {
          realm.syncSession.pause();
        } else if (realm.syncSession?.state === 'inactive') {
          realm.syncSession.resume();
        }
      }}>
      <Icon
        style={styles.icon}
        name={realm.syncSession?.state === 'active' ? 'wifi' : 'wifi-off'}
        type="material"
        tvParallaxProperties={undefined}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {padding: 12},
});
