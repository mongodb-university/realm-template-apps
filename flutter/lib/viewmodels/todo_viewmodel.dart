import 'package:realm/realm.dart';
import '../realm/schemas.dart';

class TodoViewModel {
  final String id;
  final bool isComplete;
  final String summary;
  final Todo todo;

  const TodoViewModel._(this.id, this.isComplete, this.summary, this.todo);
  TodoViewModel(Todo todo)
      : this._(todo.id, todo.isComplete, todo.summary, todo);
}
