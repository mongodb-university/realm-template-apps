import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// import {Logout} from './components/Logout';
// import {WelcomeView} from './views/WelcomeView';
// import {TasksView} from './views/TasksView';

const WelcomeView = () => {
  return <Text>Welcome View</Text>;
};

const TasksView = () => {
  return <Text>Tasks View</Text>;
};

const Logout = () => {
  return <Text>Logout</Text>;
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeView} />
          <Stack.Screen
            name="Tasks"
            component={TasksView}
            options={{
              headerLeft: function Header() {
                return <Logout />;
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Built with the MongoDB Realm Sync Template
        </Text>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
});

export default App;
