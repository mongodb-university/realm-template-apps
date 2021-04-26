import React, {useEffect, useState} from 'react';
import Realm from 'realm';
import {StyleSheet, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont(); // load FontFamily font

export function CreateToDoPrompt(props) {
  const {setNewTaskSummary} = props;
  const [toDoSummary, setToDoSummary] = useState(null);
  return (
    <View style={styles.modalWrapper}>
      <Text h4 style={styles.addTaskTitle}>
        Add Task
      </Text>
      <Input placeholder="New Task Summary" onChangeText={setToDoSummary} />
      <Button
        title="Save"
        buttonStyle={styles.saveButton}
        onPress={() => setNewTaskSummary(toDoSummary)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    width: 300,
    minHeight: 400,
    borderRadius: 4,
    alignItems: 'center',
  },
  addTaskTitle: {
    margin: 20,
  },

  saveButton: {
    width: 280,
  },
});
