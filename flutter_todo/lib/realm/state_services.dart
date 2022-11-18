import 'package:flutter/material.dart';
import 'package:flutter_todo/realm/realm_services.dart';

class StateServices with ChangeNotifier {
  bool filterOn = false;
  bool airplaneModeOn = false;

  Future<void> sessionSwitch(RealmServices? realmServices) async {
    airplaneModeOn = !airplaneModeOn;
    if (realmServices != null) {
      notifyListeners();
    }
  }

  Future<void> filterSwitch(RealmServices? realmServices) async {
    filterOn = !filterOn;
    if (realmServices != null) {
      await realmServices.filterSwitch(filterOn);
      notifyListeners();
    }
  }
}
