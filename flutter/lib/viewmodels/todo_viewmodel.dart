import 'package:realm/realm.dart';
import '../realm/schemas.dart';

class TodoViewModel {
  final ObjectId id;
  String summary;
  bool isComplete;
  final String ownerId;
  late Todo todo;
  final Realm realm;

  TodoViewModel._(this.realm, this.todo, this.id, this.summary, this.ownerId,
      this.isComplete);
  TodoViewModel(Realm realm, Todo todo)
      : this._(
            realm, todo, todo.id, todo.summary, todo.ownerId, todo.isComplete);

  static TodoViewModel create(Realm realm, Todo todo) {
    final todoInRealm = realm.write<Todo>(() => realm.add<Todo>(todo));
    return TodoViewModel(realm, todo);
  }

  void delete() {
    realm.write(() => realm.delete(todo));
  }

  void update({String? summary, bool? isComplete}) {
    realm.write(() {
      if (summary != null) {
        summary = summary;
        todo.summary = summary as String;
      }
      if (isComplete != null) {
        isComplete = isComplete;
        todo.isComplete = isComplete as bool;
      }
    });
  }
}
