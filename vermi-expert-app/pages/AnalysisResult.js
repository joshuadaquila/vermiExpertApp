import { View, StyleSheet, TouchableOpacity, Image, Text, Dimensions } from "react-native";
import { faArrowCircleLeft, faRedo, faSun, faThermometerHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useContext, useEffect, useState } from "react";
import { BluetoothContext } from "../components/BluetoothProvider";
import { insertAnalysis } from "../components/db";
import Loader from "../components/Loader";

const AnalysisResult = ({ navigation, route }) => {
  const [data, setData] = useState({});
  const { plantId, plantInfo } = route.params;
  const { sensorData } = useContext(BluetoothContext);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

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
  const plantImage = plantImages[plantId];
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (sensorData) {
      setData(sensorData);
    }
  }, [sensorData]);

  const handleAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.replace("Result", { plantId, plantInfo });
    }, 3000);
  };

  const getRecommendation = () => {
    const light = data?.light || 0;
    const temperature = data?.temperature || 0;
    let recommendation = "";

    const plantType = plantInfo[0].name;

    // Recommendations based on plant type (rule set)
    if (plantType === "Peace Lily (Spathiphyllum)") {
      if (temperature > 27) {
          recommendation = "Please Move the Plant: Lower temperature between 18°C to 27°C. (Roviello, V., Scognamiglio, P. L., Caruso, U., Vicidomini, C., & Roviello, G. N., 2021).";
      } else if (temperature < 18) {
          recommendation = "Please Move the Plant: Raise temperature between 18°C to 27°C. (Roviello, V., Scognamiglio, P. L., Caruso, U., Vicidomini, C., & Roviello, G. N., 2021).";
      }
      if (light < 296 || light > 874) {
          recommendation += " Please Move the Plant: Thrives in low shaded area with light between 296 - 874 lux. (Sugano, S., Ishii, M., & Tanabe, S., 2024).";
      }
    } else if (plantType === "Boston Fern (Nephrolepis exaltata)") {
        if (temperature > 27) {
            recommendation = "Please Move the Plant: Lower temperature between 18°C to 27°C. (O., R. A., 2024).";
        } else if (temperature < 18) {
            recommendation = "Please Move the Plant: Raise temperature between 18°C to 27°C. (O., R. A., 2024).";
        }
        if (light < 652 || light > 870) {
            recommendation += " Please Move the Plant: Thrives where the light is between 652 - 870 lux. (O., R. A., 2024).";
        }
    } else if (plantType === "ZZ Plant (Zamioculcas zamiifolia)") {
        if (temperature > 25) {
            recommendation = "Please Move the Plant: Lower temperature between 20°C to 25°C. (Kim, H., Yeo, I., & Lee, J., 2020).";
        } else if (temperature < 20) {
            recommendation = "Please Move the Plant: Raise temperature between 20°C to 25°C. (Kim, H., Yeo, I., & Lee, J., 2020).";
        }
        if (light < 4348 || light > 13043) {
            recommendation += " Please Move the Plant: Thrives where the light is between 4348 - 13043 lux. (Malla, P., Kedistu, R., & Singh, D., 2023).";
        }
    } else if (plantType === "Rubber Plant (Ficus elastica)") {
        if (temperature > 30) {
            recommendation = "Please Move the Plant: Lower temperature between 20°C to 30°C. (Li, J., Cao, X., Lu, X., Li, G., & Zhou, Z., 2025).";
        } else if (temperature < 20) {
            recommendation = "Please Move the Plant: Raise temperature between 20°C to 30°C. (Li, J., Cao, X., Lu, X., Li, G., & Zhou, Z., 2025).";
        }
        if (light < 8739 || light > 12696) {
            recommendation += " Please Move the Plant: Thrives where the light is between 8739 - 12696 lux. (Palsha et al., 2024).";
        }
    } else if (plantType === "Spider Plant (Chlorophytum comosum)") {
        if (temperature > 25) {
            recommendation = "Please Move the Plant: Lower temperature between 20°C to 25°C. (Jiang et al., 2024).";
        } else if (temperature < 20) {
            recommendation = "Please Move the Plant: Raise temperature between 20°C to 25°C. (Jiang et al., 2024).";
        }
        if (light < 4348 || light > 13043) {
            recommendation += " Please Move the Plant: Thrives where the light is between 4348 - 13043 lux. (Adhami et al., 2021).";
        }
    } else if (plantType === "Dieffenbachia (Dieffenbachia spp.)") {
        if (temperature > 25) {
            recommendation = "Please Move the Plant: Lower temperature between 20°C to 25°C. (Malbog, M. A. F., 2020).";
        } else if (temperature < 20) {
            recommendation = "Please Move the Plant: Raise temperature between 20°C to 25°C. (Malbog, M. A. F., 2020).";
        }
        if (light < 4348 || light > 13043) {
            recommendation += " Please Move the Plant: Thrives where the light is between 4348 - 13043 lux.";
        }
    }
  
    // Add other plant types similarly...

    if (!recommendation) {
      recommendation = "The plant is fine under the current conditions.";
    }

    return recommendation;
  };

  useEffect(() => {
    if (data) {
      const updatedRecommendation = getRecommendation();
      setRecommendation(updatedRecommendation);
    }
  }, [data]);

  useEffect(() => {
    const insertAssessment = async () => {
      if (data.light !== undefined && data.temperature !== undefined && data.temperature !== 0) {
        const state = {
          plantId: plantId,
          light: data.light,
          temperature: data.temperature,
          recommendations: recommendation,
        };
        await insertAnalysis(state);
      }
    };

    insertAssessment();
  }, [recommendation]); // Trigger when recommendation changes

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
        <FontAwesomeIcon icon={faArrowCircleLeft} color="#1F4529" size={25} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAnalysis} style={styles.reanalyzeButton}>
        <FontAwesomeIcon icon={faRedo} color="white" size={30} />
      </TouchableOpacity>
      {loading && <Loader />}
      <View>
        <Image source={plantImage} style={{ height: 500, width: screenWidth }} />
        
        <View style={styles.dataMain}>
          <Text style={{paddingVertical: 8, fontSize: 18, fontWeight: 'bold', elevation: 20,
          backgroundColor: 'white', borderRadius: 8, marginBottom: 5, paddingHorizontal: 8,  color: '#1F4529'}}>{plantInfo[0].name}</Text>

          <View style={styles.dataOverlay}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 10, 
              borderWidth: 1, padding: 5, borderColor: 'white'}}>
              <FontAwesomeIcon icon={faSun} color="white" style={{marginRight: 5}} />
              <Text style={styles.dataText}>Light: {data?.light || 0} lux</Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              borderWidth: 1, padding: 5, borderColor: 'white' }}>
              <FontAwesomeIcon icon={faThermometerHalf} color="white" style={{marginRight: 5}} />
              <Text style={styles.dataText}>Temperature: {data?.temperature || 0} °C</Text>
            </View>
          </View>
        </View>
        
      </View>

      <View style={{padding: 10, backgroundColor: 'white'}}>
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Recommendation:</Text>
        <Text style={{marginTop: 10, fontSize: 15}}>{recommendation}</Text>
      </View>

      <Text style={{padding: 10, opacity: 0.6}}>We provide only the optimal care recommendations for each plant, as supported by cited sources.</Text>
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
  reanalyzeButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#1F4529',
    padding: 10,
    borderRadius: 30,
    elevation: 10
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

export default AnalysisResult;