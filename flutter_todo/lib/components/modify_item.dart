import 'package:flutter/material.dart';
import 'package:flutter_todo/viewmodels/item_viewmodel.dart';
// If you're following the tutorial, import the widget you created `select_priority.dart'

void showModifyItemModal(BuildContext context, ItemViewModel item) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (_) => Wrap(children: [ModifyItemForm(item)]),
  );
}

class ModifyItemForm extends StatefulWidget {
  final ItemViewModel item;
  const ModifyItemForm(this.item, {Key? key}) : super(key: key);

  @override
  _ModifyItemFormState createState() => _ModifyItemFormState();
}

class _ModifyItemFormState extends State<ModifyItemForm> {
  final _formKey = GlobalKey<FormState>();
  late bool _isComplete;
  late String _summary;
  // If you're following the tutorial, create a variable `late int _priority`
  // to track the current priority.

  @override
  void initState() {
    super.initState();
    _summary = widget.item.summary;
    _isComplete = widget.item.isComplete;
    // If you're following the tutorial, set `_priority = widget.item.priority;`
  }

  @override
  Widget build(BuildContext context) {
    TextTheme myTextTheme = Theme.of(context).textTheme;
    final item = widget.item;

    void updateItem() {
      // If you're following the tutorial, add `priority: _priority` to `item.update()`
      // to set the item's priority.
      item.update(summary: _summary, isComplete: _isComplete);
    }

    void deleteItem() {
      item.delete();
    }

    // If you're following the tutorial, add a function `void _setPriority(int priority)`
    // to set `_priority = priority` in state.

    void handleItemRadioChange(bool? value) {
      setState(() {
        _isComplete = value ?? false;
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
                Text(
                  'Update Your Item',
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
                // If you're following the tutorial, add `SelectPriority(_priority, _setPriority),`
                // to show the priority selector.
                Column(
                  children: <Widget>[
                    RadioListTile(
                      title: const Text('Complete'),
                      value: true,
                      onChanged: handleItemRadioChange,
                      groupValue: _isComplete,
                    ),
                    RadioListTile(
                      title: const Text('Incomplete'),
                      value: false,
                      onChanged: handleItemRadioChange,
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
                              deleteItem();
                              Navigator.pop(context);
                            }),
                      ),
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 10),
                        child: ElevatedButton(
                          child: const Text('Update'),
                          onPressed: () {
                            if (_formKey.currentState!.validate()) {
                              updateItem();
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
