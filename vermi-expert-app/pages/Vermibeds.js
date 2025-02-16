import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { fetchBeds } from "../components/db";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faSadCry } from "@fortawesome/free-solid-svg-icons";
import BedDetails from "../components/BedDetails";
import BedForm from "../components/BedForm";
import EdDel from "../components/EdDel";
import { useTheme } from "../components/ThemeContext";

const Vermibeds = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [beds, setBeds] = useState([]);
  const [showBedDet, setShowBedDet] = useState(false);
  const [showBed, setShowBed] = useState();
  const [showAddBed, setShowAddBed] = useState(false);
  const [showMore, setShowMore] = useState(false)
  const [selectedBedId, setSelectedbedId] = useState(0)
  // Fetch beds on component mount
  useEffect(() => {
    const fetchBedData = async () => {
      try {
        const data = await fetchBeds();
        setBeds(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching beds:", error);
      }
    };

    fetchBedData();
  }, [showMore, showAddBed, showBedDet]);

  // Navigate to BedDetail on click
  const handlePress = (bed) => {
    setShowBedDet(true);
    setShowBed(bed);
    console.log(bed);
  };

  return (
    <View style={[styles.main, { backgroundColor: isDarkMode? '#111211' : 'white' }]}>
      {showBedDet && <BedDetails toggleThis={()=> setShowBedDet(false)} bed={showBed}/>}
      {showAddBed && <BedForm toggleThis={()=> setShowAddBed(false)}/>}
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <View style={[{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
             paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }, {backgroundColor: isDarkMode? 'white': '#111211'}]}>
            <Text style={{ color: isDarkMode? '#111211' : 'white', fontWeight: 'bold' }}>VERMIBEDS</Text>  
          </View>
        </View>
      </View>
      
      <FlatList
        data={beds} // Data source for the FlatList
        keyExtractor={(item) => item.bedId.toString()} // Ensure unique IDs for each list item
        renderItem={({ item }) => (
          <TouchableOpacity
          style={[styles.bedItem, {borderBottomColor: isDarkMode? 'white' : '#111211'}]}
            onPress={() => handlePress(item)}
            onPressIn = {()=> setShowMore(false)}
            onLongPress={()=> {setShowMore(true); setSelectedbedId(item.bedId)}}
          >             
            <Text style={[styles.bedText, { color: isDarkMode? 'white' : '#111211' }]}>{item.name || "Unknown Bed"}</Text>
            {selectedBedId === item.bedId && showMore && <EdDel bedId={selectedBedId} toggleThis={()=> setShowMore(false)}/>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={

          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faSadCry} style={{color: isDarkMode? 'white' : '#111211'}} size={40}/>
            <Text style={{color: isDarkMode? 'white':'#111211', marginTop: 14}}>No Vermibed Available</Text>

          </View>
        }
      />

      <TouchableOpacity onPress={()=> setShowAddBed(true)} style={{position: 'absolute', bottom: 10, right: 10,
        backgroundColor: isDarkMode? 'white' : '#111211', padding: 10, borderRadius: 5
      }}>
        <FontAwesomeIcon icon={faAdd} style={{color: isDarkMode? '#111211' : 'white'}}/>
      </TouchableOpacity>
    </View>
  );
};

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
    marginLeft: 12
    // fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Vermibeds;
