import React, {useEffect, useState, useMemo} from 'react';
import {BSON} from 'realm';
import {useUser} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Overlay, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import {CreateToDoPrompt} from './CreateToDoPrompt';
import TaskContext from './TaskSchema';

const {useRealm, useQuery} = TaskContext;

Icon.loadFont(); // load FontAwesome font

export function TasksView() {
  const realm = useRealm();
  const result = useQuery('Task');
  const tasks = useMemo(() => result, [result]);
  const user = useUser();
  const [showNewTaskOverlay, setShowNewTaskOverlay] = useState(false);
  
  // :state-uncomment-start: flexible-sync
  // useEffect(() => {
  //   // initialize the subscriptions
  //   const initSubscription = async () => {
  //     await realm.subscriptions.update(mutableSubs => {
  //       // subscribe to all Tasks of the logged in user
  //       const ownTasks = realm
  //         .objects('Task')
  //         .filtered(`owner_id == "${user.id}"`);
  //       mutableSubs.add(ownTasks, {name: "ownTasks"});
  //     });
  //   };
  //   initSubscription();
  // }, [realm, user]);
  // :state-uncomment-end:
  
  // createTask() takes in a summary and then creates a Task object with that summary
  const createTask = ({summary}) => {
    // if the realm exists, create a task
    if (realm) {
      realm.write(() => {
        realm.create('Task', {
          _id: new BSON.ObjectID(),
          // :state-start: partition-based-sync
          _partition: user?.id,
          // :state-end:
          // :state-uncomment-start: flexible-sync
          // owner_id: user.id,
          // :state-uncomment-end:
          summary,
        });
      });
    }
  };

  // deleteTask() deletes a Task with a particular _id
  const deleteTask = _id => {
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
    // if the realm exists, get the Task with a particular _id and update it's 'isCompleted' field
    if (realm) {
      const task = realm.objectForPrimaryKey('Task', _id); // search for a realm object with a primary key that is an objectId
      realm.write(() => {
        task.isComplete = !task.isComplete;
      });
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <Button
          title="+ ADD TO-DO"
          buttonStyle={styles.addToDoButton}
          onPress={() => setShowNewTaskOverlay(true)}
        />
        <Overlay
          isVisible={showNewTaskOverlay}
          onBackdropPress={() => setShowNewTaskOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({summary}) => {
              setShowNewTaskOverlay(false);
              createTask(summary);
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
