import { View, StyleSheet, ScrollView, Text } from "react-native"
import { faBars, faDroplet, faTemperature0, faTemperature1, faTemperature2, faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
// import evaluateRules from "../components/knowledgeBase";
import EvaluateRules from "../components/Knowledge";
import { useEffect, useState } from "react";
import loadModel from "../components/prediction";

const AnalysisResult = ({ route }) => {
  const { temp, ph, moisturelvl } = route.params;
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState('');
  console.log(route.params)

  useEffect(() => {
    // Prepare the data object for evaluateRules
    const data = { temperature: temp, pH: ph, moisture: moisturelvl };
    
    // Call evaluateRules and update recommendations
    const prediction = loadModel(temp, moisturelvl, ph);
    const recommendationsList = EvaluateRules(data)
    setPrediction(prediction);
    // console.log(evaluateRules(data))
    setRecommendations(recommendationsList);
  }, [temp, ph, moisturelvl]);

  // console.log(recommendations)

  return(
    <View style={styles.main}>
      <View style={{ padding: 10 }}>
        <FontAwesomeIcon icon={faBars} color="white" style={{ marginRight: 10}} />

        <View style={{marginTop: 10}}>
          <Text style={{color: 'white'}}>Bed Name:</Text>
          <Text style={{color: 'white'}}>Date and Time: </Text>
          <Text style={{
            color: 'white', fontWeight: 'bold',
            textAlign: 'center', marginVertical: 10}}>Analysis Result</Text>
        </View>


        <View style={{alignItems: 'center', justifyContent: 'center', margin: 5}}>
          <View style={styles.propertyCon}>
            <View style={{justifyContent: 'flex-end', alignItems: 'center', 
            flexDirection: 'row', width: 150 }}>
              <FontAwesomeIcon icon={faTemperature2} color="white"  />
              <Text style={{ color: 'white', marginLeft: 4 }}>Temperature (C)</Text>
            </View>
            
            <View style={styles.propertyInner}>
              <Text style={{ fontWeight: 'bold', width: 100,
               fontSize: 35, color: 'white', textAlign: 'center' }}>{temp}</Text>
            </View>
          </View>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center', margin: 5}}>
          <View style={styles.propertyCon}>
            <View style={{justifyContent: 'flex-end', alignItems: 'center', 
            flexDirection: 'row',  width: 150  }}>
              <FontAwesomeIcon icon={faWater} color="white"  />
              <Text style={{ color: 'white', marginLeft: 4 }}>Moisture (%)</Text>
            </View>
            
            <View style={styles.propertyInner}>
              <Text style={{ fontWeight: 'bold', width: 100,
                fontSize: 35, color: 'white', textAlign: 'center' }}>{moisturelvl}</Text>
            </View>
          </View>
        </View>

        <View style={{alignItems: 'center', justifyContent: 'center', margin: 5}}>
          <View style={styles.propertyCon}>
            <View style={{justifyContent: 'flex-end', alignItems: 'center', 
            flexDirection: 'row',  width: 150  }}>
              <FontAwesomeIcon icon={faDroplet} color="white"  />
              <Text style={{ color: 'white', marginLeft: 4 }}>pH Level</Text>
            </View>
            
            <View style={styles.propertyInner}>
              <Text style={{ fontWeight: 'bold', width: 100,
                fontSize: 35, color: 'white', textAlign: 'center' }}>{ph}</Text>
            </View>
          </View>
        </View>


        

        <View style={{borderWidth: 1, borderColor: 'white',
          marginTop: 10, borderRadius: 10, padding: 15
          }}> 
          <View>
            <Text style={{textAlign: 'center', color:'white',
            fontWeight: 'bold', fontSize: 15, marginBottom: 2}}>{prediction}</Text>
            <Text style={{color:'white'}}>The vermibed has a temperature of {temp}°C, a moisture level of {moisturelvl}%, 
              and a pH level of {ph}, creating a {prediction} environment for vermiworms.</Text>
          </View>
        </View>

        <View style={{ marginTop: 10}}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 10 }} style={{ maxHeight: 280}}>
            <Text style={{ fontWeight: 'bold', color: 'white', textAlign: 'center' }}>
              Recommendation
            </Text>
            {recommendations.map((recommendation, index) => (
            <Text key={index} style={{ color: 'white', marginBottom: 5 }}>
              {index+ 1}. {recommendation}
            </Text>))}
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: '#111211',
    // height: '100%',
    color: 'white',
    flex: 1,
  },
  propertyCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // alignItems: 'flex-start',
    width: '100%',
  },
  propertyInner: {
    padding: 10,
    // alignItems: 'center',
    // width: '100%',
    // height: '100%',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    // backgroundColor: 'white'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
});

export default AnalysisResult;