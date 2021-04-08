import * as React from 'react';
import Realm from 'realm';
import {Button, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appId} from '../realm';

const app = new Realm.App(appId);

export function LogoutButton() {
  const navigation = useNavigation();
  const user = app.currentUser;

  // The signOut function calls the logOut function on the currently
  // logged in user
  const signOut = () => {
    if (user == null) {
      console.warn("Not logged in, can't log out!");
      return;
    }
    user.logOut();
  };

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert('Log Out', null, [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => {
              signOut();
              navigation.popToTop();
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }}
    />
  );
}
