import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';
import 'package:flutter/material.dart';

// :snippet-start: realm-services
// :snippet-start: update-subscription-query
// ... imports

class RealmServices with ChangeNotifier {
  static const String queryAllName = "getAllItemsSubscription";
  static const String queryMyItemsName = "getMyItemsSubscription";
  // :state-start: update-subscription-query
  // :emphasize-start:
  static const String queryMyHighPriorityItemsName =
      "getMyHighPriorityItemsSubscription";
  // :emphasize-end:
  // :state-end:

  bool showAll = false;
  bool offlineModeOn = false;
  bool isWaiting = false;
  late Realm realm;
  User? currentUser;
  App app;

  // ... RealmServices initializer
  // :state-start: update-subscription-query
  RealmServices(this.app) {
    if (app.currentUser != null || currentUser != app.currentUser) {
      currentUser ??= app.currentUser;
      realm = Realm(Configuration.flexibleSync(currentUser!, [Item.schema]));
      // :emphasize-start:
      // Check if subscription previously exists on the realm
      final subscriptionDoesNotExists =
          realm.subscriptions.findByName(queryMyHighPriorityItemsName) == null;

      if (realm.subscriptions.isEmpty || subscriptionDoesNotExists) {
        updateSubscriptions();
      }
      // :emphasize-end:
    }
  }

  Future<void> updateSubscriptions() async {
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.clear();
      if (showAll) {
        mutableSubscriptions.add(realm.all<Item>(), name: queryAllName);
      } else {
        // :emphasize-start:
        mutableSubscriptions.add(
            realm.query<Item>(
              r'owner_id == $0 AND priority <= $1',
              [currentUser?.id, PriorityLevel.high],
            ),
            name: queryMyHighPriorityItemsName);
        // :emphasize-end:
      }
    });
    await realm.subscriptions.waitForSynchronization();
  }
  // :state-end:

  // :state-start: update-subscription-query
  // ... other methods
  // :state-end:
  // :state-remove-start: update-subscription-query
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

// :emphasize-start:
  void createItem(String summary, bool isComplete, int? priority) {
    final newItem = Item(ObjectId(), summary, currentUser!.id,
        isComplete: isComplete, priority: priority);
    // :emphasize-end:
    realm.write<Item>(() => realm.add<Item>(newItem));
    notifyListeners();
  }

  void deleteItem(Item item) {
    realm.write(() => realm.delete(item));
    notifyListeners();
  }

  Future<void> updateItem(Item item,
      // :emphasize-start:
      {String? summary,
      bool? isComplete,
      int? priority}) async {
    // :emphasize-end:
    realm.write(() {
      if (summary != null) {
        item.summary = summary;
      }
      if (isComplete != null) {
        item.isComplete = isComplete;
      }
      // :emphasize-start:
      if (priority != null) {
        item.priority = priority;
      }
      // :emphasize-end:
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
  // :state-remove-end:
}
// :snippet-end:

// :emphasize-start:
abstract class PriorityLevel {
  static int severe = 0;
  static int high = 1;
  static int medium = 2;
  static int low = 3;
}

// :emphasize-end:
// :snippet-end:
// :replace-start: {
//    "terms": {
//       "_RealmServicesAgain": "RealmServices"
//    }
// }
// :snippet-start: sync-no-priority
class _RealmServicesAgain with ChangeNotifier {
  static const String queryAllName = "getAllItemsSubscription";
  static const String queryMyItemsName = "getMyItemsSubscription";
  static const String queryMyHighPriorityItemsName =
      "getMyHighPriorityItemsSubscription";
  // :emphasize-start:
  static const String queryMyHighOrNoPriorityItemsName =
      "getMyHighOrNoPriorityItemsSubscription";
  // :emphasize-end:

  bool showAll = false;
  bool offlineModeOn = false;
  bool isWaiting = false;
  late Realm realm;
  User? currentUser;
  App app;

  _RealmServicesAgain(this.app) {
    if (app.currentUser != null || currentUser != app.currentUser) {
      currentUser ??= app.currentUser;
      realm = Realm(Configuration.flexibleSync(currentUser!, [Item.schema]));
      // :emphasize-start:
      // Check if subscription previously exists on the realm
      final subscriptionDoesNotExists =
          realm.subscriptions.findByName(queryMyHighOrNoPriorityItemsName) ==
              null;

      if (realm.subscriptions.isEmpty || subscriptionDoesNotExists) {
        updateSubscriptions();
      }
      // :emphasize-end:
    }
  }

  Future<void> updateSubscriptions() async {
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.clear();
      if (showAll) {
        mutableSubscriptions.add(realm.all<Item>(), name: queryAllName);
      } else {
        // :emphasize-start:
        mutableSubscriptions.add(
            realm.query<Item>(
              r'owner_id == $0 AND priority IN {$1, $2, $3}',
              [currentUser?.id, PriorityLevel.high, PriorityLevel.severe, null],
            ),
            name: queryMyHighPriorityItemsName);
        // :emphasize-end:
      }
    });
    await realm.subscriptions.waitForSynchronization();
  }

  // ... other methods
}
// :snippet-end:
// :replace-end:
