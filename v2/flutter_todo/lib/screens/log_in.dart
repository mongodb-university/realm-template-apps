import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_todo/realm/app_services.dart';

class LogIn extends StatefulWidget {
  @override
  _LogInState createState() => _LogInState();
}

class _LogInState extends State<LogIn> {
  bool _isLogin = true;
  String? _errorMessage;

  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  @override
  void initState() {
    _emailController = TextEditingController()..addListener(clearError);
    _passwordController = TextEditingController()..addListener(clearError);
    super.initState();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        padding: const EdgeInsets.all(25),
        child: Form(
          child: SingleChildScrollView(
            child: Column(
            children: [
              Text(_isLogin ? 'Log In' : 'Sign Up', style: const TextStyle(fontSize: 25)),
              loginField(_emailController, labelText: "Email", hintText: "Enter valid email like abc@gmail.com"),
              loginField(_passwordController, labelText: "Password", hintText: "Enter secure password", obscure: true),
              const Text("Please login or register with a Device Sync user account.", textAlign: TextAlign.center),
              const Text("This is separate from your Atlas Cloud login.", textAlign: TextAlign.center),
              Container(
                height: 50,
                width: 250,
                margin: const EdgeInsets.symmetric(vertical: 25),
                decoration: BoxDecoration(color: Colors.blue, borderRadius: BorderRadius.circular(20)),
                child: TextButton(
                  onPressed: () => _logInOrSignUpUser(context, _emailController.text, _passwordController.text),
                  child: Text(
                    _isLogin ? "Log in" : "Sign up",
                    style: const TextStyle(color: Colors.white, fontSize: 20),
                  ),
                ),
              ),
              TextButton(
                  onPressed: () => setState(() => _isLogin = !_isLogin),
                  child: Text(
                    _isLogin ? "New to Flutter Realm Todo? Sign up" : 'Already have an account? Log in.',
                  )),
              Padding(
                padding: const EdgeInsets.all(25),
                child: Text(_errorMessage ?? "", style: const TextStyle(color: Colors.red)),
              ),
            ],
          ),
          ),
        ),
      ),
    );
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

  void clearError() {
    if (_errorMessage != null) {
      setState(() {
        // Reset error message when user starts typing
        _errorMessage = null;
      });
    }
  }

  void _logInOrSignUpUser(BuildContext context, String email, String password) async {
    final appServices = Provider.of<AppServices>(context, listen: false);
    clearError();
    try {
      if (_isLogin) {
        await appServices.logInUserEmailPassword(email, password);
      } else {
        await appServices.registerUserEmailPassword(email, password);
      }
      Navigator.pushNamed(context, '/');
    } catch (err) {
      setState(() {
        _errorMessage = err.toString();
      });
    }
  }
}
