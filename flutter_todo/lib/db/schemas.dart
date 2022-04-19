import 'package:realm/realm.dart';

part 'schemas.g.dart';

@RealmModel()
class _Todo {
  @PrimaryKey()
  late String id;
  bool isComplete = false;
  late String summary;
}
