import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';
import 'package:flutter/material.dart';

class RealmServices with ChangeNotifier {
  static const String queryName = "getItemsSubscriptoion";
  static const String queryIsCompleteName = "getIsCompleteItemsSubscriptoion";

  bool filterOn = false;
  bool offlineModeOn = false;
  bool isWaiting = false;
  late Realm realm;
  User? currentUser;
  App app;

  RealmServices(this.app) {
    if (app.currentUser != null || currentUser != app.currentUser) {
      currentUser ??= app.currentUser;
      realm = Realm(Configuration.flexibleSync(currentUser!, [Item.schema]));
      filterOn = (realm.subscriptions.findByName(queryIsCompleteName) != null);
      if (realm.subscriptions.isEmpty) {
        updateSubscriptions();
      }
    }
  }

  void updateSubscriptions() {
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.removeByName(queryName);
      mutableSubscriptions.removeByName(queryIsCompleteName);
      if (filterOn) {
        mutableSubscriptions.add(realm.query<Item>(r'isComplete == $1', [currentUser?.id, true]), name: queryIsCompleteName);
      } else {
        mutableSubscriptions.add(realm.all<Item>(), name: queryName);
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
        await realm.subscriptions.waitForSynchronization();
        await realm.syncSession.waitForDownload();
        await realm.syncSession.waitForUpload();
      } finally {
        isWaiting = false;
      }
    }
    notifyListeners();
  }

  Future<void> filterSwitch(bool value) async {
    filterOn = value;
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
    if (!offlineModeOn) {
      await realm.syncSession.waitForUpload();
    }
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
