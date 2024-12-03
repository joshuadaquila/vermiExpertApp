import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Import Buffer from the 'buffer' package
import { faBars, faDroplet, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Alert, Text, FlatList, TouchableOpacity} from "react-native";
import BluetoothNotice from "../components/BluetoothNotice";
import BtStat from "../components/BTStat";
import BedDetailForm from '../components/BedDetailForm';
import Sidebar from '../components/Sidebar';
import { BluetoothContext } from '../components/BluetoothProvider';
import { useContext } from 'react';
import Loader from '../components/Loader';

const BluetoothTest = ({ navigation, connectToDevice, isConnected}) => {
    const { setBluetoothData } = useContext(BluetoothContext);
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
    

    // useEffect(() => {
    //   const bleManager = new BleManager();
    //   setManager(bleManager);
    //   // checkConnection();
    //   connectToDevice();
    //   // Request permissions on Android
    //   if (Platform.OS === 'android') {
    //       requestPermissions();
    //   }
      
    //   // Start scanning for devices
    //   // startScan(bleManager);

    //   // Cleanup on unmount
    //   return () => {
    //       // bleManager.stopDeviceScan();
    //       // bleManager.destroy();
    //   };
    // }, []);
    // useEffect(() => {
    //   const subscription = bleManager.onStateChange((state) => {
    //     console.log('Bluetooth state changed:', state);
  
    //     if (state !== 'PoweredOn') {
    //       Alert.alert(
    //         'Bluetooth Disabled',
    //         'Please enable Bluetooth.',
    //         [{ text: 'OK', onPress: () => console.log('Alert dismissed') }]
    //       );
    //     }
    //   }, true); // `true` ensures the current state is checked immediately
  
    //   return () => {
    //     subscription.remove(); // Cleanup on unmount
    //   };
    // }, []);

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
    

   

    // useEffect(() => {
    //   // Check connection periodically (e.g., every 5 seconds)
    //   const interval = setInterval(() => {
    //     checkConnection();
    //   }, 1000);
  
    //   return () => {
    //     clearInterval(interval);
    //     // manager.destroy(); // Cleanup the BleManager instance
    //   };
    // }, [deviceId]);

    // console.log(manager)
    // useEffect(() => {
    //   const subscription = bleManager.onDeviceDisconnected(deviceAddress, (error, device) => {
    //     if (error) {
    //       console.error('Error during disconnection:', error);
    //     } else {
    //       console.log('Device disconnected:', device.id);
    //       connectToDevice();
    //       setIsConnected('false');
    //     }
    //   });
    
    //   return () => {
    //     subscription.remove(); // Cleanup on component unmount
    //   };
    // }, [bleManager, deviceId]);
    

    // const checkConnection = async () => {
    //   if (deviceAddress) {
    //     try {
    //       const connected = await bleManager.isDeviceConnected(deviceAddress);
    //       console.log(connected)
    //       if (connected) {
    //         setIsConnected('true');
    //         console.log(`Device ${deviceId} is connected.`);
    //       } else {
    //         setIsConnected('false');
    //         // connectToDevice();
    //         console.log(`Device ${deviceId} is not connected.`);
    //       }
    //     } catch (error) {
    //       console.error('Error checking device connection:', error);
    //     }
    //   }
    // };

    // const requestPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         const granted = await PermissionsAndroid.requestMultiple([
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    //             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //         ]);
    //         if (
    //             granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
    //             granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
    //         ) {
    //             console.log('Bluetooth scan and connect permissions granted');
    //         } else {
    //             console.log('Bluetooth permissions not granted');
    //         }
    //     }
    // };

    // const connectToDevice = () => {
    //     // console.log("manager", manager)
    //     if (manager) {
    //         manager.connectToDevice(deviceAddress)
    //             .then((device) => {
    //                 setIsConnected(true);
    //                 setDeviceId(device.id);
    //                 console.log('Connected to device:', device.id);
    //                 // console.log(device)

    //                 setHc05Device(device);
    //                 setIsConnected('true');
    //                 // Discover services and characteristics
    //                 return device.discoverAllServicesAndCharacteristics();
                    
    //             })
    //             .then((device) => {
    //                 // Start listening to notifications from the device (replace with your characteristic UUID)
    //                 console.log("trying to read")
    //                 const characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; // Replace with your characteristic UUID
    //                 device.monitorCharacteristicForService('0000ffe0-0000-1000-8000-00805f9b34fb', characteristicUUID, (error, characteristic) => {
    //                     if (error) {
    //                         console.log('Error reading characteristic:', error);
    //                         return;
    //                     }

    //                     const data = characteristic.value
    //                       ? Buffer.from(characteristic.value, 'base64').toString('utf-8')  // Decoding base64 to UTF-8 string
    //                       : '';

    //                     // Split the data by newlines
    //                     const parts = data.split('\n');  // Split by newline

    //                     // console.log(data);
    //                     const temperature = parseFloat(parts[0]); // Extracts temperature, e.g., '28.81'
    //                     const moisture = parseInt(parts[1], 10);  // Extracts moisture, e.g., '23'
    //                     const ph = parseFloat(parts[2]);          // Extracts pH level, e.g., '15.21'

    //                     // Update states
    //                     setTemperature(temperature);
    //                     setMoisture(moisture);
    //                     setPhLevel(ph);
    //                 });
    //             })
    //             .catch((error) => {
    //                 console.log('Connection errorr', error);
    //             });
    //     }
    // };

    // const disconnectFromDevice = () => {
    //     if (manager && deviceId) {
    //         manager.disconnectFromDevice(deviceId)
    //             .then(() => {
    //                 setIsConnected(false);
    //                 setDeviceId(null);
    //                 setReceivedData(''); // Clear the received data on disconnect
    //                 console.log('Disconnected from device');
    //             })
    //             .catch((error) => {
    //                 console.log('Disconnection error', error);
    //             });
    //     }
    // };

    console.log(temperature)
    const data = {temp: temperature, moisturelvl: moisture, ph: phLevel}

    const proceedToResult = () =>{
      navigation.navigate("Result", data)
    }

   return (
    <View style={styles.main}>
      {showLoader && <Loader/>}
      {showSidebar&& <Sidebar toggleThis={()=> setShowSidebar(false)} menu={"dashboard"}/>}
      {isConnected && <BtStat status={isConnected}
      message={`${isConnected === 'true'? "Bluetooth connected!" : isConnected === 'connecting'?  "Connecting..." :"Sensors disconnected. Tap to connect!"}`} clicked={connectToDevice}/>}
      {showBedForm && (
        <BedDetailForm 
          cancel={() => setShowBedForm(false)} 
          bedSet={() => {
            setShowBedForm(false);
            setShowLoader(true);
            
            setTimeout(() => {
              setShowLoader(false);
              proceedToResult();
            }, 6000);  // Trigger proceedToResult after 5 seconds
          }}
        />
      )}

      <View style={{ padding: 10 }}>
        
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {/* <TouchableOpacity onPress={()=> setShowSidebar(true)}>
           <FontAwesomeIcon icon={faBars} color="white" style={{ marginRight: 10 }} />

          </TouchableOpacity> */}
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }}>
            <Text style={{ color: '#111211', alignSelf: 'flex-start', fontWeight: 'bold' }}>DASHBOARD</Text>
          </View>
        </View>

        <View style={styles.latestAss}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, color: 'white' }}>Latest Assessment</Text>
          <View style={styles.gridContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>BED NAME</Text>
              <Text style={{ color: 'white' }}>Sample Bed</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>DATE</Text>
              <Text style={{ color: 'white' }}>2024-11-03 11:00</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>CONCLUSION</Text>
              <Text style={{ color: 'white' }}>Favorable</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.propertyCon}>
            <Text style={{ color: 'white' }}>Temperature</Text>

            <View style={styles.propertyInner}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faTemperature2} color="white" />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>26</Text>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'right' }}>C</Text>
              </View>
            </View>
          </View>

          <View style={styles.propertyCon}>
            <Text style={{ color: 'white' }}>Moisture</Text>

            <View style={styles.propertyInner}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faWater} color="white" />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>75</Text>

              <View style={{ width: '100%' }}>
                <Text style={{ color: 'white', textAlign: 'right' }}>%</Text>
              </View>
            </View>
          </View>

          <View style={styles.propertyCon}>
            <Text style={{ color: 'white' }}>pH Level</Text>

            <View style={styles.propertyInner}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faDroplet} color="white" />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>4.5</Text>
            </View>
          </View>
        </View>

        <View style={{ borderColor: 'white', borderWidth: 0.5, marginTop: 50 }}></View>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <TouchableOpacity style={styles.button} onPress={()=>{
            if (deviceId){
              setShowBedForm(true)
            }else{
              Alert.alert(
                "Sensors Not Connected!",
                "Please enable Bluetooth on your device and connect to the HC-06 Bluetooth module to proceed.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
              );
            }
          }}>
            <Text style={styles.buttonText}>NEW ASSESSMENT</Text>
          </TouchableOpacity>
          {/* <Text style={{color:'white'}}>{temperature}</Text> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#111211',
    height: '100%',
    color: 'white',
  },
  latestAss: {
    color: 'white',
    padding: 14,
    margin: 10,
    marginTop: 50,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
  },
  propertyCon: {
    height: 100,
    width: 100,
    margin: 4,
    alignItems: 'center',
    borderRadius: 15,
  },
  propertyInner: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#111211',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BluetoothTest;
