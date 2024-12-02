import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from './pages/Home';
import BluetoothTest from './pages/BluetoothComponent';
import DecisionTreeApp from './pages/DecisionTreeApp';
import AnalysisResult from './pages/AnalysisResult';
import Sensor from './pages/Sensor';
import { BluetoothProvider } from './components/BluetoothProvider';
import Footer from './components/Footer';
// import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <BluetoothProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Footer" screenOptions={{
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS, // Sliding transition preset
      }}>
        <Stack.Screen
          name="Footer"
          component={Footer}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        <Stack.Screen
          name="Dashboard"
          component={BluetoothTest}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        <Stack.Screen
          name="Result"
          component={AnalysisResult}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        <Stack.Screen
          name="SensorMonitoring"
          component={Sensor}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        {/* <Stack.Screen name="Profile" component={BluetoothTest} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </BluetoothProvider>
  );
};

export default App;
