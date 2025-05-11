import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import BluetoothTest from "../pages/BluetoothComponent";
import Sensor from "../pages/Sensor";
import History from "../pages/History";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGauge, faHeart, faHistory, faHome, faInbox, faInfoCircle, faList } from "@fortawesome/free-solid-svg-icons";
import BluetoothClassic from "react-native-bluetooth-classic";
import BtStat from "./BTStat";
import { BluetoothContext } from "./BluetoothProvider";

const Footer = ({ navigation }) => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showMore, setShowMore] = useState(false);
  const [bluetoothData, setBluetoothData] = useState({});
  const { sensorData, setSensorData } = useContext(BluetoothContext);
  const [isConnected, setIsConnected] = useState(false);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [temperature, setTemperature] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const deviceAddress = "00:23:09:01:A8:4F"; // Replace with your device address

  useEffect(() => {
    requestBluetoothPermissions();
    checkBluetoothEnabled();
    connectToDevice();
    return () => disconnectFromDevice(); // Cleanup on unmount
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Bluetooth permissions granted");
          checkBluetoothEnabled();
        } else {
          console.log("Bluetooth permissions denied");
          Alert.alert("Permission Required", "Bluetooth permissions are required to connect to devices.");
        }
      } catch (error) {
        console.error("Error requesting Bluetooth permissions:", error);
      }
    } else {
      checkBluetoothEnabled(); // iOS doesn't require runtime permissions
    }
  };

  const checkBluetoothEnabled = async () => {
    const enabled = await BluetoothClassic.isBluetoothEnabled();
    setIsBluetoothOn(enabled);
  };

  const connectToDevice = async () => {
    try {
      const device = await BluetoothClassic.connectToDevice(deviceAddress);

      if (!device) {
        console.error("Device connection failed. No device returned.");
        return;
      }

      setDeviceId(device.id);
      setIsConnected(true);
      console.log("Connected to device:", device.id);
      startListening(); // Start listening after connection
    } catch (error) {
      console.log("Connection error:", error);
    }
  };

  // console.log(BluetoothClassic)

  const startListening = () => {
    const interval = setInterval(async () => {
      try {
        const data = await BluetoothClassic.readFromDevice(deviceAddress); // Read data from the device
        // console.log("Received Bluetooth data:", data); // Log the received data
       
        if (true) {
          // Split the data by the comma delimiter
          const parts = data.trim().split(","); // Split based on comma delimiter
          if (true) { // Ensure we have at least two parts
            const temp = parseFloat(parts[0]); // Parse the first part as temperature
            const moist = parseFloat(parts[1]); // Parse the second part as moisture (lux)
            setBluetoothData({ temperature: temp, light: moist });
            setSensorData({ temperature: temp, light: moist });

            // console.log("Temperature:", temp);
            // console.log("Moisture (Lux):", moist);
  
            if (!isNaN(temp) && !isNaN(moist)) {
              setTemperature(temp); // Update temperature state
              setMoisture(moist); // Update moisture state
            } else {
              console.error("Invalid numeric data received:", data);
            }
          } else {
            console.error("Received data does not contain enough parts:", data);
          }
        } else {
          console.error("Received data is not a string:", data);
        }
      } catch (error) {
        console.error("Error reading from device:", error);
        
      }
    }, 1000); // Adjust the interval as needed
  
    return interval;
  };
  const disconnectFromDevice = async () => {
    if (deviceId) {
      await BluetoothClassic.disconnect(deviceId);
      setIsConnected(false);
      setDeviceId(null);
      console.log("Disconnected from device");
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // setBluetoothData({ temperature: temperature, light: moisture });
  //     // console.log("bt data", bluetoothData)
  //     setSensorData({ temperature: temperature, light: moisture });
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [temperature, moisture]);
  // console.log("sensor data", sensorData)
  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return (
          <BluetoothTest
            sensorVal={bluetoothData}
            connectToDevice={connectToDevice}
            isConnected={isConnected}
            navigation={navigation}
            isBluetoothOn={isBluetoothOn}
          />
        );
      case "Sensor":
        return <Sensor bluetoothData={bluetoothData} />;
      case "History":
        return <History navigation={navigation} />;
      default:
        return <BluetoothTest />;
    }
  };

  console.log(sensorData)
  return (
    <View style={styles.container}>
      <BtStat
        status={isConnected}
        message={`${
          isConnected
            ? "Sensors connected!"
            : !isBluetoothOn
            ? "Bluetooth is off, and sensors are disconnected."
            : "Sensors disconnected. Reconnecting..."
        }`}
        clicked={connectToDevice}
      />
      <View style={styles.content}>{renderContent()}</View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => setActiveComponent("Dashboard")}>
          <FontAwesomeIcon size={25} icon={faHome} color="#1F4529" />
          <Text style={{color: '#1F4529'}}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (isConnected) {
              setActiveComponent("Sensor");
            } else {
              Alert.alert("Sensors Disconnected!", "Please check your connection and try again.", [
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            }
          }}
        >
          <FontAwesomeIcon icon={faGauge} size={25} color="#1F4529" />
          <Text style={{color: '#1F4529'}}>Sensor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setActiveComponent("History")}>
          <FontAwesomeIcon icon={faList} size={25} color="#1F4529" />
          <Text style={{color: '#1F4529'}}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#111211",
  },
  content: {
    flex: 1,
    backgroundColor: "#111211",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 13,
    backgroundColor: "white",
  },
  button: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111211",
    marginHorizontal: 4,
  },
  OptionsCon: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 50,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
});

export default Footer;
