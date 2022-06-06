import 'package:realm/realm.dart';
import '../realm/schemas.dart';

Realm initRealm(User currentUser) {
  Configuration config = Configuration.flexibleSync(currentUser, [Todo.schema]);
  Realm realm = Realm(
    config,
  );
  final userTodoSub = realm.subscriptions.findByName('getUserTodos');
  if (userTodoSub == null) {
    realm.subscriptions.update((mutableSubscriptions) {
      // server-side rules ensure user only downloads own todos
      mutableSubscriptions.add(realm.all<Todo>(), name: 'getUserTodos');
    });
  }
  return realm;
}
