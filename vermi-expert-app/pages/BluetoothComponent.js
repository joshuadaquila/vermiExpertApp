import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Import Buffer from the 'buffer' package
import { faBars, faDroplet, faFaceSmile, faMoon, faSmileWink, faSun, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, SafeAreaView, Platform, PermissionsAndroid, Alert, Text, FlatList, TouchableOpacity, Switch} from "react-native";
import BluetoothNotice from "../components/BluetoothNotice";
import BtStat from "../components/BTStat";
import BedDetailForm from '../components/BedDetailForm';
import Sidebar from '../components/Sidebar';
import { BluetoothContext } from '../components/BluetoothProvider';
import { useContext } from 'react';
import Loader from '../components/Loader';
import { fetchLatestAnalysis } from '../components/db';
import { formatDateTime } from '../components/FormatDateTime';
import LottieView from 'lottie-react-native';
import { useTheme } from '../components/ThemeContext';

const BluetoothTest = ({ sensorVal, navigation, connectToDevice, isConnected, isBluetoothOn}) => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [showBedForm, setShowBedForm] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const data = { temp: sensorVal.temperature, moisturelvl: sensorVal.moisture, ph: sensorVal.phLevel }
    const [latestAnalysis, setLatestAnalysis] = useState();
    const proceedToResult = (data) =>{
      setShowLoader(false);
      navigation.navigate("Result", data)
    }

  useEffect(() => {
    const fetchLatestAnalysisFunc = async () => {
      try {
        const data = await fetchLatestAnalysis();
        setLatestAnalysis(data);
      } catch (error) {
        console.error("Error fetching latest analysis:", error);
      }
    };
  
    fetchLatestAnalysisFunc();
  }, []); // Run only on initial render
  
  // console.log("ANALYSIS DATA", latestAnalysis)

   return (
    <View style={[isDarkMode? styles.main : styles.lightMain ]}>
      {showLoader && <Loader data={data} proceed={proceedToResult}/>}
      {/* {showSidebar&& <Sidebar togglefThis={()=> setShowSidebar(false)} menu={"dashboard"}/>} */}
      {/* <BtStat message={"Test"}/> */}
      
      {showBedForm && (
        <BedDetailForm 
          cancel={() => setShowBedForm(false)} 
          bedSet={() => {
            setShowBedForm(false);
            setShowLoader(true);
            
            setTimeout(() => {
              // setShowLoader(false);
              // proceedToResult();
            }, 6500);  // Trigger proceedToResult after 5 seconds
          }}
        />
      )}

      <View style={{ padding: 10 }}>
        
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      
          <View style={[{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
             paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }, {backgroundColor: isDarkMode? 'white': '#111211'}]}>
            <Text style={{ color: isDarkMode? '#111211' : 'white', fontWeight: 'bold' }}>DASHBOARD</Text>  
          </View>

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <FontAwesomeIcon icon={faSun} style={{color: isDarkMode? 'white' : '#111211'}} />
          <View style={{backgroundColor: isDarkMode? '#D9EAFD' : '#D9EAFD', borderRadius: 25, marginHorizontal: 10, elevation: 5}}>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: 'D9EAFD', true: '#9AA6B2' }} // track color when OFF and ON
            thumbColor={isDarkMode ? '#111211' : '#111211'} // thumb color based on the current theme
          /></View><FontAwesomeIcon icon={faMoon} style={{color: isDarkMode? 'white' : '#111211'}} />
          </View>
          
        </View>

        <View style={{backgroundColor: isDarkMode? '#111211' : '#D9EAFD', borderRadius: 20, padding: 5, marginVertical: 20, borderWidth: 1, borderColor: 'white'}}>
        <View style={[styles.latestAss, {borderColor: isDarkMode? 'white' : '#111211'}]}>
          <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10, color: isDarkMode? 'white' : '#111211' }}>Latest Assessment</Text>
          <View style={styles.gridContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[{ color: isDarkMode? 'white' : '#111211', fontWeight: 'bold' }, styles.tableText]}>BED NAME</Text>
              <Text style={{ color: isDarkMode? 'white' : '#111211' }}>{latestAnalysis?.[0]?.name ?? "-"}</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={[{ color: isDarkMode? 'white' : '#111211', fontWeight: 'bold' }, styles.tableText]}>DATE</Text>
              <Text style={{ color: isDarkMode? 'white' : '#111211' }}>{latestAnalysis?.[0]?.timestamp ? new Date(latestAnalysis[0].timestamp).toLocaleDateString() : "-"}</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={[{ color: isDarkMode? 'white' : '#111211', fontWeight: 'bold' }, styles.tableText]}>CONCLUSION</Text>
              <Text style={{ color: isDarkMode? 'white' : '#111211' }}>{latestAnalysis?.[0]?.conclusion ?? "-"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.propertyCon}>
            <Text style={{ color: isDarkMode? 'white' : '#111211' }}>Temperature</Text>

            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faTemperature2} style={{color: isDarkMode? 'white' : '#111211'}} />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: isDarkMode? 'white' : '#111211' }}>
                {latestAnalysis?.[0]?.temperature 
                  ? parseFloat(latestAnalysis[0].temperature).toFixed(1) 
                  : "-"}
              </Text>


              <View style={{ width: '100%' }}>
                <Text style={{ color: isDarkMode? 'white' : '#111211', textAlign: 'right' }}>°C</Text>
              </View>
            </View>
          </View>
          

          <View style={styles.propertyCon}>
            <Text style={{ color: isDarkMode? 'white' : '#111211' }}>Moisture</Text>

            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faWater} style={{color: isDarkMode? 'white' : '#111211'}} />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: isDarkMode? 'white' : '#111211' }}>{latestAnalysis?.[0]?.moisture ?? "-"}</Text>

              <View style={{ width: '100%' }}>
                <Text style={{ color: isDarkMode? 'white' : '#111211', textAlign: 'right' }}>%</Text>
              </View>
            </View>
          </View>

          <View style={styles.propertyCon}>
            <Text style={{ color: isDarkMode? 'white' : '#111211' }}>pH Level</Text>

            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <View style={{ width: '100%' }}>
                <FontAwesomeIcon icon={faDroplet} style={{color: isDarkMode? 'white' : '#111211'}} />
              </View>

              <Text style={{ fontWeight: 'bold', fontSize: 35, color: isDarkMode? 'white' : '#111211' }}>{latestAnalysis?.[0]?.pH ?? "-"}</Text>
              
              <View style={{ width: '100%' }}>
                <Text style={{ color: isDarkMode? 'white' : '#111211', textAlign: 'right' }}></Text>
              </View>
            </View>
          </View>
        </View>
        </View>

        <View style={{ borderColor: isDarkMode? 'white' : '#111211', borderWidth: 0.5, marginTop: 50, marginBottom: 50 }}></View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* <LottieView
            source={require('../resources/animation.json')}
            autoPlay
            loop
            style={styles.animation}
            onAnimationFinish={() => console.log('Animation Finished')}
          />
          <Text style={{color: 'white', textAlign: 'center', marginBottom: 4}}>Check my bed now!</Text> */}
          <TouchableOpacity style={[styles.button, {backgroundColor: isDarkMode? 'white' : '#111211'}]} onPress={()=>{
            if (isConnected){ //isConnected
              setShowBedForm(true)
            }else{
              Alert.alert(
                "Sensors Not Connected!",
                "Please enable Bluetooth on your device and connect to the HC-06 Bluetooth module to proceed.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }]
              );
            }
          }}>
            <Text style={[styles.buttonText, {color: isDarkMode? '#111211' : 'white'}]}>NEW ASSESSMENT</Text>
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
  lightMain: {
    backgroundColor: 'white',
    height: '100%',
    color: '#111211',
  },
  latestAss: {
    color: 'white',
    padding: 14,
    // margin: 10,
    // marginTop: 20,
    // borderWidth: 2,
    borderColor: 'white',
    borderRadius: 15,
    // marginBottom: 20,
  },
  propertyCon: {
    // height: 100,
    width: 100,
    margin: 4,
    alignItems: 'center',
    borderRadius: 15,
  },
  propertyInner: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
    // height: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
  },
  gridContainer: {
    // backgroundColor: 'yellow',
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
  tableText:{
    // fontSize: 12
  },
  animation: {
    width: 400,
    height: 200,
    resizeMode: 'cover'
  },
});

export default BluetoothTest;
