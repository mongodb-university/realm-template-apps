import React, {useCallback, useState, useEffect} from 'react';
import {BSON} from 'realm';
import {useUser} from '@realm/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {FlatList, StyleSheet, Switch, Text, View} from 'react-native';
import {Button, Overlay, ListItem, Icon} from 'react-native-elements';

import {CreateToDoPrompt} from './CreateToDoPrompt';
import realmContext from './RealmContext';

import {Item} from './ItemSchema';

const {useRealm, useQuery} = realmContext;

export function ItemListView() {
  const realm = useRealm();
  const items = useQuery(Item);
  const user = useUser();

  const [showNewItemOverlay, setShowNewItemOverlay] = useState(false);
  const [showCompletedItems, setShowCompletedItems] = useState(false);

  useEffect(() => {
    const ownItems = realm
      .objects(Item)
      .filtered(
        `owner_id == "${user?.id}"${
          showCompletedItems ? '' : ' AND isComplete == false'
        }`,
      );
    // initialize the subscriptions
    const updateSubscriptions = async () => {
      await realm.subscriptions.update(mutableSubs => {
        // subscribe to all of the logged in user's to-do items
        // use the same name as the initial subscription to update it
        mutableSubs.add(ownItems, {name: 'ownItems'});
      });
    };
    updateSubscriptions();

    // unsubscribe from 'ownItems' when the component unmounts
    return () => {
      realm.subscriptions.update(mutableSubs => {
        mutableSubs.remove(ownItems);
      });
    };
  }, [realm, user, showCompletedItems]);

  // createItem() takes in a summary and then creates an Item object with that summary
  const createItem = useCallback(
    ({summary}: {summary: string}) => {
      // if the realm exists, create an Item
      realm.write(() => {
        return new Item(realm, {
          summary,
          owner_id: user?.id,
        });
      });
    },
    [realm, user],
  );

  // deleteItem() deletes an Item with a particular _id
  const deleteItem = useCallback(
    (id: BSON.ObjectId) => {
      // if the realm exists, get the Item with a particular _id and delete it
      const item = realm.objectForPrimaryKey(Item, id); // search for a realm object with a primary key that is an objectId
      if (item) {
        realm.write(() => {
          realm.delete(item);
        });
      }
    },
    [realm],
  );
  // toggleItemIsComplete() updates an Item with a particular _id to be 'completed'
  const toggleItemIsComplete = useCallback(
    (id: BSON.ObjectId) => {
      // if the realm exists, get the Item with a particular _id and update it's 'isCompleted' field
      const item = realm.objectForPrimaryKey(Item, id); // search for a realm object with a primary key that is an objectId
      if (item) {
        realm.write(() => {
          item.isComplete = !item.isComplete;
        });
      }
    },
    [realm],
  );

  return (
    <SafeAreaProvider>
      <View style={styles.viewWrapper}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleText}>Show Completed Items</Text>
          <Switch
            onValueChange={() => setShowCompletedItems(!showCompletedItems)}
            value={showCompletedItems}
          />
        </View>
        <Overlay
          isVisible={showNewItemOverlay}
          onBackdropPress={() => setShowNewItemOverlay(false)}>
          <CreateToDoPrompt
            onSubmit={({summary}) => {
              setShowNewItemOverlay(false);
              createItem({summary});
            }}
          />
        </Overlay>
        <FlatList
          keyExtractor={item => item._id.toString()}
          data={items}
          style={styles.list}
          renderItem={({item}) => (
            <ListItem
              key={`${item._id}`}
              bottomDivider
              topDivider
              hasTVPreferredFocus={undefined}
              tvParallaxProperties={undefined}>
              <ListItem.Title style={styles.itemTitle}>
                {item.summary}
              </ListItem.Title>
              <ListItem.CheckBox
                checked={item.isComplete}
                iconType="material"
                checkedIcon="check-box"
                uncheckedIcon="check-box-outline-blank"
                onPress={() => toggleItemIsComplete(item._id)}
              />
              <Button
                type="clear"
                onPress={() => deleteItem(item._id)}
                icon={
                  <Icon
                    type="material"
                    name="clear"
                    size={12}
                    color="#979797"
                    tvParallaxProperties={undefined}
                  />
                }
              />
            </ListItem>
          )}
        />
        <Button
          title="Add To-Do"
          buttonStyle={styles.addToDoButton}
          onPress={() => setShowNewItemOverlay(true)}
          icon={
            <Icon
              type="material"
              name={'playlist-add'}
              style={styles.showCompletedIcon}
              color="#fff"
              tvParallaxProperties={undefined}
            />
          }
        />
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
  addToDoButton: {
    backgroundColor: '#00BAD4',
    borderRadius: 4,
    margin: 5,
  },
  showCompletedButton: {
    borderRadius: 4,
    margin: 5,
  },
  showCompletedIcon: {
    marginRight: 5,
  },
  itemTitle: {
    flex: 1,
  },
  list: {},
  listFooter: {
    backgroundColor: '#f00',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
});
