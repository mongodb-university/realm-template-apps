import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';

// TODO: is this the best way to create the provider?
class RealmProvider {
  Realm realm = Realm(Configuration([Todo.schema]));
}
