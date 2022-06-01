// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/app_services.dart';

class TodoAppBar extends StatelessWidget with PreferredSizeWidget {
  const TodoAppBar({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currentUser = Provider.of<AppServices>(context).currentUser;

    Future<void> logOut() async {
      await currentUser?.logOut();
      Navigator.pushNamed(context, '/login');
    }

    return AppBar(
        title: const Text('Realm Flutter Todo'),
        automaticallyImplyLeading: false,
        actions: currentUser != null
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
