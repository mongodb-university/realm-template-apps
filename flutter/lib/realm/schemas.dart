import 'package:realm/realm.dart';

part 'schemas.g.dart';

@RealmModel()
class _Todo {
  @MapTo('_id')
  @PrimaryKey()
  late ObjectId id;
  bool isComplete = false;
  late String summary;
  @MapTo('owner_id')
  late String ownerId;
  late int? priority;
}

enum PriorityLevel { severe, high, medium, low }
