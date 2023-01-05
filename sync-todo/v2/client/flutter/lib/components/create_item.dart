// :snippet-start: create-item
// ... other imports
// :remove-start:
import 'package:flutter/material.dart';
import 'package:flutter_todo/components/widgets.dart';
import 'package:flutter_todo/realm/realm_services.dart';
import 'package:provider/provider.dart';
// :remove-end:
// :emphasize-start:
import 'package:flutter_todo/components/select_priority.dart';
// :emphasize-end:

// ... CreateItemAction widget

// :remove-start:
class CreateItemAction extends StatelessWidget {
  const CreateItemAction({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return styledFloatingAddButton(context,
        onPressed: () => showModalBottomSheet(
              isScrollControlled: true,
              context: context,
              builder: (_) => Wrap(children: const [CreateItemForm()]),
            ));
  }
}
// :remove-end:

class CreateItemForm extends StatefulWidget {
  const CreateItemForm({Key? key}) : super(key: key);

  @override
  createState() => _CreateItemFormState();
}

class _CreateItemFormState extends State<CreateItemForm> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _itemEditingController;
  // :emphasize-start:
  int _priority = PriorityLevel.low;
  // :emphasize-end:

  // :emphasize-start:
  void _setPriority(int priority) {
    setState(() {
      _priority = priority;
    });
  }
  // :emphasize-end:

  // ... initState() and dispose() @override functions
  // :remove-start:
  @override
  void initState() {
    _itemEditingController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _itemEditingController.dispose();
    super.dispose();
  }
  // :remove-end:

  @override
  Widget build(BuildContext context) {
    TextTheme theme = Theme.of(context).textTheme;
    return formLayout(
        context,
        Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              // ... Text and TextFormField widgets
              // :remove-start:
              Text("Create a new item", style: theme.headline6),
              TextFormField(
                controller: _itemEditingController,
                validator: (value) =>
                    (value ?? "").isEmpty ? "Please enter some text" : null,
              ),
              // :remove-end:
              // :emphasize-start:
              SelectPriority(_priority, _setPriority),
              // :emphasize-end:
              // ... Padding widget
              // :remove-start:
              Padding(
                padding: const EdgeInsets.only(top: 15),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    cancelButton(context),
                    Consumer<RealmServices>(
                        builder: (context, realmServices, child) {
                      return okButton(context, "Create",
                          onPressed: () => save(realmServices, context));
                    }),
                  ],
                ),
              ),
              // :remove-end:
            ],
          ),
        ));
  }

  void save(RealmServices realmServices, BuildContext context) {
    if (_formKey.currentState!.validate()) {
      final summary = _itemEditingController.text;
      // :emphasize-start:
      realmServices.createItem(summary, false, _priority);
      // :emphasize-end:
      Navigator.pop(context);
    }
  }
}
// :snippet-end:
