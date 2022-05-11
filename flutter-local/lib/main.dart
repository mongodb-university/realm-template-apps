import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:provider/provider.dart';
import 'package:realm/realm.dart';
import 'components/todo_list.dart';
import 'components/create_todo.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Provider<Realm>(
      create: (_) => Realm(Configuration([Todo.schema])),
      dispose: (_, realm) => realm.close(),
      child: MaterialApp(
        title: 'Realm Flutter Todo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: const HomePage(title: 'Realm Flutter Todo'),
      ),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: const TodoList(),
      floatingActionButton: const CreateTodo(),
    );
  }
}
