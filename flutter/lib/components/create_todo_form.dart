import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/app_services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';

class CreateTodoForm extends StatefulWidget {
  const CreateTodoForm({Key? key}) : super(key: key);

  @override
  _CreateTodoFormState createState() => _CreateTodoFormState();
}

class _CreateTodoFormState extends State<CreateTodoForm> {
  final _formKey = GlobalKey<FormState>();
  var todoEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;
    final currentUser = Provider.of<AppServices>(context).currentUser;

    return Form(
      key: _formKey,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Text(
            'Create a New Todo',
            style: myTextTheme.headline6,
          ),
          TextFormField(
            controller: todoEditingController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter some text';
              }
              return null;
            },
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
                  child: Consumer<Realm>(
                    builder: (context, realm, child) {
                      return ElevatedButton(
                        child: const Text('Create'),
                        onPressed: () {
                          void createTodo(String name) {
                            realm.write(() {
                              final newTodo = Todo(
                                  Uuid.v4().toString(), name, currentUser!.id);
                              realm.add<Todo>(newTodo);
                            });
                          }

                          if (_formKey.currentState!.validate()) {
                            createTodo(todoEditingController.text);
                            Navigator.pop(context);
                          }
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
