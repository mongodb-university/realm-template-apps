import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'modify_todo.dart';
import 'package:flutter_todo/db/schemas.dart';

class TodoList extends StatelessWidget {
  TodoList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realmProvider = Provider.of<RealmProvider>(context);
    final realm = realmProvider.realm;
    final todos = realm.all<Todo>();
    return SizedBox(
      height: double.infinity,
      child: ListView.builder(
          itemCount: todos.length,
          itemBuilder: (_, i) {
            final todo = todos[i];
            return _SingleTodoView(todo);
          }),
    );
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
        subtitle: todo.isComplete
            ? const Text('Completed')
            : const Text('Incomplete'),
        trailing: ModifyTodoButton(todo),
      ),
    );
  }
}
