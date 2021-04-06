import React from 'react';
import Realm from 'realm';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, Button} from 'react-native';
import {appId} from '../realm';

const app = Realm.App.getApp(appId);

export function TasksView({navigation, route}) {
  const user = app.currentUser;
  console.log('do user be existing - TasksView??', user);

  return (
    <SafeAreaProvider>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Tasks Screen</Text>
        <Button
          title="Go to Welcome Screen"
          onPress={() => navigation.navigate('Welcome')}
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Log in with the same account on another device or simulator to see
          your list sync in real-time
        </Text>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
});
