import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/app_services.dart';
import 'package:flutter_todo/viewmodels/todo_viewmodel.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/schemas.dart';
import 'package:realm/realm.dart';

class CreateTask extends StatelessWidget {
  const CreateTask({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    void handlePressed() {
      showModalBottomSheet(
        isScrollControlled: true,
        context: context,
        builder: (_) => Wrap(children: const [_CreateTaskFormWrapper()]),
      );
    }

    return FloatingActionButton(
      onPressed: handlePressed,
      tooltip: 'Add',
      child: const Icon(Icons.add),
    );
  }
}

class _CreateTaskFormWrapper extends StatelessWidget {
  const _CreateTaskFormWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding:
            EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
            color: Colors.grey.shade100,
            // height: 200,
            padding:
                const EdgeInsets.only(top: 25, bottom: 25, left: 50, right: 50),
            child: const Center(
              child: CreateTaskForm(),
            )));
  }
}

class CreateTaskForm extends StatefulWidget {
  const CreateTaskForm({Key? key}) : super(key: key);

  @override
  _CreateTaskFormState createState() => _CreateTaskFormState();
}

class _CreateTaskFormState extends State<CreateTaskForm> {
  final _formKey = GlobalKey<FormState>();
  var taskEditingController = TextEditingController();

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
            'Create a New Task',
            style: myTextTheme.headline6,
          ),
          TextFormField(
            controller: taskEditingController,
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
                          if (_formKey.currentState!.validate()) {
                            print('pressed again');
                            final summary = taskEditingController.text;
                            TaskViewModel.create(realm,
                                Task(ObjectId(), summary, currentUser!.id));
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
