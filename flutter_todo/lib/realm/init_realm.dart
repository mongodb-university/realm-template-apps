import 'package:realm/realm.dart';
import 'package:flutter_todo/realm/schemas.dart';
// If you're following the tutorial, import `lib/viewmodels/item_viewmodel.dart`

Realm initRealm(User currentUser) {
  Configuration config = Configuration.flexibleSync(currentUser, [Item.schema]);
  Realm realm = Realm(
    config,
  );
  // If you're following the tutorial, update the following subscription information
  // per the tutorial instructions
  final userItemSub = realm.subscriptions.findByName('getUserItems');
  if (userItemSub == null) {
    realm.subscriptions.update((mutableSubscriptions) {
      // server-side rules ensure user only downloads own items
      mutableSubscriptions.add(realm.all<Item>(), name: 'getUserItems');
    });
  }
  return realm;
}
