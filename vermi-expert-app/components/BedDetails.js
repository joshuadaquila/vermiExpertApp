import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Button,
  TouchableOpacity,
} from "react-native";
import { formatDateTime } from "./FormatDateTime";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAlignLeft, faArrowCircleLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import EditBed from "./EditBed";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { deleteBed } from "./db";

const BedDetails = ({ toggleThis, bed, onEdit }) => {
  const [showEdit, setShowEdit] = useState(false);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "Deleted Successfully.",
      position: "top"
    });
  };

  const handleToggleEdit = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to cancel?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => setShowEdit(false),
        },
      ],
      { cancelable: false }
    );
  }

  const handleDel = () => {
    Alert.alert(
      "Confirmation",
      "Deleting this bed will remove all associated assessment records and favorites. Do you confirm?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {deleteBed(bed.bedId); toggleThis(); showToast()},
          
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableWithoutFeedback onPress={toggleThis}>
      
      <View style={styles.container}>
      {showEdit && <EditBed bed={bed} toggleThis={handleToggleEdit} done={()=> {setShowEdit(false); toggleThis()}}/>}
        <TouchableWithoutFeedback>
          <View style={styles.main}>
            <TouchableOpacity style={{position: 'absolute', top: 10, left: 10}} onPress={toggleThis}>
              <FontAwesomeIcon icon={faArrowCircleLeft} size={23}/>
            </TouchableOpacity>
            <Text style={styles.label}>Bed Details</Text>

            <Text><Text style={styles.fieldLabel}>Name:</Text> {bed.name}</Text>
            <Text><Text style={styles.fieldLabel}>Length (m):</Text> {bed.length}</Text>
            <Text><Text style={styles.fieldLabel}>Width (m):</Text> {bed.width}</Text>
            <Text><Text style={styles.fieldLabel}>Depth (m):</Text> {bed.depth}</Text>
            <Text><Text style={styles.fieldLabel}>Material:</Text> {bed.material}</Text>
            <Text><Text style={styles.fieldLabel}>Location:</Text> {bed.location}</Text>
            <Text><Text style={styles.fieldLabel}>Date Created:</Text> {formatDateTime(bed.dateCreated)}</Text>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity style={styles.buttonContainer} onPress={()=>setShowEdit(true)}>
              <View style={{backgroundColor: '#111211', padding: 10, borderRadius: 20}}>
                <FontAwesomeIcon icon={faEdit} color="white"/>
              </View>
             
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={()=>handleDel()}>
              <View style={{backgroundColor: '#111211', padding: 10, borderRadius: 20}}>
                <FontAwesomeIcon icon={faTrashAlt} color="white"/>
              </View>
             
            </TouchableOpacity>
            </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
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
    textAlign: "center",
  },
  fieldLabel: {
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
    borderRadius: 20,
    margin: 2
  },
});

export default BedDetails;
