import { useEffect, useState } from "react"
import { StyleSheet, FlatList } from "react-native"
import { View, Text, TouchableOpacity } from "react-native"
import { fetchFavorites } from "../components/db"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faInfo, faSadCry, faSadTear, faWarning } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from '../components/ThemeContext'

const Favorites = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [analysis, setAnalysis] = useState([])
  const [selectedBedId, setSelectedBedId] = useState(0)

  const fetchAllFavorites = async () => {
    try{
      const data = await fetchFavorites();
      console.log(data)
      setAnalysis(data)
    }catch ( error) {
      console.error("Error fetching all analysis", error);
    }
  } 

  
  useEffect(()=>{
    fetchAllFavorites();
  },[])

  const handlePress = (detail, favorite) => {
    navigation.navigate('HistoryReport', { detail, favorite, onGoBack: () => fetchAllFavorites() })
  }
  return(
    <View style={[styles.main, { backgroundColor: isDarkMode? '#111211' : 'white' }]}>
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          
          <View style={[{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
             paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }, {backgroundColor: isDarkMode? 'white': '#111211'}]}>
            <Text style={{ color: isDarkMode? '#111211' : 'white', fontWeight: 'bold' }}>FAVORITES</Text>  
          </View>
        </View>


        
      </View>

      <FlatList
        data={analysis} // Data source for the FlatList
        keyExtractor={(item) => item.analysisId.toString()} // Ensure unique IDs for each list item
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.bedItem, {borderBottomColor: isDarkMode? 'white' : '#111211'}]}
            onPress={() => handlePress(item, true)}
          >
            <View style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 6}}>

            
            <Text style={[styles.bedText, {color: isDarkMode? 'white' : '#111211'}]}>{item.name || "Unknown Bed"}</Text>
            <Text style={{fontSize: 12, color: isDarkMode? 'white' : '#111211'}}>{item.timestamp}</Text>
            </View>
            {selectedBedId === item.bedId && showMore && <EdDel bedId={selectedBedId} toggleThis={()=> setShowMore(false)}/>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faSadCry} style={{color: isDarkMode? 'white' : '#111211'}} size={40}/>
            <Text style={{color: isDarkMode? 'white' : '#111211', marginTop: 14}}>No Favorites Available</Text>

          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#111211',
    height: '100%',
    color: 'white',
  },
  header: {
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  headerText: {
    color: '#111211',
    fontWeight: 'bold',
  },
  bedItem: {
    padding: 6,
    marginVertical: 5,
    // position: 'relative',
    borderRadius: 5,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  bedText: {
    color: 'white',
    // marginLeft: 12
    // fontWeight: '600',
  },
})
export default Favorites