import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import '../realm/schemas.dart';
import '../realm/app_services.dart';
import '../components/todo_list.dart';
import '../components/create_todo.dart';
import '../components/app_bar.dart';

Realm initRealm(User currentUser) {
  Configuration config = Configuration.flexibleSync(currentUser, [Todo.schema]);
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
    return Consumer<AppServices>(
      builder: (context, app, child) {
        if (app.currentUser != null) {
          return Provider<Realm>(
              create: (_) => initRealm(app.currentUser!),
              dispose: (_, realm) => realm.close(),
              child: const Scaffold(
                appBar: TodoAppBar(),
                body: TodoList(),
                floatingActionButton: CreateTodo(),
              ));
        } else {
          return Container();
        }
      },
    );
  }
}
