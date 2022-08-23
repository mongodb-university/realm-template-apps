import 'package:realm/realm.dart';
import 'package:flutter_todo/realm/schemas.dart';

class TaskViewModel {
  final ObjectId id;
  String summary;
  bool isComplete;
  final String ownerId;
  late Task task;
  final Realm realm;

  TaskViewModel._(this.realm, this.task, this.id, this.summary, this.ownerId,
      this.isComplete);
  TaskViewModel(Realm realm, Task task)
      : this._(
            realm, task, task.id, task.summary, task.ownerId, task.isComplete);

  static TaskViewModel create(Realm realm, Task task) {
    final taskInRealm = realm.write<Task>(() => realm.add<Task>(task));
    return TaskViewModel(realm, task);
  }

  void delete() {
    realm.write(() => realm.delete(task));
  }

  void update({String? summary, bool? isComplete}) {
    realm.write(() {
      if (summary != null) {
        summary = summary;
        task.summary = summary as String;
      }
      if (isComplete != null) {
        isComplete = isComplete;
        task.isComplete = isComplete as bool;
      }
    });
  }
}
