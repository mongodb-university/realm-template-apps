import 'package:flutter/material.dart';

class StateServices with ChangeNotifier {
  bool filterOn = false;
  bool airplaneModeOn = false;

  Future<void> sessionSwitch() async {
    airplaneModeOn = !airplaneModeOn;
    notifyListeners();
  }

  Future<void> filterSwitch() async {
    filterOn = !filterOn;
    notifyListeners();
  }
}
