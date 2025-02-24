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
import { useTheme } from "../components/ThemeContext";

const HistoryReport = ({ navigation, route }) => {
  const { isDarkMode, toggleTheme } = useTheme();
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
    <View style={[styles.main, {backgroundColor: isDarkMode? '#111211' : 'white'}]}>
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowCircleLeft}  style={{ marginRight: 10, color: isDarkMode? 'white' : '#111211' }} size={23} />
        </TouchableOpacity>

        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <Text style={{ color: isDarkMode? 'white' : '#111211', marginRight: 20 }}>Bed Name: {detail.name? detail.name:  "-"}</Text>
          <Text style={{ color: isDarkMode? 'white' : '#111211' }}>
            {detail.timestamp}
          </Text>
          
        </View>
        <Text style={{
            color: isDarkMode? 'white' : '#111211', fontWeight: 'bold',
            textAlign: 'center', marginVertical: 10
          }}>Analysis Result</Text>
        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faTemperature2} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>Temperature (C)</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{detail.temperature}</Text>
            </View>
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faWater} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>Moisture (%)</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{detail.moisture}</Text>
            </View>
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faDroplet} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>pH Level</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{detail.pH}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.analysisBox, {borderColor: isDarkMode? 'white' : '#111211'}]}>
          <Text style={[styles.analysisHeader, detail.conclusion.toLowerCase() == "favorable"? {color: 'green'} : {color: 'red'}]}> 
            {detail.conclusion ? detail.conclusion.toUpperCase() : 'No Prediction Available'}
          </Text>
          {/* <Text style={styles.analysisText}>
            The vermibed has a temperature of {temp}°C, a moisture level of {moisturelvl}%, 
            and a pH level of {ph}, creating a/an {prediction} environment for vermiworms.
          </Text> */}
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={[styles.recommendationHeader, {color: isDarkMode? 'white' : '#111211', marginBottom: 5}]}>Recommendation</Text>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }} style={{ height: 370 }}>
            
            {/* {recommendations.map((recommendation, index) => (
              <Text key={index} style={styles.recommendationText}>
                {index + 1}. {recommendation}
              </Text>
            ))} */}
            {detail.recommendations.split('.,').map((rec, index) => (
              <Text key={index} style={[styles.recommendationText, { color: isDarkMode ? 'white' : '#111211' }]}>
                {index + 1}. {rec.trim()}.
              </Text>
            ))}

          </ScrollView>
        </View>
      </View>

      <View style={styles.footer}>
        {/* <TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHeart} style={{color: isDarkMode? 'white' : '#111211', marginRight: 2}}/>
            <Text style={[styles.footerText, {color: isDarkMode? 'white' : '#111211'}]}>Mark</Text>
          </View>
        </TouchableOpacity> */}
        
        <TouchableOpacity onPress={handleShare}>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faShare} size={25} style={{color: isDarkMode? 'white' : '#111211', marginRight: 2}}/>
            {/* <Text style={[styles.footerText, {color: isDarkMode? 'white' : '#111211'}]}>Share</Text> */}
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
    fontSize: 30,
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
    fontSize: 15,
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
