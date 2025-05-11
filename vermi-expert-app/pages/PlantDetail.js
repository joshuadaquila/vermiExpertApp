import { faArrowAltCircleLeft, faArrowCircleLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { fetchPlantsInfo } from '../components/db';
import Loader from '../components/Loader';
// import Footer from '../components/Footer';
import BluetoothClassic from "react-native-bluetooth-classic";
const deviceAddress = "00:23:09:01:A8:4F";

const PlantDetail = ({ route, navigation }) => {
  const { plantId } = route.params;
  const [plantInfo, setPlantInfo] = useState(null); // Initialize as null for loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetchPlantsInfo(plantId);
        setPlantInfo(response);
      } catch (error) {
        console.error("Error fetching plant info:", error);
      }
    };

    fetchPlant();
  }, [plantId]);

  const handleAnalysis = async (plantId) => {
    try {
      const status = await BluetoothClassic.isDeviceConnected(deviceAddress);
  
      if (status) {
        setLoading(true);
        setTimeout(() => {
          navigation.replace("Result", { plantId, plantInfo });
        }, 3000);
      } else {
        Alert.alert(
          "Bluetooth Disconnected",
          "Please connect to the Bluetooth device before proceeding.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Bluetooth Error",
        "An error occurred while checking the Bluetooth connection. Please check your connection and try again.",
        [{ text: "OK" }]
      );
      console.error("Bluetooth Error:", error); // Log error for debugging
    }
  };

  // Plant images mapping
  const plantImages = {
    1: require('../resources/plantId1.jpg'),
    2: require('../resources/plantId2.jpg'),
    3: require('../resources/plantId3.jpg'),
    4: require('../resources/plantId4.jpg'),
    5: require('../resources/plantId5.jpg'),
    6: require('../resources/plantId6.jpg'),
    7: require('../resources/plantId7.jpg'),
    8: require('../resources/plantId8.jpg'),
  };

  // Check if plantInfo is available before trying to access it
  if (!plantInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F4529" />
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  const plantImage = plantImages[plantInfo[0].plantId]; // Fallback image

  return (
    <View style={{ backgroundColor: '#EED3B1', flex: 1, padding: 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} >
          <FontAwesomeIcon icon={faArrowCircleLeft} color='#1F4529' size={25} />
        </TouchableOpacity>
      </View>
      {loading && <Loader />}
      <View>
        <Image source={plantImage} style={styles.plantImage} />
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 17,
            color: '#1F4529',
            marginBottom: 5,
          }}
        >
          {plantInfo[0].name.toUpperCase()}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <ScrollView>
          <View>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Details </Text>
            <Text style={{ marginLeft: 20, marginBottom: 30, fontSize: 15 }}>{plantInfo[0].category}</Text>
          </View>
          <View>
            <Text style={{fontSize: 15}}>{plantInfo[0].description}</Text>
          </View>
        </ScrollView>
      </View>

      {/* Analyze Button */}
      <TouchableOpacity style={styles.analyzeButton} onPress={()=> handleAnalysis(plantId)}>
        <FontAwesomeIcon icon={faMagnifyingGlass} color='white' style={{marginRight: 5}} />
        <Text style={styles.analyzeButtonText}>ANALYZE</Text>
      </TouchableOpacity>
      
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EED3B1',
  },
  plantImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginVertical: 10,
    elevation: 20,
  },
  infoContainer: {
    flex: 1,
    fontSize: 25,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    elevation: 10,
  },
  analyzeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#1F4529',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PlantDetail;
