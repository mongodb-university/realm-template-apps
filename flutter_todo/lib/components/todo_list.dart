import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'modify_todo.dart';
import 'package:flutter_todo/realm/schemas.dart';

class TodoList extends StatelessWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm>(context);
    final todos = realm.all<Todo>();
    return StreamBuilder<RealmResultsChanges<Todo>>(
        stream: todos.changes,
        builder: (context, snapshot) {
          final todos = snapshot.data?.results;
          return ListView.builder(
              itemCount: snapshot.data?.results.length ?? 0,
              itemBuilder: (_, i) {
                final todo = todos![i];
                return _SingleTodoView(todo);
              });
        });
  }
}

class _SingleTodoView extends StatelessWidget {
  final Todo todo;

  const _SingleTodoView(this.todo, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text(todo.summary),
        subtitle: todo.isComplete ? const Text('Completed') : const Text('Incomplete'),
        trailing: ModifyTodoButton(todo),
      ),
    );
  }
}
