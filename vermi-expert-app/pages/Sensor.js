import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faDroplet, faTemperature0, faTemperature3, faWater } from '@fortawesome/free-solid-svg-icons';
import { BluetoothContext } from '../components/BluetoothProvider';
import Sidebar from '../components/Sidebar';
import { LineChart } from 'react-native-charts-wrapper'; // Import LineChart
import { processColor } from 'react-native-charts-wrapper'; // Import processColor
import { useTheme } from '../components/ThemeContext';

const Sensor = ({ route, bluetoothData }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [dataHistory, setDataHistory] = useState({
    temperature: [],
    moisture: [],
    phLevel: [],
  });

  // console.log("buedata", bluetoothData)
  useEffect(() => {
    const interval = setInterval(() => {
      if (bluetoothData) {
        setDataHistory((prevHistory) => {
          const maxDataPoints = 15; // Limit to 15 data points

          const updatedTemperature = [...prevHistory.temperature, bluetoothData.temperature].slice(-maxDataPoints);
          const updatedMoisture = [...prevHistory.moisture, bluetoothData.moisture].slice(-maxDataPoints);
          const updatedPhLevel = [...prevHistory.phLevel, bluetoothData.phLevel].slice(-maxDataPoints);

          return {
            temperature: updatedTemperature,
            moisture: updatedMoisture,
            phLevel: updatedPhLevel,
          };
        });
      }
    }, 1500); // Run every 1500 ms

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [bluetoothData]);
  

  const thresholds = {
    temperature: { low: 21, high: 29 },
    moisture: { low: 60, high: 80 },
    phLevel: { low: 4.3, high: 5.4 },
  };

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

  const chartData = {
    temperature: {
      values: dataHistory.temperature.map((temp, index) => ({ x: index, y: temp })),
      label: 'Temperature (°C)',
      config: {
        color:'white',
        lineWidth: 2,
        drawCubic: true,
        drawFilled: false,
      },
    },
    moisture: {
      values: dataHistory.moisture.map((moisture, index) => ({ x: index, y: moisture })),
      label: 'Moisture (%)',
      config: {
        // color: processColor('blue'),
        lineWidth: 2,
        drawCubic: true,
        drawFilled: false,
      },
    },
    phLevel: {
      values: dataHistory.phLevel.map((ph, index) => ({ x: index, y: ph })),
      label: 'pH Level',
      color: 'green',
      config: {
        color: 'green',
        lineWidth: 2,
        drawCubic: true,
        drawFilled: false,
      },
    },
  };

  return (
    <View style={[styles.main, {backgroundColor: isDarkMode? '#111211' : 'white'}]}>
      {showSidebar && <Sidebar toggleThis={() => setShowSidebar(false)} menu={'sensorMonitoring'} />}
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <View style={[{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
             paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }, {backgroundColor: isDarkMode? 'white': '#111211'}]}>
            <Text style={{ color: isDarkMode? '#111211' : 'white', fontWeight: 'bold' }}>SENSOR</Text>  
          </View>
        </View>

        {/* <Text>Temperature: {bluetoothData.temperature} °C ({getStatus(bluetoothData.temperature, 'temperature')})</Text>
        <Text>Moisture: {bluetoothData.moisture} % ({getStatus(bluetoothData.moisture, 'moisture')})</Text>
        <Text>pH Level: {bluetoothData.phLevel} ({getStatus(bluetoothData.phLevel, 'phLevel')})</Text> */}

        <ScrollView>
          <View style={styles.chartTitleCon}>
            {/* <Text style={styles.dataTitle}>
              Temperature: {bluetoothData.temperature} °C, Moisture: {bluetoothData.moisture} %, pH Level: {bluetoothData.phLevel}
            </Text> */}
          </View>

          {/* Line Chart for Temperature */}
          <View style={[styles.tableTitleCon, {borderColor: isDarkMode? 'white' : '#111211', backgroundColor: getStatus(bluetoothData.temperature, 'temperature') === "Normal"? 'green' : '#c1121f'}]}>
            <FontAwesomeIcon icon={faTemperature3} size={20}  style={{margin: 5, color: 'white'}}/>
            <Text style={[styles.parameter, {color: 'white'}]}>Temperature:</Text>
            <Text style={[styles.chartTitle, {color: 'white'}]}> {bluetoothData.temperature} °C {getStatus(bluetoothData.temperature, 'temperature')}</Text>
          </View>
          
          <LineChart
            style={styles.chart}
            data={{
              dataSets: [{
                ...chartData.temperature, // Assuming chartData.temperature contains values
                config: {
                  ...chartData.temperature.config, // Keep any existing configurations
                  mode: "CUBIC_BEZIER", // Enables cubic bezier curve
                  drawCircles: false, // Optional: Removes data point circles
                  lineWidth: 2, // Optional: Adjust line thickness
                  // color: processColor('blue'), // Adjust color as needed
                },
              }],
            }}
            xAxis={{ drawLabels: false }}
            yAxis={{ axisMaximum: 50, axisMinimum: 0 }}
            chartDescription={{ text: '' }}
            legend={{ enabled: false }}
          />


          {/* Line Chart for Moisture */}
          <View style={[styles.tableTitleCon, {borderColor: isDarkMode? 'white' : '#111211', backgroundColor: getStatus(bluetoothData.moisture, 'moisture') === "Normal"? 'green' : '#c1121f'}]}>
            <FontAwesomeIcon icon={faWater} size={20} style={{margin: 5, color:  'white'}}/>
            <Text style={[styles.parameter, {color: 'white'}]}>Moisture Level: </Text>
            <Text style={[styles.chartTitle, {color: 'white'}]}>{bluetoothData.moisture} % {getStatus(bluetoothData.moisture, 'moisture')}</Text>
          </View>
          <LineChart
            style={styles.chart}
            data={{
              dataSets: [{
                ...chartData.moisture, // Assuming chartData.moisture contains values
                config: {
                  ...chartData.moisture.config, // Keep any existing configurations
                  mode: "CUBIC_BEZIER", // Enables cubic bezier curve
                  drawCircles: false, // Optional: Removes data point circles
                  lineWidth: 2, // Optional: Adjust line thickness
                  // color: processColor('blue'), // Adjust color as needed
                },
              }],
            }}
            xAxis={{ drawLabels: false }}
            yAxis={{ axisMaximum: 50, axisMinimum: 0 }}
            chartDescription={{ text: '' }}
            legend={{ enabled: false }}
/>


          {/* Line Chart for pH Level */}
          <View style={[styles.tableTitleCon, {borderColor: isDarkMode? 'white' : '#111211', backgroundColor: getStatus(bluetoothData.phLevel, 'phLevel') === "Normal"? 'green' : '#c1121f'}]}>
            <FontAwesomeIcon icon={faDroplet} size={20}  style={{margin: 5, color: 'white' }}/>
            <Text style={[styles.parameter, {color: 'white' }]}>pH Level: </Text>
            <Text style={[styles.chartTitle, {color: 'white' }]}>{bluetoothData.phLevel} {getStatus(bluetoothData.phLevel, 'phLevel')}</Text>

          </View>
          <LineChart
            style={styles.chart}
            data={{
              dataSets: [{
                ...chartData.phLevel, // Assuming chartData.phLevel contains values
                config: {
                  ...chartData.phLevel.config, // Keep any existing configurations
                  mode: "CUBIC_BEZIER", // Enables cubic bezier curve
                  drawCircles: false, // Optional: Removes data point circles
                  lineWidth: 2, // Optional: Adjust line thickness
                  // color: processColor('blue'), // Adjust color as needed
                },
              }],
            }}
            xAxis={{ drawLabels: false }}
            yAxis={{ axisMaximum: 50, axisMinimum: 0 }}
            chartDescription={{ text: '' }}
            legend={{ enabled: false }}
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
    fontSize: 18,
    padding: 4,
  },
  chartTitleCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1
  },
  dataTitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  chart: {
    height: 220,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  parameter:{
    color: 'white',
    paddingBottom: 3
  },
  tableTitleCon:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20
  }
});

export default Sensor;
