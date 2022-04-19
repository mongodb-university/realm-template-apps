import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'package:realm/realm.dart';
import 'modify_todo.dart';
import 'package:flutter_todo/realm/schemas.dart';

class TodoList extends StatefulWidget {
  TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  late RealmResults<Todo> _todos;

  void changeListenerCb(changes) {
    setState(() {
      _todos = changes.results;
    });
  }

  @override
  void dispose() async {
    super.dispose();

    await _todos.changes.listen(changeListenerCb).cancel();
  }

  @override
  Widget build(BuildContext context) {
    // TODO: better to use Provider.of or Consumer?
    final realmProvider = Provider.of<RealmProvider>(context);
    final realm = realmProvider.realm;

    if (mounted) {
      setState(() {
        _todos = realm.all<Todo>();
      });
    }

    return SizedBox(
      height: double.infinity,
      // TODO: understand why this works and if there's a better way to do it.
      child: StreamBuilder(
          stream: _todos.changes,
          builder: (context, snapshot) {
            return ListView.builder(
                itemCount: _todos.length,
                itemBuilder: (_, i) {
                  final todo = _todos[i];
                  return _SingleTodoView(todo);
                });
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
