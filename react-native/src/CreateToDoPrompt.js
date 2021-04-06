import * as React from 'react';
import Realm from 'realm';
import {StyleSheet, Text, View} from 'react-native';
import {appId} from '../realm';

const app = new Realm.App(appId);

export function CreateToDoPrompt() {
  return (
    <View>
      <Text>Add a To Do item</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
