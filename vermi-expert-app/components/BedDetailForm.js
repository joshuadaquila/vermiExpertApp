import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchBeds } from "./db";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BedDetailForm = ({ bedSet, cancel }) => {
  const [vermibedName, setVermibedName] = useState("");
  const [selectedBedName, setSelectedBedName] = useState({id: null, name: ""});
  const [beds, setBeds] = useState([]);

  const storeId = async (id) => {
    try{
      await AsyncStorage.setItem('bedId', id)
    } catch(err){
      console.log("Failed to set bed id async storage", err);
    }
  }

  const storeBed = async (name) => {
    try{
      await AsyncStorage.setItem('bedName', name)
    } catch(err){
      console.log("Failed to set bed name async storage", err);
    }
  }

  useEffect(() => {
    const fetchBed = async () => {
      const data = await fetchBeds();
      setBeds(data);
    };

    fetchBed();
  }, []);
  const handlePress = async () => {
    if (selectedBedName && selectedBedName.id !== null) {
      // Call the bedSet function if a valid selection is made
      bedSet();
    } else {
      // Clear AsyncStorage keys properly if no valid selection is made
      try {
        await AsyncStorage.multiRemove(["bedId", "bedName"]);
        bedSet();
      } catch (error) {
        console.error("Error clearing AsyncStorage:", error);
      }
    }
  };

  const handleSelection = (value) => {
    const selected = beds.find((bed) => bed.bedId === value);
    if (selected) {
      setSelectedBedName({ id: selected.bedId, name: selected.name });
      storeBed(selected.name)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.label}>Vermibed</Text>
        {/* <TextInput
          style={styles.input}
          value={vermibedName}
          onChangeText={setVermibedName}
          placeholder="Enter Vermibed Name"
        />

        <Text style={styles.label}>or</Text> */}
        
        {/* Dynamically render beds from the fetched state */}

        <View style={{borderWidth: 1, justifyContent: 'center', borderColor: '#adadad'}}>
        <Picker
          selectedValue={selectedBedName.id}
          onValueChange={(itemValue) => {handleSelection(itemValue); storeId(itemValue.toString())}}
          style={styles.picker}
        >
          <Picker.Item label="Select a Bed" value="" />
          {beds.map((bed) => (
            <Picker.Item 
              key={bed.bedId} 
              label={bed.name} 
              value={bed.bedId} 
            />
          ))}
        </Picker>
        </View>

        <Text style={{fontStyle: 'italic', marginTop: 4}}>Proceeding without selecting a bed won't save the analysis report.</Text>

        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity style={styles.buttoncancel} onPress={cancel}>
            <Text style={{ color: 'white', paddingHorizontal: 6, fontWeight: 'bold' }}>CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={{ color: 'white', paddingHorizontal: 6, fontWeight: 'bold' }}>PROCEED</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    zIndex: 1,
  },
  main: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "bold",
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#111211',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttoncancel: {
    backgroundColor: '#6b0e0e',
    marginRight: 6,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
});

export default BedDetailForm;
