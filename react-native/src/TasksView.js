import React, {useEffect, useState, useRef} from 'react';
import Realm from 'realm';
import {BSON} from 'realm';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Overlay, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CreateToDoPrompt} from './CreateToDoPrompt';
import TaskSchema from './TaskSchema';
import {realmApp} from './RealmApp';

Icon.loadFont(); // load FontAwesome font

export function TasksView({navigation}) {
  const [tasks, setTasks] = useState([]);

  // state value for toggable visibility of the 'CreateToDoPrompt' Model in the UI
  const [createToDoOverlayVisible, setCreateToDoOverlayVisible] = useState(
    false,
  );

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmReference = useRef(null);

  useEffect(() => {
    const config = {
      schema: [TaskSchema],
      sync: {
        user: realmApp.currentUser,
        partitionValue: realmApp.currentUser?.id,
      },
    };

    Realm.open(config)
      .then(realmInstance => {
        realmReference.current = realmInstance;
        const realm = realmReference.current;
        // if the realm exists, get all Task items and add a listener on the Task collection
        if (realm) {
          // Get all Task items, sorted by name
          const sortedTasks = realmReference.current
            .objects('Task')
            .sorted('summary');
          // set the sorted Tasks to state as an array, so they can be rendered as a list
          setTasks([...sortedTasks]);
          // watch for changes to the Task collection. When tasks are created,
          // modified or deleted the 'sortedTasks' variable will update with the new
          // live Task objects, and then the Tasks in state will be updated to the
          // sortedTasks
          sortedTasks.addListener(() => {
            setTasks([...sortedTasks]);
          });
        }
      })
      .catch(err => {
        console.log(`an error occurred opening the realm ${err}`);
      });

    // cleanup function to close realm after component unmounts
    return () => {
      const realm = realmReference.current;
      // if the realm exists, close the realm
      if (realm) {
        realm.close();
        // set the reference to null so the realm can't be used after it is closed
        realmReference.current = null;
        setTasks([]); // set the Tasks state to an empty array since the component is unmounting
      }
    };
  }, [realmReference, setTasks]);

  // createTask() takes in a summary and then creates a Task object with that summary
  const createTask = summary => {
    const realm = realmReference.current;
    // if the realm exists, create a task
    if (realm) {
      realm.write(() => {
        realm.create('Task', {
          _id: new BSON.ObjectID(),
          summary,
        });
      });
    }
  };

  // deleteTask() deletes a Task with a particular _id
  const deleteTask = _id => {
    const realm = realmReference.current;
    // if the realm exists, get the Task with a particular _id and delete it
    if (realm) {
      const task = realm.objectForPrimaryKey('Task', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        realm.delete(task);
      });
    }
  };

  // toggleTaskIsComplete() updates a Task with a particular _id to be 'completed'
  const toggleTaskIsComplete = _id => {
    const realm = realmReference.current;
    // if the realm exists, get the Task with a particular _id and update it's 'isCompleted' field
    if (realm) {
      const task = realm.objectForPrimaryKey('Task', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        task.isComplete = !task.isComplete;
      });
    }
  };

  // toggleCreateToDoOverlayVisible toggles the visibility of the 'CreateToDoPrompt' Model in the UI
  const toggleCreateToDoOverlayVisible = () => {
    setCreateToDoOverlayVisible(!createToDoOverlayVisible);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Button
          title="+ ADD TO-DO"
          buttonStyle={styles.addToDoButton}
          onPress={toggleCreateToDoOverlayVisible}
        />
        <Overlay
          isVisible={createToDoOverlayVisible}
          onBackdropPress={toggleCreateToDoOverlayVisible}>
          <CreateToDoPrompt
            setNewTaskSummary={value => {
              toggleCreateToDoOverlayVisible();
              createTask(value);
            }}
          />
        </Overlay>
        {tasks.map(task => (
          <ListItem key={`${task._id}`} bottomDivider topDivider>
            <ListItem.Title style={styles.taskTitle}>
              {task.summary}
            </ListItem.Title>
            <ListItem.CheckBox
              checked={task.isComplete}
              onPress={() => toggleTaskIsComplete(task._id)}
            />
            <Button
              type="clear"
              icon={
                <Icon
                  name="times"
                  size={12}
                  color="#979797"
                  onPress={() => deleteTask(task._id)}
                />
              }
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
  taskTitle: {
    minWidth: 275,
  },
});
