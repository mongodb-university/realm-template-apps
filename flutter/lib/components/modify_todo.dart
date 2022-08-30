import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:flutter_todo/components/select_priority.dart';
import 'package:realm/realm.dart';
import 'package:flutter_todo/viewmodels/todo_viewmodel.dart';

void showModifyTodoModal(BuildContext context, TodoViewModel todo) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (_) => Wrap(children: [ModifyTodoForm(todo)]),
  );
}

class ModifyTodoForm extends StatefulWidget {
  final TodoViewModel todo;
  const ModifyTodoForm(this.todo, {Key? key}) : super(key: key);

  @override
  _ModifyTodoFormState createState() => _ModifyTodoFormState();
}

class _ModifyTodoFormState extends State<ModifyTodoForm> {
  final _formKey = GlobalKey<FormState>();
  late bool _isComplete;
  late String _summary;
  late int _priority;

  @override
  void initState() {
    super.initState();
    _summary = widget.todo.summary;
    _isComplete = widget.todo.isComplete;
    _priority = widget.todo.priority;
  }

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;

    final todo = widget.todo;

    void updateTodo() {
      todo.update(summary: _summary, isComplete: _isComplete);
    }

    void deleteTodo() {
      todo.delete();
    }

    void handleTodoRadioChange(bool? value) {
      setState(() {
        _isComplete = value ?? false;
      });
    }

    void _setPriority(int priority) {
      setState(() {
        _priority = priority;
      });
    }

    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        color: Colors.grey.shade100,
        padding: const EdgeInsets.only(
          top: 25,
          bottom: 25,
          left: 30,
          right: 30,
        ),
        child: Center(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                SelectPriority(_priority, _setPriority),
                Text(
                  'Update Your Todo',
                  style: myTextTheme.headline6,
                ),
                TextFormField(
                  initialValue: _summary,
                  onChanged: (value) {
                    setState(() {
                      _summary = value;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter some text';
                    }
                    return null;
                  },
                ),
                Column(
                  children: <Widget>[
                    RadioListTile(
                      title: const Text('Complete'),
                      value: true,
                      onChanged: handleTodoRadioChange,
                      groupValue: _isComplete,
                    ),
                    RadioListTile(
                      title: const Text('Incomplete'),
                      value: false,
                      onChanged: handleTodoRadioChange,
                      groupValue: _isComplete,
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 15),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                            child: const Text('Cancel'),
                            style: ButtonStyle(
                                backgroundColor:
                                    MaterialStateProperty.all(Colors.grey)),
                            onPressed: () => Navigator.pop(context)),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                            child: const Text('Delete'),
                            style: ButtonStyle(
                                backgroundColor:
                                    MaterialStateProperty.all(Colors.red)),
                            onPressed: () {
                              deleteTodo();
                              Navigator.pop(context);
                            }),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          child: const Text('Update'),
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              updateTodo();
                              Navigator.pop(context);
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
