import 'package:flutter/material.dart';

Widget formLayout(BuildContext context, Widget? contentWidget) {
  return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
          color: Colors.grey.shade100,
          padding: const EdgeInsets.fromLTRB(50, 25, 50, 25),
          child: Center(
            child: contentWidget,
          )));
}

Widget templateButton(BuildContext context, {Color color = Colors.grey, String text = "button", void Function()? onPressed}) {
  return Container(
    margin: const EdgeInsets.symmetric(horizontal: 10),
    child: ElevatedButton(
      style: ButtonStyle(backgroundColor: MaterialStateProperty.all(color)),
      onPressed: onPressed,
      child: Text(text),
    ),
  );
}

Widget cancelButton(BuildContext context) {
  return templateButton(
    context,
    text: "Cancel",
    onPressed: () => Navigator.pop(context),
  );
}

Widget okButton(BuildContext context, String text, {void Function()? onPressed}) {
  return templateButton(
    context,
    color: Colors.blue,
    text: text,
    onPressed: onPressed,
  );
}

Widget deleteButton(BuildContext context, {void Function()? onPressed}) {
  return templateButton(
    context,
    color: Colors.red,
    text: "Delete",
    onPressed: onPressed,
  );
}

RadioListTile<bool> radioButton(String text, bool value, ValueNotifier<bool> controller) {
  return RadioListTile(
    title: Text(text),
    value: value,
    onChanged: (v) => controller.value = v ?? false,
    groupValue: controller.value,
  );
}
