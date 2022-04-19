import 'package:flutter/material.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'package:provider/provider.dart';
import 'components/todo_list.dart';
import 'components/create_todo.dart';
import 'components/realm_provider.dart';

void main() async {
  runApp(Provider<RealmProvider>(
      create: (context) => RealmProvider(), child: const App()));
}

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Todo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(title: 'Flutter Todo'),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: TodoList(),
      floatingActionButton: const CreateTodo(),
    );
  }
}
