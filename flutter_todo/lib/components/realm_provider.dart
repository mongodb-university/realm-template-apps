import 'package:flutter/material.dart';
import 'package:flutter_todo/db/schemas.dart';
import 'package:realm/realm.dart';

class RealmProvider {
  Realm realm = Realm(Configuration([Todo.schema]));
}
