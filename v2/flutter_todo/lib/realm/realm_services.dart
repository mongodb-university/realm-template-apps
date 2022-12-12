import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';
import 'package:flutter/material.dart';

class RealmServices with ChangeNotifier {
  static const String queryAllName = "getAllItemsSubscriptoion";
  static const String queryMyItemsName = "getMyItemsSubscriptoion";

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
      if (realm.subscriptions.isEmpty) {
        updateSubscriptions();
      }
    }
  }

  void updateSubscriptions() {
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.removeByName(queryAllName);
      mutableSubscriptions.removeByName(queryMyItemsName);
      if (showAll) {
        mutableSubscriptions.add(realm.all<Item>(), name: queryAllName);
      } else {
        mutableSubscriptions.add(realm.query<Item>(r'owner_id == $0', [currentUser?.id]), name: queryMyItemsName);
      }
    });
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
        updateSubscriptions();
        await realm.subscriptions.waitForSynchronization();
      } finally {
        isWaiting = false;
      }
    }
    notifyListeners();
  }

  Future<void> switchSubscription(bool value) async {
    showAll = value;
    updateSubscriptions();
    if (!offlineModeOn) {
      try {
        isWaiting = true;
        notifyListeners();
        await realm.subscriptions.waitForSynchronization();
      } finally {
        isWaiting = false;
      }
    }
    notifyListeners();
  }

  void createItem(String summary, bool isComplete) {
    final newItem = Item(ObjectId(), summary, currentUser!.id, isComplete: isComplete);
    realm.write<Item>(() => realm.add<Item>(newItem));
    notifyListeners();
  }

  void deleteItem(Item item) {
    realm.write(() => realm.delete(item));
    notifyListeners();
  }

  Future<void> updateItem(Item item, {String? summary, bool? isComplete}) async {
    realm.write(() {
      if (summary != null) {
        item.summary = summary;
      }
      if (isComplete != null) {
        item.isComplete = isComplete;
      }
    });
    notifyListeners();
  }

  Future<void> logOutUser() async {
    await currentUser?.logOut();
    currentUser = null;
    realm.close();
  }

  @override
  void dispose() {
    realm.close();
    super.dispose();
  }
}