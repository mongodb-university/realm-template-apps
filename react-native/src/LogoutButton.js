import * as React from 'react';
import Realm from 'realm';
import {Button, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {appId} from '../realm';

if (!appId) {
  throw 'Missing Realm App ID. Set your App ID in realm.json';
}
const app = Realm.App.getApp(appId);

export function LogoutButton() {
  const navigation = useNavigation();
  const user = app.currentUser;

  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen
  const signOut = () => {
    if (user) {
      user.logOut();
    }
    navigation.popToTop();
  };

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert('Log Out', null, [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => signOut(),
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }}
    />
  );
}
