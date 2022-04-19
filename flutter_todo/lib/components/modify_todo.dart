import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'package:flutter_todo/db/schemas.dart';

class ModifyTodoButton extends StatelessWidget {
  final Todo todo;
  const ModifyTodoButton(this.todo, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    void handlePressed() {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        builder: (BuildContext context) {
          return ModiftyTodoForm(todo);
        },
      );
    }

    return IconButton(icon: const Icon(Icons.edit), onPressed: handlePressed);
  }
}

class ModiftyTodoForm extends StatefulWidget {
  final Todo todo;
  const ModiftyTodoForm(this.todo, {Key? key}) : super(key: key);

  @override
  _ModiftyTodoFormState createState() => _ModiftyTodoFormState();
}

class _ModiftyTodoFormState extends State<ModiftyTodoForm> {
  final _formKey = GlobalKey<FormState>();
  late bool _isComplete;
  String? _summary;
  String? _id;

  @override
  void initState() {
    super.initState();
    _summary = widget.todo.summary;
    _isComplete = widget.todo.isComplete;
    _id = widget.todo.id;
  }

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;

    final realmProvider = Provider.of<RealmProvider>(context);
    final realm = realmProvider.realm;
    void _createTodo(String name) {
      // realm.write(() {
      //   final newTodo = Todo(name);
      //   realm.add<Todo>(newTodo);
      // });
    }

    void _update() {
      print('updating with $_summary');
      // var todo = realm.all<Todo>().query('_id == "${widget.todo._id}"');
      // realm.write(() {
      //   realm.up
      // })
    }

    void _deleteTodo() {
      // todosModel.delete(widget.todo.id);
    }

    void handleTodoRadioChange(bool? value) {
      print('changed value is $value');
      // setState(() {
      //   _status = value;
      // });
    }

    return Padding(
        padding: MediaQuery.of(context).viewInsets,
        child: Container(
          color: Colors.grey.shade100,
          height: 350,
          padding: const EdgeInsets.only(left: 50, right: 50),
          child: Center(
              child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
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
                              _deleteTodo();
                              Navigator.pop(context);
                            }),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          child: const Text('Update'),
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              _update();
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
          )),
        ));
  }
}
