import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Platform, PermissionsAndroid, Alert } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import BluetoothTest from "../pages/BluetoothComponent";
import Sensor from "../pages/Sensor";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisV, faGauge, faHamburger, faHeart, faHistory, faHomeLg, faInbox, faInfoCircle, faLineChart, faWorm } from "@fortawesome/free-solid-svg-icons";
import { BleManager } from 'react-native-ble-plx';
import BtStat from "./BTStat";
import Vermibeds from "../pages/Vermibeds";
import About from "../pages/About";
import History from "../pages/History";
import { Buffer } from 'buffer';
import { useTheme } from "./ThemeContext";
import Favorites from "../pages/Favorites";

const Footer = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showMore, setShowMore] = useState(false);
  const [alertShown, setAlertShown] = useState(false)
  const [bluetoothData, setBluetoothData] = useState({})
  // const { setBluetoothData } = useContext(BluetoothContext);
  const [isConnected, setIsConnected] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [devices, setDevices] = useState([]);
  const [manager, setManager] = useState(null);
  const [receivedData, setReceivedData] = useState('');
  const [showBedForm, setShowBedForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const [temperature, setTemperature]= useState(0);
  const [moisture, setMoisture] = useState(0);
  const [phLevel, setPhLevel] = useState(0);
  const [selectedBedId, setSelectedBedId] = useState(0);
  const [hc05Device, setHc05Device] = useState(null);
  const deviceAddress = '75:DA:C4:8A:87:0D';
  
  // console.log("Footer Rendered")
  useEffect(() => {
    const bleManager = new BleManager();
    setManager(bleManager);
    // checkConnection();
    connectToDevice();
    // Request permissions on Android
    if (Platform.OS === 'android') {
        requestPermissions();
    }
    
    return () => {
        // bleManager.stopDeviceScan();
        // bleManager.destroy();
    };
  }, []);

  useEffect(() => {
      // Only set up the interval if not connected
    if (isConnected) return;

    const interval = setInterval(() => {
      checkConnection(); // Perform connection check
    }, 2000);
    
    return () => {
      clearInterval(interval);
      // manager.destroy(); // Cleanup the BleManager instance
    };
  }, [isConnected, deviceId, manager]);

    const checkConnection = async () => {
      if (deviceAddress && manager) {
        try {
          const connected = await manager.isDeviceConnected(deviceAddress);
          // console.log(connected)
          if (connected) {
            setIsConnected(true);
            // console.log(`Device ${deviceId} is connected.`);
          } else {
            setIsConnected(false);
            connectToDevice();
            // console.log(`Device ${deviceId} is not connected.`);
          }
        } catch (error) {
          console.error('Error checking device connection:', error);
        }
      }
    };

    useEffect(() => {
      if (manager) {
        const subscription = manager.onStateChange((state) => {
          // console.log('Bluetooth state changed:', state);
          // console.log('Alert', alertShown)
          if (state === 'PoweredOff') {
            setIsBluetoothOn(false)
          } else if (state === 'PoweredOn'){
            setIsBluetoothOn(true);
          }
        }, true); // `true` ensures the current state is checked immediately
  
        return () => {
          subscription.remove(); // Cleanup on unmount
        };
      }
    }, [manager]);

    const setupOnDeviceDisconnected = (deviceIdToMonitor) => {
      if (manager) {
        manager.onDeviceDisconnected(deviceIdToMonitor, disconnectedListener);
      }
    };
    
    const disconnectedListener = (error, device) => {
      if (error) {
        console.error('Device disconnected with error:', error);
        return;
      }
      if (device) {
        console.info('Device disconnected:', device.id);
        setIsConnected(false)
    
      }
    };
    
    // Inside useEffect for connection setup
    useEffect(() => {
      if (isConnected && deviceId) {
        setupOnDeviceDisconnected(deviceId);
      }
    }, [isConnected, deviceId, manager]);
  

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          if (
              granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
              granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
          ) {
              console.log('Bluetooth scan and connect permissions granted');
          } else {
              console.log('Bluetooth permissions not granted');
          }
      }
  };

  const connectToDevice = () => {
      console.log("conecting")
      if (manager) {
          manager.connectToDevice(deviceAddress)
              .then((device) => {
                  setDeviceId(device.id);
                  console.log('Connected to device:', device.id);
                  setIsConnected(true);
                  // Discover services and characteristics
                  return device.discoverAllServicesAndCharacteristics();
                  
              })
              .then((device) => {
                  // Start listening to notifications from the device (replace with your characteristic UUID)
                  console.log("trying to read")
                  const characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; // Replace with your characteristic UUID
                  device.monitorCharacteristicForService('0000ffe0-0000-1000-8000-00805f9b34fb', characteristicUUID, (error, characteristic) => {
                      if (error) {
                          console.log('Error reading characteristic:', error);
                          return;
                      }

                      const data = characteristic.value
                        ? Buffer.from(characteristic.value, 'base64').toString('utf-8')  // Decoding base64 to UTF-8 string
                        : '';

                      // Split the data by newlines
                      const parts = data.split('\n');  // Split by newline

                      // console.log(data);
                      const temperature = parseFloat(parseFloat(parts[0]).toFixed(2)); // Ensures two decimal places
                      const moisture = parseFloat(parseFloat(parts[1]).toFixed(2));    // Ensures two decimal places
                      const ph = parseFloat(parseFloat(parts[2]).toFixed(2));          // Ensures two decimal places


                      // Update states
                      setTemperature(temperature);
                      setMoisture(moisture);
                      setPhLevel(ph);

                      // console.log("ACTUAL DATA", temperature, moisture, ph)

                  });
              })
              .catch((error) => {
                  console.log('Connection errorr', error);
              });
      }
  };

  const disconnectFromDevice = () => {
      if (manager && deviceId) {
          manager.disconnectFromDevice(deviceId)
              .then(() => {
                  setIsConnected(false);
                  setDeviceId(null);
                  setReceivedData(''); // Clear the received data on disconnect
                  console.log('Disconnected from device');
              })
              .catch((error) => {
                  console.log('Disconnection error', error);
              });
      }
  };

  useEffect(()=>{
    setBluetoothData({temperature: temperature, moisture: moisture, phLevel: phLevel})
  }, [temperature, moisture, phLevel])

  // console.log("bluetoothdata", bluetoothData);
  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <BluetoothTest sensorVal={bluetoothData} connectToDevice={connectToDevice} isConnected={isConnected} 
          navigation={navigation} isBluetoothOn={isBluetoothOn} />;
      case "Sensor":
        return <Sensor bluetoothData={bluetoothData}/>;
      case "Vermibeds":
        return <Vermibeds />
      case "About":
        return <About />
      case "History":
        return <History navigation={navigation}/>
      case "Favorites":
        return <Favorites navigation={navigation}/>
      default:
        return <BluetoothTest />;
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: isDarkMode? '#111211' : 'white'}]}>
      <BtStat status={isConnected}
      message={`${isConnected? "Sensors connected!" : !isBluetoothOn?  "Bluetooth is off, and sensors are disconnected." :"Sensors disconnected. Reconnecting..."}`} clicked={connectToDevice}/>
      <View style={styles.content}>
        {renderContent()}
      </View>
      {showMore && 
        <View style={[styles.OptionsCon, {backgroundColor: isDarkMode? 'white' : 'white'}]}>
          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4, alignItems: 'center'}}
            onPress={() => {setActiveComponent("History"); setShowMore(false)}}

          >
            <FontAwesomeIcon icon={faHistory} style={{color: isDarkMode? '#111211' : '#111211'}}/>
            <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : '#111211'}]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}
             onPress={() => {setActiveComponent("Vermibeds"); setShowMore(false)}}
          >
            <FontAwesomeIcon icon={faInbox} style={{color: isDarkMode? '#111211' : '#111211'}}/>
            <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : '#111211'}]}>Vermibeds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}
            onPress={() => {setActiveComponent("Favorites"); setShowMore(false)}}
          >
            <FontAwesomeIcon icon={faHeart} style={{color: isDarkMode? '#111211' : '#111211'}}/>
            <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : '#111211'}]}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}
            onPress={() => {setActiveComponent("About"); setShowMore(false)}}
          >
            <FontAwesomeIcon icon={faInfoCircle} style={{color: isDarkMode? '#111211' : '#111211'}}/>
            <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : '#111211'}]}>About Us</Text>
          </TouchableOpacity>
        </View>}
      <View style={[styles.footer, {backgroundColor: isDarkMode? '#ffffff' : '#111211'}]}>
        

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isConnected) { //isConnected
              setActiveComponent("Sensor");
            } else {
              Alert.alert(
                "Sensors Disconnected!", // Alert title
                "Please check your connection and try again.", // Alert message
                [{ text: "OK", onPress: () => console.log("OK Pressed") }] // Buttons
              );
            }
          }}
        >
          <FontAwesomeIcon icon={faLineChart} style={{color: isDarkMode? '#111211' : 'white'}}/>
          <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : 'white'}]}>Sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveComponent("Dashboard")}
        >
          <FontAwesomeIcon icon={faHomeLg} size={25} style={{color: isDarkMode? '#111211' : 'white'}}/>
          <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : 'white'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.wormbutton}
            onPress={() => setShowMore(!showMore)}
        >
          <FontAwesomeIcon icon={faWorm} style={{color: isDarkMode? '#111211' : 'white'}} />
          <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : 'white'}]}>More</Text>
        </TouchableOpacity>
      </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#111211'
  },
  content: {
    flex: 1,
    backgroundColor: "#111211",
    // paddingBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  button: {
    paddingHorizontal: 10,
    alignItems: 'center',

  },
  wormbutton: {
    paddingHorizontal: 10,
    // paddingVertical: 5,
    alignItems: 'center',
    // backgroundColor: 'red',
    // height: 'auto'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#111211",
    marginHorizontal: 4
  },
  OptionsCon: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 50,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  }
  
});

export default Footer;
