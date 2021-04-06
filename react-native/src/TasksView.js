import React, {useEffect, useState} from 'react';
import Realm from 'realm';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {appId} from '../realm';
import {Button, Overlay} from 'react-native-elements';
import {CreateToDoPrompt} from './CreateToDoPrompt';

const app = Realm.App.getApp(appId);

export function TasksView({navigation, route}) {
  const [tasks, setTasks] = useState([]);
  const [createToDoOverlayVisible, setCreateToDoOverlayVisible] = useState(
    false,
  );

  // toggleCreateToDoOverlayVisible toggles the model to add a to-do item
  const toggleCreateToDoOverlayVisible = () => {
    setCreateToDoOverlayVisible(!createToDoOverlayVisible);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Text>Tasks Screen</Text>
        <Button
          title="+ ADD TO-DO"
          buttonStyle={styles.addToDoButton}
          onPress={toggleCreateToDoOverlayVisible}
        />
        <Overlay
          isVisible={createToDoOverlayVisible}
          onBackdropPress={toggleCreateToDoOverlayVisible}>
          <CreateToDoPrompt />
        </Overlay>
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
  viewWrapper: {
    flex: 1,
  },
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
  addToDoButton: {
    backgroundColor: '#00BAD4',
    width: 150,
    borderRadius: 4,
    margin: 5,
  },
});
