import 'package:flutter/material.dart';
import '../components/todo_list.dart';
import '../components/create_task.dart';
import '../components/app_bar.dart';

class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: TodoAppBar(),
      body: TodoList(),
      floatingActionButton: CreateTask(),
    );
  }
}
