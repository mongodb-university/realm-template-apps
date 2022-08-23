import 'package:realm/realm.dart';
import '../realm/schemas.dart';

Realm initRealm(User currentUser) {
  Configuration config = Configuration.flexibleSync(currentUser, [Task.schema]);
  Realm realm = Realm(
    config,
  );
  final userTaskSub = realm.subscriptions.findByName('getUserTasks');
  if (userTaskSub == null) {
    realm.subscriptions.update((mutableSubscriptions) {
      // server-side rules ensure user only downloads own tasks
      mutableSubscriptions.add(realm.all<Task>(), name: 'getUserTasks');
    });
  }
  return realm;
}
