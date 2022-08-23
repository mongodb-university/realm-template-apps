import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'task_item.dart';
import '../realm/schemas.dart';
import '../realm/app_services.dart';
import '../viewmodels/task_viewmodel.dart';

class TodoList extends StatefulWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  State<TodoList> createState() => _TodoListState();
}

class _TodoListState extends State<TodoList> {
  final _taskViewModels = <TaskViewModel>[];
  final _myListKey = GlobalKey<AnimatedListState>();

  @override
  Widget build(BuildContext context) {
    final currentUser = Provider.of<AppServices>(context).currentUser;
    final realm = Provider.of<Realm?>(context);
    if (realm == null) {
      return Container();
    }
    final stream =
        realm.query<Task>('owner_id == "${currentUser?.id}"').changes;
    return StreamBuilder<RealmResultsChanges<Task>>(
        stream: stream,
        builder: (context, snapshot) {
          final data = snapshot.data;
          if (data == null) {
            // While we wait for data to load..
            return Container(
              padding: const EdgeInsets.only(top: 25),
              child: const Center(child: Text("No Tasks yet!")),
            );
          }

          final tasks = data.results;

          // Handle deletions. These are handles first, as indexes refer to the old collection
          for (final deletionIndex in data.deleted) {
            final toDie = _taskViewModels
                .removeAt(deletionIndex); // update view model collection
            _myListKey.currentState?.removeItem(deletionIndex,
                (context, animation) {
              return TaskItem(toDie, animation);
            });
          }

          // Handle inserts
          for (final insertionIndex in data.inserted) {
            _taskViewModels.insert(
                insertionIndex, TaskViewModel(realm, tasks[insertionIndex]));
            _myListKey.currentState?.insertItem(insertionIndex);
          }

          // Handle modifications
          for (final modifiedIndex in data.modified) {
            _taskViewModels[modifiedIndex] =
                TaskViewModel(realm, tasks[modifiedIndex]);
          }

          // Handle initialization (or any mismatch really, but that shouldn't happen)
          if (tasks.length != _taskViewModels.length) {
            _taskViewModels.insertAll(
                0, tasks.map((task) => TaskViewModel(realm, task)));
            _taskViewModels.length = tasks.length;
          }

          return AnimatedList(
              key: _myListKey,
              initialItemCount: tasks.length,
              itemBuilder: (context, index, animation) {
                return TaskItem(_taskViewModels[index], animation);
              });
        });
  }
}
