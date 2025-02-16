import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from './pages/Home';
import BluetoothTest from './pages/BluetoothComponent';
import DecisionTreeApp from './pages/DecisionTreeApp';
import AnalysisResult from './pages/AnalysisResult';
import Sensor from './pages/Sensor';
import { BluetoothProvider } from './components/BluetoothProvider';
import Footer from './components/Footer';
import { fetchLatestAnalysis, initializeDatabase, insertDefaultPlants, insertSampleAnalysis, insertSampleBed } from './components/db';
import { dropAllTables } from './components/db';
import Vermibeds from './pages/Vermibeds';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import HistoryReport from './pages/HistoryReport';
import { StatusBar, View } from 'react-native';
import PlantDetail from './pages/PlantDetail';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initializeAndInsertData = async () => {
      try {

        // Initialize database and insert default data
        // await dropAllTables();
        await initializeDatabase();
        await insertDefaultPlants();
        
      } catch (error) {
        console.error("Error during database initialization and sample data insertion:", error);
      }
    };

    initializeAndInsertData();
  }, []);

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 4 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 12,
          color: '#111211',
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 4 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 12,
          color: '#111211',
        }}
      />
    ),
  };

  return (
    <BluetoothProvider>
      <NavigationContainer>
        {/* Global Status Bar */}
        <StatusBar
          backgroundColor="#1F4529" // Change to your desired color
          barStyle="light-content" // Change text and icon color
        />
        <Stack.Navigator
          initialRouteName="Footer"
          screenOptions={{
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS, // Sliding transition preset
          }}
        >
          <Stack.Screen
            name="Footer"
            component={Footer}
            options={{ headerShown: false }} // Hide header for Footer
          />
          <Stack.Screen
            name="Dashboard"
            component={BluetoothTest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Result"
            component={AnalysisResult}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SensorMonitoring"
            component={Sensor}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlantDetail"
            component={PlantDetail}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HistoryReport"
            component={HistoryReport}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </BluetoothProvider>
  );
};

export default App;
