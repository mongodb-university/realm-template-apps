import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'todo_item.dart';
import 'package:flutter_todo/realm/schemas.dart';

final _animationDuration = const Duration(milliseconds: 200);

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

          // TODO: i added this summary array so that when the animated list animates
          // out it creates a new todo for the deleted todo. this was done b/c
          // before when i was trying to access the todos[deletionIndex] realm
          // was throwing an error as the todos[deletionIndex] was already deleted
          // is there a better implementation here?
          List<String> summaries = [];
          todos?.forEach((todo) => summaries.add(todo.summary));

          snapshot.data?.deleted.forEach((deletionIndex) {
            _myListKey.currentState?.removeItem(deletionIndex,
                (context, animation) {
              return FadeTransition(
                  opacity: animation,
                  child: SizeTransition(
                      sizeFactor: animation,
                      child: AnimatedSwitcher(
                          key: key,
                          duration: _animationDuration,
                          child:
                              TodoItem(Todo('_', summaries[deletionIndex])))));
            });
          });
          snapshot.data?.inserted.forEach((insertionIndex) =>
              _myListKey.currentState?.insertItem(insertionIndex));

          // TODO: how to avoid this?
          // if i don't have this, then there's an error on page load
          print(todos?.length);
          if (todos?.length == null) {
            return const SizedBox.shrink();
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
                            child: TodoItem(todos![index]))));
              });
        });
  }
}
