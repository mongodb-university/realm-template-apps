import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'package:realm/realm.dart';
import 'modify_todo.dart';
import 'package:flutter_todo/db/schemas.dart';

class TodoList extends StatefulWidget {
  TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  late RealmResults<Todo> _todos;

  @override
  Widget build(BuildContext context) {
    final realmProvider = Provider.of<RealmProvider>(context);
    final realm = realmProvider.realm;
    setState(() {
      _todos = realm.all<Todo>();
      _todos.changes.listen((changes) {
        print('hello');
        print(changes.results.length);
        setState(() {
          _todos = changes.results;
        });
      });
    });

    return SizedBox(
      height: double.infinity,
      child: ListView.builder(
          itemCount: _todos.length,
          itemBuilder: (_, i) {
            final todo = _todos[i];
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
