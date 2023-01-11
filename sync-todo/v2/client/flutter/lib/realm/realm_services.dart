import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';
import 'package:flutter/material.dart';

class RealmServices with ChangeNotifier {
  static const String queryAllName = "getAllItemsSubscription";
  static const String queryMyItemsName = "getMyItemsSubscription";
  // :state-start: tutorial
  // TUTORIAL: Add `queryMyHighPriorityItemsName`
  // :state-end:

  bool showAll = false;
  bool offlineModeOn = false;
  bool isWaiting = false;
  late Realm realm;
  User? currentUser;
  App app;

  RealmServices(this.app) {
    if (app.currentUser != null || currentUser != app.currentUser) {
      currentUser ??= app.currentUser;
      realm = Realm(Configuration.flexibleSync(currentUser!, [Item.schema]));
      showAll = (realm.subscriptions.findByName(queryAllName) != null);
      // :state-start: tutorial
      // TUTORIAL: Check if subscription doesn't exist
      // and update below `if` statement
      // :state-end:
      if (realm.subscriptions.isEmpty) {
        updateSubscriptions();
      }
    }
  }

  Future<void> updateSubscriptions() async {
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.clear();
      if (showAll) {
        mutableSubscriptions.add(realm.all<Item>(), name: queryAllName);
      } else {
        mutableSubscriptions.add(
            // :state-start: tutorial
            // TUTORIAL: Update subscription query
            // :state-end:
            realm.query<Item>(r'owner_id == $0', [currentUser?.id]),
            name: queryMyItemsName);
      }
    });
    await realm.subscriptions.waitForSynchronization();
  }

  Future<void> sessionSwitch() async {
    offlineModeOn = !offlineModeOn;
    if (offlineModeOn) {
      realm.syncSession.pause();
    } else {
      try {
        isWaiting = true;
        notifyListeners();
        realm.syncSession.resume();
        await updateSubscriptions();
      } finally {
        isWaiting = false;
      }
    }
    notifyListeners();
  }

  Future<void> switchSubscription(bool value) async {
    showAll = value;
    if (!offlineModeOn) {
      try {
        isWaiting = true;
        notifyListeners();
        await updateSubscriptions();
      } finally {
        isWaiting = false;
      }
    }
    notifyListeners();
  }

  // :state-start: tutorial
  // TUTORIAL: Add `int priority` parameter to createItem()
  // :state-end:
  void createItem(String summary, bool isComplete) {
    final newItem =
        // :state-start: tutorial
        // TUTORIAL: Add `priority` to `Item`
        // :state-end:
        Item(ObjectId(), summary, currentUser!.id, isComplete: isComplete);
    realm.write<Item>(() => realm.add<Item>(newItem));
    notifyListeners();
  }

  void deleteItem(Item item) {
    realm.write(() => realm.delete(item));
    notifyListeners();
  }

  // :state-start: tutorial
  // TUTORIAL: Add `int priority` parameter to updateItem()
  // and make arguments named with `{}`.
  // :state-end:
  Future<void> updateItem(Item item,
      {String? summary, bool? isComplete}) async {
    realm.write(() {
      if (summary != null) {
        item.summary = summary;
      }
      if (isComplete != null) {
        item.isComplete = isComplete;
      }
      // :state-start: tutorial
      // TUTORIAL: Add if statement check for adding `priority`
      // :state-end:
    });
    notifyListeners();
  }

  Future<void> close() async {
    if (currentUser != null) {
      await currentUser?.logOut();
      currentUser = null;
    }
    realm.close();
  }

  @override
  void dispose() {
    realm.close();
    super.dispose();
  }
}

// :state-start: tutorial
// TUTORIAL: Add `PriorityLevel` abstract class
// :state-end:
