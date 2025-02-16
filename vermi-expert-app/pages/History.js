import { useEffect, useState } from "react"
import { StyleSheet, FlatList } from "react-native"
import { View, Text, TouchableOpacity } from "react-native"
import { fetchAllAnalysis } from "../components/db"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faHistory, faInfo, faSadCry, faSadTear, faWarning } from "@fortawesome/free-solid-svg-icons"

const History = ({ navigation }) => {
  const [analysis, setAnalysis] = useState([])
  

  useEffect(()=>{
    const fetchAnalysis = async () => {
      try{
        const data = await fetchAllAnalysis();
        console.log(data)
        setAnalysis(data)
      }catch ( error) {
        console.error("Error fetching all analysis", error);
      }
    } 

    fetchAnalysis();
  },[])

  const handlePress = (detail) => {
    navigation.navigate('HistoryReport', { detail })
  }
  return(
    <View style={styles.main}>
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.header}>
            <FontAwesomeIcon icon={faHistory} color="#1F4529" />
            <Text style={styles.headerText}>HISTORY</Text>
          </View>
        </View>
      </View>

      <View style={{backgroundColor: 'white', padding: 20, position: 'absolute', bottom: 0, width: '100%', borderTopLeftRadius: 25,
        borderTopRightRadius: 25, elevation: 10, height: '90%'
      }}>
      <FlatList
        data={analysis} // Data source for the FlatList
        keyExtractor={(item) => item.analysisId.toString()} // Ensure unique IDs for each list item
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bedItem}
            onPress={() => handlePress(item)}
          >
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 6}}>

            
            <Text style={styles.bedText}>{item.name || "Unknown Bed"}</Text>
            <Text style={{fontSize: 12, color: 'white'}}>{item.timestamp}</Text>
            </View>
            {/* {selectedBedId === item.bedId && showMore && <EdDel bedId={selectedBedId} toggleThis={()=> setShowMore(false)}/>} */}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faSadCry} color="white" size={40}/>
            <Text style={{color: 'white', marginTop: 14}}>No Assessment History Available</Text>

          </View>
        }
      />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#EED3B1',
    height: '100%',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerText: {
    color: '#1F4529',
    marginLeft: 2,
    fontWeight: 'bold',
    fontSize: 15
  },
  bedItem: {
    // padding: 6,
    // marginVertical: 3,
    // position: 'relative',
    borderRadius: 5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1F4529'
  },
  bedText: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'semibold'
    // marginLeft: 12
    // fontWeight: '600',
  },
})
export default History