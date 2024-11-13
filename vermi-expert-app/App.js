import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import BluetoothTest from './pages/BluetoothComponent';
import DecisionTreeApp from './pages/DecisionTreeApp';
// import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        <Stack.Screen name="Profile" component={DecisionTreeApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
