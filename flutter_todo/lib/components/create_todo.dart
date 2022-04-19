import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/components/realm_provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:uuid/uuid.dart';

const uuid = Uuid();

class CreateTodo extends StatelessWidget {
  const CreateTodo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    void handlePressed() {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        builder: (BuildContext context) {
          return const CreateTodoForm();
        },
      );
    }

    return FloatingActionButton(
      onPressed: handlePressed,
      tooltip: 'Add',
      child: const Icon(Icons.add),
    );
  }
}

class CreateTodoForm extends StatefulWidget {
  const CreateTodoForm({Key? key}) : super(key: key);

  @override
  _CreateTodoFormState createState() => _CreateTodoFormState();
}

class _CreateTodoFormState extends State<CreateTodoForm> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;
    final todoEditingController = TextEditingController();
    // TODO: better to use Provider.of or Consumer?
    return Consumer<RealmProvider>(
      builder: (context, realmProvider, child) {
        final realm = realmProvider.realm;
        void _createTodo(String name) {
          realm.write(() {
            final id = uuid.v4();
            final newTodo = Todo(id.toString(), name);
            realm.add<Todo>(newTodo);
          });
        }

        return Padding(
            padding: MediaQuery.of(context).viewInsets,
            child: Container(
              color: Colors.grey.shade100,
              height: 200,
              padding: const EdgeInsets.only(left: 50, right: 50),
              child: Center(
                  child: Form(
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
                      autofocus: true,
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
                            child: ElevatedButton(
                              child: const Text('Create'),
                              onPressed: () {
                                if (_formKey.currentState!.validate()) {
                                  _createTodo(todoEditingController.text);
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
      },
    );
  }
}
