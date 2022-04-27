import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'todo_item.dart';
import 'package:flutter_todo/realm/schemas.dart';

const _animationDuration = Duration(milliseconds: 300);

class TodoList extends StatelessWidget {
  const TodoList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final realm = Provider.of<Realm>(context);
    final initTodos = realm.all<Todo>();
    final _myListKey = GlobalKey<AnimatedListState>();

    return StreamBuilder<RealmResultsChanges<Todo>>(
        stream: initTodos.changes,
        builder: (context, snapshot) {
          final todos = snapshot.data?.results;

          // TODO: i had added this summary array so that when the animated list animates
          // out it creates a new todo for the deleted todo. this was done b/c
          // before when i was trying to access the todos[deletionIndex] realm
          // was throwing an error as the todos[deletionIndex] was already deleted.
          // however even this approach isn't working as expected.
          // is there a better implementation here?
          // List<String> summaries = [];
          // todos?.forEach((todo) => summaries.add(todo.summary));

          if (snapshot.hasData) {
            snapshot.data?.deleted.forEach((deletionIndex) {
              if (snapshot.data?.results.isNotEmpty == true) {
                _myListKey.currentState?.removeItem(deletionIndex,
                    (context, animation) {
                  return FadeTransition(
                      opacity: animation,
                      child: SizeTransition(
                          sizeFactor: animation,
                          child: AnimatedSwitcher(
                              key: key,
                              duration: _animationDuration,
                              // TODO: right now only 'Bye by' b/c i can't get it
                              // to properly show the deleted item
                              child: TodoItem(Todo('_', 'Bye bye')))));
                  // child: TodoItem(Todo('_', summaries[deletionIndex])))));
                });
              }
            });
            snapshot.data?.inserted.forEach((insertionIndex) =>
                _myListKey.currentState?.insertItem(insertionIndex));
          }

          // TODO: can this if statement be avoided?
          if (todos == null || todos.isEmpty) {
            return Container(
              padding: const EdgeInsets.only(top: 25),
              child: const Center(child: Text("No Todos yet!")),
            );
          }
          return AnimatedList(
              key: _myListKey,
              initialItemCount: initTodos.length,
              itemBuilder: (context, index, animation) {
                return FadeTransition(
                    opacity: animation,
                    child: SizeTransition(
                        sizeFactor: animation,
                        child: AnimatedSwitcher(
                            key: key,
                            duration: _animationDuration,
                            child: TodoItem(todos[index]))));
              });
        });
  }
}
