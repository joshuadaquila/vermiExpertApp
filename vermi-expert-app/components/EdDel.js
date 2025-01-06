import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { TouchableOpacity } from "react-native"
import { StyleSheet } from "react-native"
import { View, Text, Alert } from "react-native"
import { deleteBed } from "./db"
import { useEffect } from "react"
import { Toast } from "react-native-toast-message/lib/src/Toast"

const EdDel = ({ bedId, toggleThis }) => {

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success!",
      text2: "Deleted Successfully.",
      position: "top"
    });
  };

  const handleDel = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to delete delete this bed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {deleteBed(bedId); toggleThis(); showToast()},
          
        },
      ],
      { cancelable: false }
    );
  };

  const delBed = async () => {
    try{
      await deleteBed (bedId)
    } catch (error){
      console.log("Delete bed failed", error)
    }
  }
  return(
    <View style={{position: 'absolute', right: 14, flexDirection: 'row', borderRadius: 6, top: -5, zIndex: 1}}>
      {/* <TouchableOpacity style={styles.buttonCon}>
        <FontAwesomeIcon icon={faEdit}/>
        <Text>Edit</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.buttonCon} onPress={handleDel}>
        <FontAwesomeIcon icon={faTrash} color="white"/>
        {/* <Text>Delete</Text> */}
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  buttonCon:{
    flexDirection: 'row',
    padding: 8,
    backgroundColor: 'red',
    borderRadius: 20
  }
})
export default EdDel