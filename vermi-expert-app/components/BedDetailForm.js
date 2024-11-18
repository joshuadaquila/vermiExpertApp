import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Updated import

const BedDetailForm = ({ bedSet, cancel }) => {
  const [vermibedName, setVermibedName] = useState("");
  const [selectedBedName, setSelectedBedName] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.label}>Vermibed Name</Text>
        <TextInput
          style={styles.input}
          value={vermibedName}
          onChangeText={setVermibedName}
          placeholder="Enter Vermibed Name"
        />

        <Text style={styles.label}>or</Text>
        <Picker
          selectedValue={selectedBedName}
          onValueChange={(itemValue) => setSelectedBedName(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a Bed Name" value="" />
          <Picker.Item label="Bed 1" value="bed1" />
          <Picker.Item label="Bed 2" value="bed2" />
          <Picker.Item label="Bed 3" value="bed3" />
        </Picker>
        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', padding: 10,}}>
          <TouchableOpacity style={styles.buttoncancel} onPress={cancel}>
            <Text style={{color: 'white', paddingHorizontal: 6, fontWeight: 'bold'}}>CANCEL</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={bedSet}>
            <Text style={{color: 'white', paddingHorizontal: 6, fontWeight: 'bold'}}>PROCEED</Text>
          </TouchableOpacity>
          {/* <Text style={{color:'white'}}>{temperature}</Text> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f5f5f5",
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
    marginRight:6,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
});

export default BedDetailForm;
