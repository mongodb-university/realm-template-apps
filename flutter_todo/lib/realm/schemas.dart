import 'package:realm/realm.dart';

part 'schemas.g.dart';

@RealmModel()
class _Item {
  @MapTo('_id')
  @PrimaryKey()
  late ObjectId id;
  // If you're following the tutorial, add `late int? priority;` here
  bool isComplete = false;
  late String summary;
  @MapTo('owner_id')
  late String ownerId;
}
