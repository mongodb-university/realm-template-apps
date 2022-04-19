import 'package:flutter/material.dart';
import 'package:flutter_todo/db/schemas.dart';
import 'package:realm/realm.dart';

class RealmProvider with ChangeNotifier {
  Realm realm = Realm(Configuration([Todo.schema]));
  bool closed = false;
  void close() {
    realm.close();
    notifyListeners();
  }
}
