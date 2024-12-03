import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import BluetoothTest from "../pages/BluetoothComponent";
import Sensor from "../pages/Sensor";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisV, faGauge, faHamburger, faHeart, faHistory, faInbox, faLineChart, faWorm } from "@fortawesome/free-solid-svg-icons";
import { BleManager } from 'react-native-ble-plx';

const Footer = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showMore, setShowMore] = useState(false);
  // const { setBluetoothData } = useContext(BluetoothContext);
    const [isConnected, setIsConnected] = useState('false');
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

    const [hc05Device, setHc05Device] = useState(null);
    const deviceAddress = '75:DA:C4:8A:87:0D';
    

    useEffect(() => {
      const bleManager = new BleManager();
      setManager(bleManager);
      // checkConnection();
      connectToDevice();
      // Request permissions on Android
      if (Platform.OS === 'android') {
          requestPermissions();
      }
      
      // Start scanning for devices
      // startScan(bleManager);

      // Cleanup on unmount
      return () => {
          // bleManager.stopDeviceScan();
          // bleManager.destroy();
      };
    }, []);

    useEffect(() => {
      // Check connection periodically (e.g., every 5 seconds)
      const interval = setInterval(() => {
        checkConnection();
      }, 1000);
  
      return () => {
        clearInterval(interval);
        // manager.destroy(); // Cleanup the BleManager instance
      };
    }, [deviceId]);

    const checkConnection = async () => {
      if (deviceAddress && manager) {
        try {
          const connected = await manager.isDeviceConnected(deviceAddress);
          console.log(connected)
          if (connected) {
            setIsConnected('true');
            console.log(`Device ${deviceId} is connected.`);
          } else {
            setIsConnected('false');
            // connectToDevice();
            console.log(`Device ${deviceId} is not connected.`);
          }
        } catch (error) {
          console.error('Error checking device connection:', error);
        }
      }
    };

    // useEffect(() => {
    //   // Simulate fetching Bluetooth data
    //   const data = {
    //     temperature: temperature,
    //     moisture: moisture,
    //     phLevel: phLevel,
    //   };
    //   if (temperature !== 0) setIsConnected('true')
    //   setBluetoothData(data);
    // }, [temperature, moisture, phLevel]);

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
      // console.log("manager", manager)
      if (manager) {
          manager.connectToDevice(deviceAddress)
              .then((device) => {
                  setIsConnected(true);
                  setDeviceId(device.id);
                  console.log('Connected to device:', device.id);
                  // console.log(device)

                  setHc05Device(device);
                  setIsConnected('true');
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
                      const temperature = parseFloat(parts[0]); // Extracts temperature, e.g., '28.81'
                      const moisture = parseInt(parts[1], 10);  // Extracts moisture, e.g., '23'
                      const ph = parseFloat(parts[2]);          // Extracts pH level, e.g., '15.21'

                      // Update states
                      setTemperature(temperature);
                      setMoisture(moisture);
                      setPhLevel(ph);
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

  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <BluetoothTest connectToDevice={connectToDevice} isConnected={isConnected} />;
      case "Sensor":
        return <Sensor />;
      default:
        return <BluetoothTest />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      {showMore && 
        <View style={styles.OptionsCon}>
          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4, alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHistory}/>
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}>
            <FontAwesomeIcon icon={faInbox}/>
            <Text style={styles.buttonText}>Vermibeds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHeart}/>
            <Text style={styles.buttonText}>Favorites</Text>
          </TouchableOpacity>
        </View>}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveComponent("Dashboard")}
        >
          <FontAwesomeIcon icon={faGauge}/>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveComponent("Sensor")}
        >
          <FontAwesomeIcon icon={faLineChart}/>
          <Text style={styles.buttonText}>Sensor Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => setShowMore(!showMore)}
        >
          <FontAwesomeIcon icon={faWorm} size={20} color="green"/>
          {/* <Text style={styles.buttonText}>Sensor Monitoring</Text> */}
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
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  button: {
    paddingHorizontal: 10,
    alignItems: 'center',
    // backgroundColor: 'red'
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
