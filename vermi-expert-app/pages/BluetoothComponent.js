import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Import Buffer from the 'buffer' package
import { faBars, faDroplet, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Text, FlatList, TouchableOpacity} from "react-native";
import BluetoothNotice from "../components/BluetoothNotice";
import BtStat from "../components/BTStat";
import BedDetailForm from '../components/BedDetailForm';
import Sidebar from '../components/Sidebar';

const BluetoothTest = ({ navigation }) => {
    const [isConnected, setIsConnected] = useState('false');
    const [deviceId, setDeviceId] = useState(null);
    const [devices, setDevices] = useState([]);
    const [manager, setManager] = useState(null);
    const [receivedData, setReceivedData] = useState('');
    const [showBedForm, setShowBedForm] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);

    const [temperature, setTemperature]= useState(0);
    const [moisture, setMoisture] = useState(0);
    const [phLevel, setPhLevel] = useState(0);

  const [hc05Device, setHc05Device] = useState(null);
  const deviceAddress = '75:DA:C4:8A:87:0D';

    useEffect(() => {
        const bleManager = new BleManager();
        setManager(bleManager);

        // Request permissions on Android
        if (Platform.OS === 'android') {
            requestPermissions();
        }

        // Start scanning for devices
        startScan(bleManager);

        // Cleanup on unmount
        return () => {
            // bleManager.stopDeviceScan();
            // bleManager.destroy();
        };
    }, []);

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

    const startScan = (bleManager) => {
        bleManager.startDeviceScan([], { allowDuplicates: false }, (error, device) => {
            if (error) {
                console.log('Error scanning devices', error);
                return;
            }

            // Check if the device is already in the list
            setDevices(prevDevices => {
                if (!prevDevices.some(dev => dev.id === device.id)) {
                    return [...prevDevices, device];
                }
                return prevDevices;
            });
        });

        // Stop scanning after a few seconds
        setTimeout(() => {
            bleManager.stopDeviceScan();
            console.log('Scan stopped');
        }, 5000); // Stop after 5 seconds (or adjust as needed)
    };

    const connectToDevice = () => {
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
                    console.log('Connection error', error);
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

    console.log(temperature)
    const data = {temp: temperature, moisturelvl: moisture, ph: phLevel}

    const proceedToResult = () =>{
      navigation.navigate("Result", data)
    }

   return (
    <View style={styles.main}>
      {showSidebar&& <Sidebar toggleThis={()=> setShowSidebar(false)} menu={"dashboard"}/>}
      {isConnected && <BtStat status={isConnected}
      message={`${isConnected === 'true'? "Bluetooth connected!" : isConnected === 'connecting'?  "Connecting..." :"Sensors disconnected. Tap to connect!"}`} clicked={connectToDevice}/>}
      {showBedForm && <BedDetailForm cancel={()=> setShowBedForm(false)} bedSet={proceedToResult}/>}
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={()=> setShowSidebar(true)}>
           <FontAwesomeIcon icon={faBars} color="white" style={{ marginRight: 10 }} />

          </TouchableOpacity>
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
              <Text style={{ color: 'white' }}>Optimal</Text>
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
          <TouchableOpacity style={styles.button} onPress={()=> setShowBedForm(true)}>
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
