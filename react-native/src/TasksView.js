import React, {useEffect, useState, useRef} from 'react';
import Realm from 'realm';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {appId} from '../realm';
import {Button, Overlay, ListItem} from 'react-native-elements';
import {CreateToDoPrompt} from './CreateToDoPrompt';
import TaskSchema from './TaskSchema';

const app = Realm.App.getApp(appId);

export function TasksView({navigation, route}) {
  const [tasks, setTasks] = useState([]);
  const [newTaskSummary, setNewTaskSummary] = useState(null);
  const [createToDoOverlayVisible, setCreateToDoOverlayVisible] = useState(
    false,
  );

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmReference = useRef(null);

  // run after render
  useEffect(() => {
    const config = {
      schema: [TaskSchema],
      sync: {
        user: app.currentUser,
        partitionValue: `user=${app.currentUser.id}`,
      },
    };

    Realm.open(config)
      .then(realmInstance => {
        console.log('realm opens!!');
        realmReference.current = realmInstance;
        // Get all Task items, sorted by name
        const sortedTasks = realmReference.current
          .objects('Task')
          .sorted('summary');
        console.log('woah task', sortedTasks);
        // set the sorted Tasks to state as an array, so they can be rendered as a list
        setTasks([...sortedTasks]);
        // watch for changes to the Task collection, when tasks are created,
        // modified or deleted the 'sortedTasks' variable will update with the new
        // live Task objects, and then the Tasks in state will be updated to the
        // sortedTasks
        sortedTasks.addListener(() => {
          console.log('something happened in the realm');
          setTasks([...sortedTasks]);
        });
      })
      .catch(err => {
        console.log(`an error occurred opening the realm ${err}`);
      });

    // cleanup function to close realm after component unmounts
    return () => {
      // if the realm exists in our realmReference, close the realm
      if (realmReference.current) {
        realmReference.current.close();
        realmReference.current = null; // set the reference to null so it can't be used again
        setTasks([]); // set the Tasks state to an empty array since the component is unmounting
      }
    };
  }, [navigation]);

  const createTask = newTaskName => {
    const realm = realmReference.current;
    console.log(realmReference.isClosed);
    realm.write(() => {
      realm.create('Task', {
        summary: newTaskName,
      });
    });
  };

  const toggleTaskIsComplete = _id => {
    const realm = realmReference.current;
    const task = realm.objectForPrimaryKey('Task', _id); // search for a realm object with a primary key that is an objectId
    realm.write(() => {
      task.isComplete = !task.isComplete;
    });
  };

  // toggleCreateToDoOverlayVisible toggles the model to add a to-do item
  const toggleCreateToDoOverlayVisible = () => {
    setCreateToDoOverlayVisible(!createToDoOverlayVisible);
  };

  console.log('list of tasks', tasks);
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
          <CreateToDoPrompt setNewTaskSummary={value => createTask(value)} />
        </Overlay>
        {tasks.map((task, i) => (
          <ListItem key={`${task._id}`} bottomDivider topDivider>
            <ListItem.Title>{task.summary}</ListItem.Title>
            <ListItem.CheckBox
              containerStyle={styles.taskCheckBox}
              checked={task.isComplete}
              onPress={() => toggleTaskIsComplete(task._id)}
            />
          </ListItem>
        ))}
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
  taskCheckBox: {
    marginLeft: 280,
  },
});
