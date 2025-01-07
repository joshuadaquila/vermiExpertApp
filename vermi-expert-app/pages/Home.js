import { faBars, faDroplet, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Text, FlatList, TouchableOpacity} from "react-native";
import BluetoothNotice from "../components/BluetoothNotice";
import { BleManager } from 'react-native-ble-plx';
import BtStat from "../components/BTStat";

const Home = ({ navigation }) => {
  const [showBt, setShowBt] = useState(true);
  const [hc05Device, setHc05Device] = useState(null); // You should initialize this with the actual Bluetooth device object
  const [isConnected, setIsConnected] = useState('false'); // State to store the connection status
  const manager = new BleManager();
  const deviceAddress = '75:DA:C4:8A:87:0D';
  const [receivedData, setReceivedData] = useState('')


  const connectToBluetooth = () => {
    console.log("Trying to connect to bt device...")
    setIsConnected('connecting')
    manager.connectToDevice(deviceAddress)
      .then(device => {
        setHc05Device(device);
        console.log(device)
        setIsConnected('true');
        if (device && typeof device.discoverAllServicesAndCharacteristics === 'function') {
          return device.discoverAllServicesAndCharacteristics();
        }
        
      })
      .catch(error => {
        console.log('Error connecting to HC-05:', error);
        setIsConnected('false')
      });
  };

  useEffect(() => {
    // connectToBluetooth();

    return () => {
      if (hc05Device) {
        hc05Device.cancelConnection();
      }
    };
  }, []);
  

  return (
    <View style={styles.main}>
      {isConnected && <BtStat status={isConnected} 
      message={`${isConnected === 'true'? "Bluetooth connected!" : isConnected === 'connecting'?  "Connecting..." :"Bluetooth disconnected. Tap to try again!"}`} clicked={connectToBluetooth}/>}
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faBars} color="white" style={{ marginRight: 10 }} />
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

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>29</Text>

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

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>29</Text>

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

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: 'white' }}>29</Text>
            </View>
          </View>
        </View>

        <View style={{ borderColor: 'white', borderWidth: 0.5, marginTop: 50 }}></View>

        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>NEW ASSESSMENT</Text>
          </TouchableOpacity>
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

export default Home;
