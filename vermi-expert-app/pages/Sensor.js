import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { BleManager } from "react-native-ble-plx"; // Import BleManager for Bluetooth
import Sidebar from "../components/Sidebar";
import { LineChart } from "react-native-chart-kit"; // For line graph visualization

const Sensor = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [temperature, setTemperature] = useState(0);
  const [moisture, setMoisture] = useState(0);
  const [phLevel, setPhLevel] = useState(0);
  const [dataHistory, setDataHistory] = useState({
    temperature: [22.5, 23.1, 24.0, 22.8, 23.5, 24.1, 23.7, 22.9, 23.3, 24.2],
    moisture: [45, 50, 47, 49, 46, 51, 48, 52, 47, 50],
    phLevel: [6.5, 6.7, 6.6, 6.8, 6.5, 6.9, 6.7, 6.6, 6.8, 6.7]
  });

  // Thresholds for classification
  const thresholds = {
    temperature: { low: 22, high: 25 }, // 22-25 °C normal range
    moisture: { low: 40, high: 55 }, // 40-55% normal range
    phLevel: { low: 6.0, high: 7.5 } // 6.0-7.5 normal range
  };

  const deviceAddress = '75:DA:C4:8A:87:0D';
  const bleManager = new BleManager(); // Bluetooth manager

  useEffect(() => {
    // Function to fetch data from the connected device
    const fetchData = () => {
      bleManager.readCharacteristicForDevice(deviceAddress, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb')
        .then((characteristic) => {
          const data = characteristic.value
            ? Buffer.from(characteristic.value, 'base64').toString('utf-8')
            : '';

          const parts = data.split('\n');
          const newTemperature = parseFloat(parts[0]);
          const newMoisture = parseInt(parts[1], 10);
          const newPhLevel = parseFloat(parts[2]);

          // Update states
          setTemperature(newTemperature);
          setMoisture(newMoisture);
          setPhLevel(newPhLevel);

          // Update the history for line graph visualization
          setDataHistory(prevData => ({
            temperature: [...prevData.temperature, newTemperature],
            moisture: [...prevData.moisture, newMoisture],
            phLevel: [...prevData.phLevel, newPhLevel]
          }));
        })
        .catch((error) => {
          console.log('Error reading characteristic:', error);
        });
    };

    // Fetch data immediately after the component is mounted
    fetchData();

    // Set an interval to fetch data every 5 seconds
    const interval = setInterval(fetchData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once when the component mounts

  // Function to determine the status (Normal, High, Low)
  const getStatus = (value, sensorType) => {
    if (sensorType === 'temperature') {
      if (value < thresholds.temperature.low) return 'Low';
      if (value > thresholds.temperature.high) return 'High';
      return 'Normal';
    }
    if (sensorType === 'moisture') {
      if (value < thresholds.moisture.low) return 'Low';
      if (value > thresholds.moisture.high) return 'High';
      return 'Normal';
    }
    if (sensorType === 'phLevel') {
      if (value < thresholds.phLevel.low) return 'Low';
      if (value > thresholds.phLevel.high) return 'High';
      return 'Normal';
    }
  };

  return (
    <View style={styles.main}>
      {showSidebar && <Sidebar toggleThis={() => setShowSidebar(false)} menu={"sensorMonitoring"} />}

      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setShowSidebar(true)}>
            <FontAwesomeIcon icon={faBars} color="white" style={{ marginRight: 10 }} />
          </TouchableOpacity>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }}>
            <Text style={{ color: '#111211', alignSelf: 'flex-start', fontWeight: 'bold' }}>SENSOR MONITORING</Text>
          </View>
        </View>

        {/* <Text>Temperature: {temperature} °C ({getStatus(temperature, 'temperature')})</Text>
        <Text>Moisture: {moisture} % ({getStatus(moisture, 'moisture')})</Text>
        <Text>pH Level: {phLevel} ({getStatus(phLevel, 'phLevel')})</Text> */}

        <ScrollView>
          <View style={styles.chartTitleCon}>
            <Text style={styles.chartTitle}>Temperature </Text>
            <Text style={styles.dataTitle}>{temperature} °C ({getStatus(temperature, 'temperature')})</Text>

          </View>
          <LineChart
            data={{
              labels: Array.from({ length: dataHistory.temperature.length }, (_, index) => index + 1),
              datasets: [{
                data: dataHistory.temperature,
                strokeWidth: 2,
                color: () => '#FF6347',
                name: "Temperature (°C)"
              }]
            }}
            width={320}
            height={180}
            chartConfig={{
              backgroundColor: "#111211",
              backgroundGradientFrom: "#111211",
              backgroundGradientTo: "#111211",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
          />

          <View style={styles.chartTitleCon}>
            <Text style={styles.chartTitle}>Moisture </Text>
            <Text style={styles.dataTitle}>{moisture} % ({getStatus(moisture, 'moisture')})</Text>

          </View>
          <LineChart
            data={{
              labels: Array.from({ length: dataHistory.moisture.length }, (_, index) => index + 1),
              datasets: [{
                data: dataHistory.moisture,
                strokeWidth: 2,
                color: () => '#4682B4',
                name: "Moisture (%)"
              }]
            }}
            width={320}
            height={180}
            chartConfig={{
              backgroundColor: "#111211",
              backgroundGradientFrom: "#111211",
              backgroundGradientTo: "#111211",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
          />

          <View style={styles.chartTitleCon}>
            <Text style={styles.chartTitle}>Moisture </Text>
            <Text style={styles.dataTitle}>{moisture} °C ({getStatus(moisture, 'moisture')})</Text>

          </View>
          <LineChart
            data={{
              labels: Array.from({ length: dataHistory.phLevel.length }, (_, index) => index + 1),
              datasets: [{
                data: dataHistory.phLevel,
                strokeWidth: 2,
                color: () => '#32CD32',
                name: "pH Level"
              }]
            }}
            width={320}
            height={180}
            chartConfig={{
              backgroundColor: "#111211",
              backgroundGradientFrom: "#111211",
              backgroundGradientTo: "#111211",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 }
            }}
            bezier
          />
        </ScrollView>
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
  chartTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 10,
  },
  dataTitle:{
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold'
  },
  chartTitleCon:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Sensor;
