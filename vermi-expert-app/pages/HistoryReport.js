import { View, StyleSheet, Alert, TouchableOpacity, ScrollView, Share, Text } from "react-native"
import { faArrowCircleLeft, faBars, faDroplet, faHeart, faShare, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import evaluateRules from "../components/knowledgeBase";
import EvaluateRules from "../components/Knowledge";
import { useEffect, useState } from "react";
import loadModel from "../components/prediction";
import Sidebar from "../components/Sidebar";
import { fetchBedName } from "../components/db";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryReport = ({ navigation, route }) => {
  const { detail } = route.params;

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "Shared Successfully.",
      position: "top"
    });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `My vermibed ${detail.name} is in ${detail.conclusion.toUpperCase()} condition as of ${detail.timestamp}. Analyze your vermibed with VermiExpert App now!`,
        title: 'Analysis Result',
      });

      if (result.action === Share.sharedAction) {
        showToast();
      } 
    } catch (error) {
      Alert.alert('Error', 'Something went wrong with sharing');
      console.log('Error: ', error);
    }
  };

  return (
    <View style={styles.main}>
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowCircleLeft} color="white" style={{ marginRight: 10 }} size={23} />
        </TouchableOpacity>

        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <Text style={{ color: 'white', marginRight: 20 }}>Bed Name: {detail.name? detail.name:  "-"}</Text>
          <Text style={{ color: 'white' }}>
            {detail.timestamp}
          </Text>
          
        </View>
        <Text style={{
            color: 'white', fontWeight: 'bold',
            textAlign: 'center', marginVertical: 10
          }}>Analysis Result</Text>
        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faTemperature2} color="white" />
              <Text style={styles.propertyText}>Temperature (C)</Text>
            </View>
            <View style={styles.propertyInner}>
              <Text style={styles.propertyValue}>{detail.temperature}</Text>
            </View>
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faWater} color="white" />
              <Text style={styles.propertyText}>Moisture (%)</Text>
            </View>
            <View style={styles.propertyInner}>
              <Text style={styles.propertyValue}>{detail.moisture}</Text>
            </View>
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faDroplet} color="white" />
              <Text style={styles.propertyText}>pH Level</Text>
            </View>
            <View style={styles.propertyInner}>
              <Text style={styles.propertyValue}>{detail.pH}</Text>
            </View>
          </View>
        </View>

        <View style={styles.analysisBox}>
          <Text style={styles.analysisText}>Conclusion:</Text>
          <Text style={[styles.analysisHeader, detail.conclusion.toLowerCase() == "favorable"? {color: 'green'} : {color: 'red'}]}> 
            {detail.conclusion ? detail.conclusion.toUpperCase() : 'No Prediction Available'}
          </Text>
          {/* <Text style={styles.analysisText}>
            The vermibed has a temperature of {temp}°C, a moisture level of {moisturelvl}%, 
            and a pH level of {ph}, creating a/an {prediction} environment for vermiworms.
          </Text> */}
        </View>

        <View style={{ marginTop: 10 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }} style={{ height: 370 }}>
            <Text style={styles.recommendationHeader}>Recommendation</Text>
            {/* {recommendations.map((recommendation, index) => (
              <Text key={index} style={styles.recommendationText}>
                {index + 1}. {recommendation}
              </Text>
            ))} */}
            <Text style={styles.recommendationText}>{detail.recommendations}</Text>
          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHeart} style={{color: 'white', marginRight: 2}}/>
            <Text style={styles.footerText}>Mark</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleShare}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faShare} style={{color: 'white', marginRight: 2}}/>
            <Text style={styles.footerText}>Share</Text>
          </View>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#111211',
    flex: 1,
    color: 'white',
  },
  propertyWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  propertyCon: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  propertyLabel: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    width: 150,
  },
  propertyText: {
    color: 'white',
    marginLeft: 4,
  },
  propertyInner: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
  },
  propertyValue: {
    fontWeight: 'bold',
    width: 100,
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
  },
  analysisBox: {
    borderWidth: 1,
    borderColor: 'white',
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  analysisHeader: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  analysisText: {
    color: 'white',
  },
  recommendationHeader: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  recommendationText: {
    color: 'white',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: 'red',
    padding: 10,
    justifyContent: 'space-evenly',
    // alignItems: 'flex-end',
    // borderTopWidth: 1,
    borderColor: 'white',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HistoryReport;
