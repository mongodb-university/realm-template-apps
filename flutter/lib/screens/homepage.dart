import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import '../realm/schemas.dart';
import '../realm/app.dart';
import '../components/todo_list.dart';
import '../components/create_todo.dart';
import '../components/app_bar.dart';

Realm initRealm(_) {
  Configuration config =
      Configuration.flexibleSync(realmApp.currentUser!, [Todo.schema]);
  Realm realm = Realm(config);
  realm.subscriptions.update((mutableSubscriptions) {
    // server-side rules ensure user only downloads own todos
    mutableSubscriptions.add(realm.all<Todo>(), name: 'getUserTodos');
  });
  return realm;
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Provider<Realm>(
        create: initRealm,
        dispose: (_, realm) => realm.close(),
        child: const Scaffold(
          appBar: TodoAppBar(),
          body: TodoList(),
          floatingActionButton: CreateTodo(),
        ));
  }
}
