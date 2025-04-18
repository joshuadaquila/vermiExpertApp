import { View, StyleSheet, TouchableOpacity, ScrollView, Share, Alert, Text } from "react-native"
import { faArrowCircleLeft, faBars, faDroplet, faHeart, faShare, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import evaluateRules from "../components/knowledgeBase";
import EvaluateRules from "../components/Knowledge";
import { useEffect, useState } from "react";
import loadModel from "../components/prediction";
import Sidebar from "../components/Sidebar";
import { addFavorite, deleteFavorite, fetchAnalysisByBedId, fetchBedName, fetchLatestAssessmentId, getLatestAnalysisByBedId, insertAnalysis } from "../components/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../components/ThemeContext";

const AnalysisResult = ({ navigation, route }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { temp, ph, moisturelvl } = route.params;
  const [bedId, setBedId] = useState(0);
  const [assessmentId, setAssessmentId] = useState(0);
  const [bed, setBed] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [favorited, setFavorited] = useState(false);
  const [data, setData] = useState({bedId: null , temperature: null, moisture: null, pH: null, conclusion: null, recommendation: null})
  const [prevResult, setPrevResult] = useState()

  useEffect(()=>{
    const fetchId = async () => {
      const bedId = await AsyncStorage.getItem("bedId");
      setBedId(parseInt(bedId));

    };

    fetchId();
  }, [])

  useEffect(()=>{
    const getStoredBed = async () => {
      const bed = await AsyncStorage.getItem("bedName");
      setBed(bed);
    };

    getStoredBed();
  }, [])


  

  useEffect(() => {
    const fetchPrediction = async () => {
      const data = { temperature: temp, pH: ph, moisture: moisturelvl };
  
      try {
        // Wait for the prediction result
        const predictionResult = await loadModel(temp, moisturelvl, ph);
        console.log("prediction is", predictionResult.toUpperCase());
  
        // Proceed with the recommendations after getting the prediction
        const recommendationsList = EvaluateRules(data);
  
        // Update state with prediction and recommendations
        setPrediction(predictionResult);
        setRecommendations(recommendationsList);
      } catch (error) {
        console.error("Error fetching prediction:", error);
      }
    };
  
    fetchPrediction();
  }, [temp, ph, moisturelvl]);

  useEffect(()=>{
    const setValues = async () => {
      if (bedId != 0 && temp && ph && moisturelvl && prediction !== "" && recommendations.length !== 0){ //bedId != 0 && temp && ph && moisturelvl && prediction !== "" && recommendations.length !== 0
        setData({bedId: bedId, temperature: temp, moisture: moisturelvl, pH: ph, conclusion: prediction, recommendation: recommendations})
      }
    }
    setValues();
  },[bedId, temp, ph, moisturelvl, prediction, recommendations])

  // console.log("data to insert", data);
  useEffect(() => {
    const getAnalysisById = async () => {
      try {
        const result = await getLatestAnalysisByBedId(bedId);
        setPrevResult(result);
      } catch (error) {
        console.error('Error fetching latest analysis:', error);
      }
    };
  
    getAnalysisById();
  }, [bedId]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `My vermibed ${bed? bed :  ""} is in ${prediction.toUpperCase()} condition as of ${new Date().toISOString()}. Analyze your vermibed with VermiExpert App now!`,
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

  useEffect(()=>{
    const insertValue = async () =>{
      if (data.bedId != 0 && data.temperature && data.pH && data.moisture && data.conclusion !== "" && data.recommendation !==  ""){ //data.bedId != 0 && data.temperature && data.pH && data.moisture && data.conclusion !== "" && data.recommendation !==  ""
        await insertAnalysis(data)
        console.log("DATA INSERTED");
        const assessmentId = await fetchLatestAssessmentId();
        setAssessmentId(assessmentId);
      }else{
        console.log("Data are not complete")
      }
    }

    insertValue();
  }, [data])

  const insertFavorite = async () => {
    if (favorited){
      console.log("removing favorite", assessmentId);
      const response = await deleteFavorite(assessmentId);
      console.log(response);
      setFavorited(false)
    }else{
      console.log("adding favorite ", assessmentId)
      const response = await addFavorite (assessmentId);
      console.log(response)
      setFavorited(true)
    }
   
  } 

  console.log("prevResult", prevResult)
  return (
    <View style={[styles.main, {backgroundColor: isDarkMode? '#111211' : 'white'}]}>
      <View style={{ padding: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowCircleLeft}  style={{ marginRight: 10, color: isDarkMode? 'white' : '#111211' }} size={23} />
        </TouchableOpacity>

        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <Text style={{ color: isDarkMode? 'white' : '#111211', marginRight: 20 }}>Bed Name: {bed? bed:  "-"}</Text>
          <Text style={{ color: isDarkMode? 'white' : '#111211' }}>
            {new Date().toLocaleString()}
          </Text>
          
        </View>
        <Text style={{
            color: isDarkMode? 'white' : '#111211', fontWeight: 'bold',
            textAlign: 'center', marginVertical: 10
          }}>Analysis Result</Text>

        {prevResult && (
          <Text style={[{color: 'white', marginVertical: 10, fontStyle: 'italic', textAlign: 'center'}, {color: isDarkMode? 'white' : '#111211'}]}>Present VS Previous Result {prevResult.timestamp}</Text>
        )}
        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faTemperature2} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>Temperature (C)</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{temp}</Text>
            </View>

            {prevResult && (
            <View style={{ display: prevResult ? 'flex' : 'none' }}>
              <Text style={[styles.propertyValuePrev, {color: isDarkMode? 'white' : '#111211'}]}>{prevResult.temperature}</Text>
            </View>

            )}
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faWater} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>Moisture (%)</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{moisturelvl}</Text>
            </View>

            {prevResult && (
            <View >
              <Text style={[styles.propertyValuePrev, {color: isDarkMode? 'white' : '#111211'}]}>{prevResult.moisture}</Text>
            </View>
            )}
          </View>
        </View>

        <View style={styles.propertyWrapper}>
          <View style={styles.propertyCon}>
            <View style={styles.propertyLabel}>
              <FontAwesomeIcon icon={faDroplet} style={{color: isDarkMode? 'white' : '#111211'}}/>
              <Text style={[styles.propertyText, {color: isDarkMode? 'white' : '#111211'}]}>pH Level</Text>
            </View>
            <View style={[styles.propertyInner, {borderColor: isDarkMode? 'white' : '#111211'}]}>
              <Text style={[styles.propertyValue, {color: isDarkMode? 'white' : '#111211'}]}>{ph}</Text>
            </View>
            
            {prevResult && (
            <View >
              <Text style={[styles.propertyValuePrev, {color: isDarkMode? 'white' : '#111211'}]}>{prevResult.pH}</Text>
            </View>
            )}

          </View>
        </View>

        <View style={[styles.analysisBox, {borderColor: isDarkMode? 'white' : '#111211'}]}>
          
          <Text style={[styles.analysisHeader, prediction.toLowerCase() == "favorable"? {color: 'green'} : {color: 'red'}]}> 
            {prediction ? prediction.toUpperCase() : 'No Prediction Available'}
          </Text>
          {/* <Text style={styles.analysisText}>
            The vermibed has a temperature of {temp}°C, a moisture level of {moisturelvl}%, 
            and a pH level of {ph}, creating a/an {prediction} environment for vermiworms.
          </Text> */}
        </View>

        
      </View>

      <View style={{ flex: 1, marginTop: 10 }}>
        <Text style={[styles.recommendationHeader, {color: isDarkMode? 'white' : '#111211', marginBottom: 5}]}>Recommendation</Text>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 10}} >
          
          {recommendations.map((recommendation, index) => (
            <Text key={index} style={[styles.recommendationText, {color: isDarkMode? 'white' : '#111211'}]}>
              {index + 1}. {recommendation}
            </Text>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {console.log(bedId)}
        {bedId > 0 && (
          <TouchableOpacity
            onPress={insertFavorite}
            // disabled={favorited}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesomeIcon 
              icon={faHeart} 
              size={25} 
              style={{ 
                color: favorited ? 'red' : (isDarkMode ? 'white' : '#111211'), 
                marginRight: 2 
              }} 
            />

              {/* <Text style={[styles.footerText, { color: isDarkMode ? 'white' : '#111211' }]}>Mark</Text> */}
            </View>
          </TouchableOpacity>
        )}


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
  propertyValuePrev: {
    // fontWeight: 'bold',
    marginLeft: 5,
    width: 100,
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
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
    // position: 'absolute',
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

export default AnalysisResult;
