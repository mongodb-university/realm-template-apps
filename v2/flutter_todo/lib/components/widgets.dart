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

Widget loginField(TextEditingController controller, {String? labelText, String? hintText, bool? obscure}) {
  return Padding(
    padding: const EdgeInsets.all(15),
    child: TextField(
        obscureText: obscure ?? false,
        controller: controller,
        decoration: InputDecoration(border: const OutlineInputBorder(), labelText: labelText, hintText: hintText)),
  );
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
    color: forestGreenColor,
    text: text,
    onPressed: onPressed,
  );
}

Widget deleteButton(BuildContext context, {void Function()? onPressed}) {
  return templateButton(
    context,
    color: darkRedColor,
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

Widget styledBox({bool isHeader = false, Widget? child}) {
  return Container(
    width: double.infinity,
    decoration: BoxDecoration(
      color: const Color.fromRGBO(227, 252, 247, 1),
      border: Border(
          top: isHeader
              ? BorderSide.none
              : BorderSide(width: 2, color: forestGreenColor),
          bottom: isHeader
              ? BorderSide(width: 2, color: forestGreenColor)
              : BorderSide.none),
    ),
      child: Padding(
      padding: const EdgeInsets.all(15),
        child: child,
    ),
  );
}

Widget styledFloatingAddButton(BuildContext context, {required void Function() onPressed}) {
  return Padding(
    padding: const EdgeInsets.only(bottom: 5),
    child: FloatingActionButton(
      elevation: 0,
      backgroundColor: Colors.white,
      onPressed: onPressed,
      tooltip: 'Add',
      child: Padding(
        padding: const EdgeInsets.all(3),
        child: CircleAvatar(
          radius: 26,
          backgroundColor: forestGreenColor,
          foregroundColor: Colors.white,
          child: const Icon(Icons.add),
        ),
      ),
    ),
  );
}

void showSnackBar(BuildContext context, String title, String error,
    {int durationInSeconds = 15}) {
  ScaffoldMessenger.of(context).hideCurrentSnackBar();
  ScaffoldMessenger.of(context).showSnackBar(
    errorMessageWidget(title, error),
  );
  Future.delayed(Duration(seconds: durationInSeconds)).then((value) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
  });
}

SnackBar errorMessageWidget(String title, String message) {
  final textColor = darkRedColor;
  return SnackBar(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Colors.transparent,
      margin: const EdgeInsets.only(bottom: 100.0),
      dismissDirection: DismissDirection.none,
      elevation: 0,
      content: SizedBox(
          height: 105,
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
                    Expanded(child: Text(message, style: TextStyle(color: textColor))),
                  ],
                )),
          )));
}

MaterialColor forestGreenColor = MaterialColor(
  const Color.fromRGBO(0, 104, 74, 1).value,
  const <int, Color>{
    50: Color.fromRGBO(0, 104, 74, 0.1),
    100: Color.fromRGBO(0, 104, 74, 0.2),
    200: Color.fromRGBO(0, 104, 74, 0.3),
    300: Color.fromRGBO(0, 104, 74, 0.4),
    400: Color.fromRGBO(0, 104, 74, 0.5),
    500: Color.fromRGBO(0, 104, 74, 0.6),
    600: Color.fromRGBO(0, 104, 74, 0.7),
    700: Color.fromRGBO(0, 104, 74, 0.8),
    800: Color.fromRGBO(0, 104, 74, 0.9),
    900: Color.fromRGBO(0, 104, 74, 1),
  },
);

MaterialColor mistColor = MaterialColor(
  const Color.fromRGBO(227, 252, 247, 1).value,
  const <int, Color>{
    50: Color.fromRGBO(227, 252, 247, 0.1),
    100: Color.fromRGBO(227, 252, 247, 0.2),
    200: Color.fromRGBO(227, 252, 247, 0.3),
    300: Color.fromRGBO(227, 252, 247, 0.4),
    400: Color.fromRGBO(227, 252, 247, 0.5),
    500: Color.fromRGBO(227, 252, 247, 0.6),
    600: Color.fromRGBO(227, 252, 247, 0.7),
    700: Color.fromRGBO(227, 252, 247, 0.8),
    800: Color.fromRGBO(227, 252, 247, 0.9),
    900: Color.fromRGBO(227, 252, 247, 1),
  },
);

Color get darkRedColor => const Color.fromARGB(255, 91, 29, 25);
