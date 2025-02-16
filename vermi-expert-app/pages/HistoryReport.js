import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from "react-native";
import { faArrowCircleLeft, faSun, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useContext, useEffect, useState } from "react";
import { BluetoothContext } from "../components/BluetoothProvider";
import { insertAnalysis } from "../components/db";

const HistoryReport = ({ navigation, route }) => {

  const { detail } = route.params;

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
  const plantImage = plantImages[detail.plantId];
  const screenWidth = Dimensions.get("window").width;

  console.log(detail)
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <FontAwesomeIcon icon={faArrowCircleLeft} color="#1F4529" size={25} />
      </TouchableOpacity>

      <View>
        <Image source={plantImage} style={{ height: 500, width: screenWidth }} />
        
        <View style={styles.dataMain}>
          <Text style={{paddingVertical: 8, fontSize: 18, fontWeight: 'bold', elevation: 20,
          backgroundColor: 'white', borderRadius: 8, marginBottom: 5, paddingHorizontal: 8,  color: '#1F4529'}}>{detail.name}</Text>

          <View style={styles.dataOverlay}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10, 
              borderWidth: 1, padding: 5, borderColor: 'white'}}>
              <FontAwesomeIcon icon={faSun} color="white" style={{marginRight: 5}} />
              <Text style={styles.dataText}>Light: {detail?.light || 0} %</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              borderWidth: 1, padding: 5, borderColor: 'white' }}>
              <FontAwesomeIcon icon={faThermometerHalf} color="white" style={{marginRight: 5}} />
              <Text style={styles.dataText}>Temperature: {detail?.temperature || 0} °C</Text>
            </View>

            
          </View>

          
          
        </View>
        
      </View>

      <View style={{ padding: 10, backgroundColor: 'white' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Recommendation:</Text>
        <Text style={{ marginTop: 10, fontSize: 15 }}>{detail.recommendations}</Text>

        {/* <View>
          <Text style={{ opacity: 0.5, padding: 10, alignSelf: 'flex-end' }}>
             {detail.timestamp}
          </Text>
        </View> */}
      </View>


      <Text style={{padding: 10, opacity: 0.6}}>Date of Assessment: {detail.timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#EED3B1",
    flex: 1,
    position: "relative",
  },
  goBackButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  dataMain: {
    position: "absolute",
    display: 'flex',
    flexDirection: 'column',

    bottom: 20,
    left: 20
  },
  
  dataOverlay: {
    width: 'auto',
    
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
    borderRadius: 8,
  },
  dataText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HistoryReport;
