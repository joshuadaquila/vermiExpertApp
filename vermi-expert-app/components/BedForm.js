import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import DatePicker from "react-native-date-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowCircleLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import { addBed } from "./db";
import Toast from "react-native-toast-message"; // Ensure this is installed and imported

const BedForm = ({ toggleThis, bed, onEdit }) => {
  const [editedBed, setEditedBed] = useState({ ...bed });
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const handleInputChange = (field, value) => {
    setEditedBed({ ...editedBed, [field]: value });
  };

  const showErrorToast = () => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Bed name field must be filled.",
      position: "top",
    });
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "Added Successfully.",
      position: "top",
    });
  };

  const handleSave = async () => {
    const { name, length, depth, width, material, location, dateCreated } = editedBed;

    // Validation: Ensure all required fields are filled
    if (!name) {
      showErrorToast();
      return;
    }

    if (onEdit) {
      onEdit(editedBed);
    }

    try {
      await addBed(editedBed);
      toggleThis();
      showToast();
    } catch (error) {
      showErrorToast();
      console.error("Error adding bed:", error);
    }
  };

  console.log("edited bed", editedBed);

  return (
    <TouchableWithoutFeedback onPress={toggleThis}>
      <View style={styles.container}>
        <TouchableWithoutFeedback>
          <View style={styles.main}>
            <TouchableOpacity
              style={{ position: "absolute", top: 10, left: 10 }}
              onPress={toggleThis}
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} size={23} />
            </TouchableOpacity>
            <Text style={styles.label}>Add New Bed</Text>

            <View style={styles.formRowContainer}>
              <View style={styles.formColumn}>
                <Text style={styles.fieldLabel}>Name: *</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />

                <Text style={styles.fieldLabel}>Length (m):</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.length}
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange("length", text)}
                />

                <Text style={styles.fieldLabel}>Depth (m):</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.depth}
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange("depth", text)}
                />
              </View>

              <View style={styles.formColumn}>
                <Text style={styles.fieldLabel}>Width (m):</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.width}
                  keyboardType="numeric"
                  onChangeText={(text) => handleInputChange("width", text)}
                />

                <Text style={styles.fieldLabel}>Material:</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.material}
                  onChangeText={(text) => handleInputChange("material", text)}
                />

                <Text style={styles.fieldLabel}>Location:</Text>
                <TextInput
                  style={styles.input}
                  value={editedBed.location}
                  onChangeText={(text) => handleInputChange("location", text)}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Date Created:</Text>
            <TouchableOpacity
              onPress={() => setDatePickerOpen(true)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>
                {editedBed.dateCreated
                  ? new Date(editedBed.dateCreated).toLocaleDateString()
                  : "Select Date"}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              theme="light"
              open={isDatePickerOpen}
              date={editedBed.dateCreated ? new Date(editedBed.dateCreated) : new Date()}
              onConfirm={(date) => {
                setEditedBed({ ...editedBed, dateCreated: date.toISOString() });
                setDatePickerOpen(false);
              }}
              onCancel={() => setDatePickerOpen(false)}
            />

            <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
              <View style={styles.saveButton}>
                <FontAwesomeIcon icon={faEdit} color="white" />
                <Text style={styles.saveButtonText}> Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  main: {
    width: 320,
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
    textAlign: "center",
  },
  formRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  formColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  fieldLabel: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: "#111211",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    marginLeft: 5,
  },
});

export default BedForm;
