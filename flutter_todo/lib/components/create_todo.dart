import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';
import 'package:uuid/uuid.dart';

const uuid = Uuid();

class CreateTodo extends StatelessWidget {
  const CreateTodo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    void handlePressed() {
      showModalBottomSheet(
        context: context,
        builder: (_) => const CreateTodoForm(),
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
  var todoEditingController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;

    void createTodo(String name) {
      final realm = Provider.of<Realm>(context, listen: false);
      realm.write(() {
        final id = uuid.v4();
        final newTodo = Todo(id.toString(), name);
        realm.add<Todo>(newTodo);
      });
    }

    return Container(
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
                          style: ButtonStyle(backgroundColor: MaterialStateProperty.all(Colors.grey)),
                          onPressed: () => Navigator.pop(context)),
                    ),
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 10),
                      child: ElevatedButton(
                        child: const Text('Create'),
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            createTodo(todoEditingController.text);
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
    );
  }
}
