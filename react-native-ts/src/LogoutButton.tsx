import React, {useCallback} from 'react';
import {Pressable, Alert, View, Text} from 'react-native';
import {useUser} from '@realm/react';

export function LogoutButton() {
  const user = useUser();

  // The signOut function calls the logOut function on the currently
  // logged in user and then navigates to the welcome screen
  const signOut = useCallback(() => {
    user?.logOut();
  }, [user]);

  return (
    <Pressable
      onPress={() => {
        Alert.alert('Log Out', '', [
          {
            text: 'Yes, Log Out',
            style: 'destructive',
            onPress: () => signOut(),
          },
          {text: 'Cancel', style: 'cancel'},
        ]);
      }}>
      <View style={{paddingHorizontal: 6}}>
        <Text style={{fontSize: 16, color: '#007AFF'}}>Log Out</Text>
      </View>
    </Pressable>
  );
}
