import React, {useCallback} from 'react';
import {Button, Alert} from 'react-native';
import {useUser} from '@realm/react';

export function LogoutButton() {
  const user = useUser();

  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen
  const signOut = useCallback(() => {
    user?.logOut();
  }, [user]);

  return (
    <Button
      title="Log Out"
      onPress={() => {
        Alert.alert('Log Out', '', [
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
