import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { fetchPlants } from "../components/db"; // Assuming fetchPlants is imported correctly
import Loader from "../components/Loader";
import BedDetailForm from "../components/BedDetailForm";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

const BluetoothTest = ({ sensorVal, navigation }) => {
  const [showBedForm, setShowBedForm] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [searchText, setSearchText] = useState(""); // State for search input
  const [plants, setPlants] = useState([]); // All plants from the database
  const [filteredPlants, setFilteredPlants] = useState([]); // Filtered search results
  // const navigation = useNavigation();

  // Fetch plants from the database on mount
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const plantData = await fetchPlants(); // Fetch plant data from the database
        console.log(plantData)
        setPlants(plantData);
        setFilteredPlants(plantData); // Initially show all plants
      } catch (error) {
        console.error("Error fetching plants:", error);
        fetchPlantData();
      }
    };

    fetchPlantData();
  }, []);

  // Filter plants as the user types
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = plants.filter((plant) =>
      plant.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlants(filtered);
  };

  const handlePress = (plantId) => {
    navigation.navigate('PlantDetail', {plantId})
  }
  return (
    <View style={styles.main}>
      {showLoader && <Loader />}

      {showBedForm && (
        <BedDetailForm
          cancel={() => setShowBedForm(false)}
          bedSet={() => {
            setShowBedForm(false);
            setShowLoader(true);
            setTimeout(() => {
              setShowLoader(false);
            }, 6000);
          }}
        />
      )}

      <ImageBackground
        source={require("../resources/cover.jpeg")}
        style={{ height: "100%", width: "auto" }}
      >
        <View style={{ height: "100%", display: "flex", justifyContent: "flex-end" }}>
          <View>
            <View style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", margin: 10 }}>
              <Text style={styles.title}>Indoor Plant Care Recommender System</Text>
            </View>
          </View>
          <View style={styles.searchContainer}>
            {/* Search Bar */}
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                style={styles.searchBar}
                placeholder="Search for a plant..."
                value={searchText}
                onChangeText={handleSearch}
              />
              <FontAwesomeIcon icon={faSearch} color="#1F4529" style={{marginHorizontal: 10}}/>
            </View>
            

            {/* Display Search Results */}
            <FlatList
              data={filteredPlants}
              keyExtractor={(item) => item.plantId.toString()} // Ensure plant IDs are unique
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={()=> handlePress(item.plantId)}>
                  <Text style={styles.resultText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#DCE4C9",
    height: "100%",
  },
  title: {
    color: "#1F4529",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  searchContainer: {
    backgroundColor: "white",
    height: "55%",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    elevation: 5,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
  },
});

export default BluetoothTest;
