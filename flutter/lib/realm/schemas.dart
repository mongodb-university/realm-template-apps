import 'package:realm/realm.dart';

part 'schemas.g.dart';

@RealmModel()
class _Todo {
  @MapTo('_id')
  @PrimaryKey()
  late String id;
  bool isComplete = false;
  late String summary;
  @MapTo('owner_id')
  late String ownerId;
}
