import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';

class RealmServices {
  late Realm realm;
  User? currentUser;
  App app;

  RealmServices(this.app) {
    if (app.currentUser != null || currentUser != app.currentUser) {
      currentUser ??= app.currentUser;
      realm = initRealm(currentUser!);
      updateSubscriptions();
    }
  }

  Future<void> sessionOff(bool sessionOff) async {
    if (sessionOff) {
      realm.syncSession.pause();
    } else {
      realm.syncSession.resume();
      await realm.syncSession.waitForDownload();
      await realm.syncSession.waitForUpload();
    }
  }

  Future<void> filterSwitch(bool isFilterOn) async {
    updateSubscriptions(isFilterOn: isFilterOn);
    await realm.subscriptions.waitForSynchronization();
  }

  Realm initRealm(User currentUser) {
    Configuration config = Configuration.flexibleSync(currentUser, [Item.schema]);
    Realm realm = Realm(
      config,
    );
    return realm;
  }

  void updateSubscriptions({bool isFilterOn = false}) {
    RealmResults<Item> query;
    const String queryName = "getItemsSubscriptoion";
    if (isFilterOn) {
      query = realm.query<Item>(r'owner_id == $0 AND isComplete == $1', [currentUser?.id, true]);
    } else {
      query = realm.query<Item>(r'owner_id == $0', [currentUser?.id]);
    }
    realm.subscriptions.update((mutableSubscriptions) {
      mutableSubscriptions.removeByName(queryName);
      mutableSubscriptions.add(query, name: queryName);
    });
  }

  void dispose() {
    if (currentUser == null) {
      realm.close();
    }
  }
}
