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

const BluetoothTest = ({ sensorVal, navigation, connectToDevice, isConnected, isBluetoothOn}) => {
    const [showBedForm, setShowBedForm] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const data = { temp: sensorVal.temperature, moisturelvl: sensorVal.moisture, ph: sensorVal.phLevel }
    const proceedToResult = () =>{
      navigation.navigate("Result", data)
    }

   return (
    <View style={styles.main}>
      {showLoader && <Loader/>}
      {showSidebar&& <Sidebar toggleThis={()=> setShowSidebar(false)} menu={"dashboard"}/>}
      {/* <BtStat message={"Test"}/> */}
      
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
            if (isConnected){
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
