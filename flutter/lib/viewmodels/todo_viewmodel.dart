import 'package:realm/realm.dart';
import 'package:flutter_todo/realm/schemas.dart';

class TodoViewModel {
  final ObjectId id;
  String summary;
  bool isComplete;
  int priority;
  final String ownerId;
  late Todo todo;
  final Realm realm;

  TodoViewModel._(this.realm, this.todo, this.id, this.summary, this.ownerId,
      this.isComplete, this.priority);
  TodoViewModel(Realm realm, Todo todo)
      : this._(realm, todo, todo.id, todo.summary, todo.ownerId,
            todo.isComplete, todo.priority ?? PriorityLevel.low);

  static TodoViewModel create(Realm realm, Todo todo) {
    final todoInRealm = realm.write<Todo>(() => realm.add<Todo>(todo));
    return TodoViewModel(realm, todo);
  }

  void delete() {
    realm.write(() => realm.delete<Todo>(todo));
  }

  void update({String? summary, bool? isComplete, int? priority}) {
    realm.write(() {
      if (summary != null) {
        summary = summary;
        todo.summary = summary as String;
      }
      if (isComplete != null) {
        isComplete = isComplete;
        todo.isComplete = isComplete as bool;
      }
      if (priority != null) {
        this.priority = priority;
        todo.priority = priority;
      }
    });
  }
}

abstract class PriorityLevel {
  static int severe = 0;
  static int high = 1;
  static int medium = 2;
  static int low = 3;
}
