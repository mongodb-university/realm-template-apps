import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'todo_item.dart';
import '../realm/schemas.dart';
import '../viewmodels/todo_viewmodel.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final _todoViewModels = <TodoViewModel>[];
  final _myListKey = GlobalKey<AnimatedListState>();

  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm?>(context);
    if (realm == null) {
      return Container();
    }
    final stream = realm.all<Todo>().changes;

    return StreamBuilder<RealmResultsChanges<Todo>>(
        stream: stream,
        builder: (context, snapshot) {
          final data = snapshot.data;
          if (data == null) {
            // While we wait for data to load..
            return Container(
              padding: const EdgeInsets.only(top: 25),
              child: const Center(child: Text("No Todos yet!")),
            );
          }

          final todos = data.results;

          // Handle deletions. These are handles first, as indexes refer to the old collection
          for (final deletionIndex in data.deleted) {
            final toDie = _todoViewModels
                .removeAt(deletionIndex); // update view model collection
            _myListKey.currentState?.removeItem(deletionIndex,
                (context, animation) {
              return TodoItem(toDie, animation);
            });
          }

          // Handle inserts
          for (final insertionIndex in data.inserted) {
            _todoViewModels.insert(
                insertionIndex, TodoViewModel(todos[insertionIndex]));
            _myListKey.currentState?.insertItem(insertionIndex);
          }

          // Handle modifications
          for (final modifiedIndex in data.modified) {
            _todoViewModels[modifiedIndex] =
                TodoViewModel(todos[modifiedIndex]);
          }

          // Handle initialization (or any mismatch really, but that shouldn't happen)
          if (todos.length != _todoViewModels.length) {
            _todoViewModels.insertAll(0, todos.map(TodoViewModel.new));
            _todoViewModels.length = todos.length;
          }

          return AnimatedList(
              key: _myListKey,
              initialItemCount: todos.length,
              itemBuilder: (context, index, animation) {
                return TodoItem(_todoViewModels[index], animation);
              });
        });
  }
}
