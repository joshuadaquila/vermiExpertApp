import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import Spinner from "react-native-spinkit";

const Loader = ({ data, proceed }) => {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [readings, setReadings] = useState([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [meanData, setMeanData] = useState(null);

  useEffect(() => {
    if (attempts < 3) {
      setTimeout(() => {
        setReadings((prevReadings) => [...prevReadings, data]);
        setLoading(false); // Stop loading animation
        if (attempts < 2) {
          setShowPrompt(true);
        }
      }, 2000);
    }
  }, [attempts]);

  useEffect(() => {
    if (readings.length === 3) {
      const meanTemp = readings.reduce((sum, item) => sum + item.temp, 0) / 3;
      const meanMoisture = readings.reduce((sum, item) => sum + item.moisturelvl, 0) / 3;
      const meanPH = readings.reduce((sum, item) => sum + item.ph, 0) / 3;

      const calculatedMeanData = { temp: meanTemp, moisturelvl: meanMoisture, ph: meanPH };
      setMeanData(calculatedMeanData);
    }
  }, [readings]);

  useEffect(() => {
    if (meanData) {
      setTimeout(() => {
        proceed(meanData);
      }, 1500); // 2 seconds delay before calling proceed
    }
  }, [meanData]);
  

  const handleNextReading = () => {
    setShowPrompt(false);
    setLoading(true);
    setAttempts((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.header}>Analyzing...</Text>

        {/* Readings Display */}
        <View style={styles.readingsContainer}>
          {readings.map((reading, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.boldText}>Reading {index + 1}: </Text>
              <Text>{`${reading.temp}°C ${reading.moisturelvl}% ${reading.ph}`}</Text>
            </View>
          ))}
        </View>

        {/* Loading Animation */}
        {<Spinner size={50} type="Wave" color="#111211" />}
      </View>

      {/* Overlaying Prompt */}
      {showPrompt && (
        <View style={styles.overlay}>
          <View style={styles.overlayBox}>
            <Text style={styles.overlayText}>
              Move the sensor to a different location, then press "Continue."
            </Text>
            <TouchableOpacity style={{backgroundColor: '#111211', padding: 10, borderRadius: 25, paddingHorizontal: 20 }}
              onPress={handleNextReading} ><Text style={{color: 'white', fontWeight: 'bold'}}>Continue</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  main: {
    width: 260,
    padding: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
  },
  readingsContainer: {
    alignItems: "flex-start",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayBox: {
    width: 250,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayText: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Loader;
