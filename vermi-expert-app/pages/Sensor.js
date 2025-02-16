import { faGaugeMed, faSun, faThermometerHalf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-charts-wrapper'; // Updated library import

const Sensor = ({ bluetoothData }) => {
  const [dataHistory, setDataHistory] = useState({
    temperature: [0],
    light: [0],
  });

  const screenWidth = Dimensions.get('window').width;
  const [temperature, setTemperature] = useState(0);
  const [light, setLight] = useState(0);

  useEffect(() => {
    if (bluetoothData) {
      // Update temperature and light state
      const newTemperature = parseFloat(bluetoothData.temperature) || 0;
      const newLight = parseFloat(bluetoothData.light) || 0;

      setTemperature(newTemperature);
      setLight(newLight);

      // Update data history for the charts
      setDataHistory((prevHistory) => {
        const maxDataPoints = 15;

        return {
          temperature: [...prevHistory.temperature, newTemperature].slice(-maxDataPoints),
          light: [...prevHistory.light, newLight].slice(-maxDataPoints),
        };
      });
    }
  }, [bluetoothData]);

  return (
    <View style={{ backgroundColor: '#EED3B1', flex: 1 }}>
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.header}>
            <FontAwesomeIcon icon={faGaugeMed} color="#1F4529" />
            <Text style={styles.headerText}>SENSOR</Text>
          </View>
        </View>
      </View>
      {/* Temperature Section */}
      <View style={{ marginTop: 10, padding: 10, backgroundColor: 'white' }}>
        <View style={styles.dataContainer}>
          <FontAwesomeIcon icon={faThermometerHalf} color="#1F4529" />
          <Text style={styles.chartTitle}>Temperature: {temperature.toFixed(2)} °C</Text>
        </View>
        <LineChart
          style={{ height: 220, width: screenWidth - 20 }}
          data={{
            dataSets: [
              {
                values: dataHistory.temperature.map((value, index) => ({ x: index, y: value })),
                label: 'Temperature',
                config: {
                  color: 'rgba(205, 255, 255, 1)',
                  drawValues: false,
                  mode: 'CUBIC_BEZIER',
                },
              },
            ],
          }}
          xAxis={{
            drawLabels: false,
            granularityEnabled: true,
          }}
          yAxis={{
            left: {
              drawLabels: true,
            },
            right: {
              enabled: false,
            },
          }}
          legend={{ enabled: false }}
          chartDescription={{ text: '' }}
        />
      </View>

      {/* Light Section */}
      <View style={{ marginTop: 10, padding: 10, backgroundColor: 'white' }}>
        <View style={styles.dataContainer}>
          <FontAwesomeIcon icon={faSun} color="#1F4529" />
          <Text style={styles.chartTitle}>Light: {light.toFixed(2)} lux</Text>
        </View>
        <LineChart
          style={{ height: 220, width: screenWidth - 20 }}
          data={{
            dataSets: [
              {
                values: dataHistory.light.map((value, index) => ({ x: index, y: value })),
                label: 'Light',
                config: {
                  color: 'rgba(205, 255, 255, 1)',
                  drawValues: false,
                  mode: 'CUBIC_BEZIER',
                },
              },
            ],
          }}
          xAxis={{
            drawLabels: false,
            granularityEnabled: true,
          }}
          yAxis={{
            left: {
              drawLabels: true,
            },
            right: {
              enabled: false,
            },
          }}
          legend={{ enabled: false }}
          chartDescription={{ text: '' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    display: 'flex',
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 50,
    paddingHorizontal: 8,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#1F4529',
  },
  chartTitle: {
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontSize: 15,
    margin: 2,
    color: '#1F4529',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerText: {
    color: '#1F4529',
    marginLeft: 2,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default Sensor;
