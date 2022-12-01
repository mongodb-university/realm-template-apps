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

Widget styledBox({Widget? child}) {
  return Container(
      width: double.infinity,
      decoration: const BoxDecoration(color: Color.fromARGB(255, 205, 202, 202)),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(15, 5, 15, 5),
        child: child,
      ));
}

Widget styledFloatingAddButton(BuildContext context, {required void Function() onPressed}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 5),
    child: FloatingActionButton(
      elevation: 0,
      backgroundColor: Colors.white,
      onPressed: onPressed,
      tooltip: 'Add',
      child: const Padding(
        padding: EdgeInsets.all(3),
        child: CircleAvatar(
          radius: 26,
          backgroundColor: Colors.blue,
          child: Icon(Icons.add),
        ),
      ),
    ),
  );
}

SnackBar errorMessageWidget(String title, String message) {
  final textColor = Color.fromARGB(255, 113, 18, 11);
  return SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      margin: const EdgeInsets.only(bottom: 200.0),
      dismissDirection: DismissDirection.none,
      elevation: 0,
      content: SizedBox(
          height: 95,
          child: Center(
            child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    border: Border.all(color: Colors.black),
                    color: const Color.fromARGB(255, 244, 223, 221),
                    borderRadius: const BorderRadius.all(Radius.circular(8))),
                child: Column(
                  children: [
                    Text(title, style: TextStyle(color: textColor, fontWeight: FontWeight.bold)),
                    Text(message, style: TextStyle(color: textColor)),
                  ],
                )),
          )));
}
