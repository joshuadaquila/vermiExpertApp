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
import { fetchLatestAnalysis, initializeDatabase, insertSampleAnalysis, insertSampleBed } from './components/db';
import { dropAllTables } from './components/db';
import Vermibeds from './pages/Vermibeds';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import HistoryReport from './pages/HistoryReport';
import { ThemeProvider, useTheme } from './components/ThemeContext';
// import ProfileScreen from './ProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const initializeAndInsertData = async () => {
      try {
        // await dropAllTables();
        // Initialize database
        await initializeDatabase();
        // Insert SampleBed
        // await insertSampleBed();
        // // Insert SampleAnalysis only after SampleBed has been successfully inserted
        // await insertSampleAnalysis();

        // await fetchLatestAnalysis();
      } catch (error) {
        console.error("Error during database initialization and sample data insertion:", error);
      }
    };
  
    initializeAndInsertData();
  }, []);
  

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 4 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold'
        }}
        text2Style={{
          fontSize: 12,
          color: '#111211'
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' }}
        contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 4 }}
        text1Style={{
          fontSize: 15,
          fontWeight: 'bold'
        }}
        text2Style={{
          fontSize: 12,
          color: '#111211'
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  };

  return (
    <BluetoothProvider>
    <ThemeProvider>
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
        <Stack.Screen
          name="Vermibeds"
          component={Vermibeds}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        <Stack.Screen
          name="HistoryReport"
          component={HistoryReport}
          options={{ headerShown: false }} // This will hide the header for Home screen
        />
        {/* <Stack.Screen name="Profile" component={BluetoothTest} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    <Toast config={toastConfig}/>
    </ThemeProvider>
    </BluetoothProvider>
  );
};

export default App;
