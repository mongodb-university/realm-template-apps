import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/app.dart';

class TodoAppBar extends StatelessWidget with PreferredSizeWidget {
  const TodoAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Future<void> logOut() async {
      await realmApp.currentUser?.logOut();
      Navigator.pushNamed(context, '/login');
    }

    return AppBar(
        title: const Text('Realm Flutter Todo'),
        automaticallyImplyLeading: false,
        actions: realmApp.currentUser != null
            ? <Widget>[
                IconButton(
                  icon: const Icon(Icons.logout),
                  tooltip: 'Log Out Icon',
                  onPressed: logOut,
                ),
              ]
            : null);
  }

  @override
  Size get preferredSize => Size.fromHeight(kToolbarHeight);
}
