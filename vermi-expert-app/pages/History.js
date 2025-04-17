import { useEffect, useState } from "react"
import { StyleSheet, FlatList } from "react-native"
import { View, Text, TouchableOpacity } from "react-native"
import { fetchAllAnalysis } from "../components/db"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faDownload, faInfo, faSadCry, faSadTear, faWarning } from "@fortawesome/free-solid-svg-icons"
import { useTheme } from '../components/ThemeContext'
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const History = ({ navigation }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [analysis, setAnalysis] = useState([])
  const [selectedBedId, setSelectedBedId] = useState(0)

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

  const convertToCSV = (jsonData) => {
    if (!jsonData.length) return '';
    const header = Object.keys(jsonData[0]).join(',') + '\n';
    const rows = jsonData.map(obj =>
      Object.values(obj)
        .map(val => `"${val}"`)
        .join(',')
    ).join('\n');

    return header + rows;
  };

  const handleDownload = async () => {
    try {
      const csv = convertToCSV(analysis);
      const path = `${RNFS.DocumentDirectoryPath}/analysis.csv`;
      await RNFS.writeFile(path, csv, 'utf8');
      console.log('CSV written to:', path);

      await Share.open({
        url: 'file://' + path,
        type: 'text/csv',
        filename: 'analysis.csv',
      });
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  

  const handlePress = (detail) => {
    navigation.navigate('HistoryReport', { detail })
  }
  return(
    <View style={[styles.main, { backgroundColor: isDarkMode? '#111211' : 'white' }]}>
      <View style={{ padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          
          <View style={[{ display: 'flex', alignItems: 'center', justifyContent: 'center', 
             paddingHorizontal: 5, borderRadius: 10, backgroundColor: 'white' }, {backgroundColor: isDarkMode? 'white': '#111211'}]}>
            <Text style={{ color: isDarkMode? '#111211' : 'white', fontWeight: 'bold' }}>HISTORY</Text>  
          </View>
        </View>


        
      </View>

      <FlatList
        data={analysis} // Data source for the FlatList
        keyExtractor={(item) => item.analysisId.toString()} // Ensure unique IDs for each list item
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.bedItem, {borderBottomColor: isDarkMode? 'white' : '#111211'}]}
            onPress={() => handlePress(item)}
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
            <Text style={{color: isDarkMode? 'white' : '#111211', marginTop: 14}}>No Assessment History Available</Text>

          </View>
        }
      />

      {/* Download Button */}
      <TouchableOpacity
        style={[styles.downloadButton, { backgroundColor: isDarkMode ? 'white' : '#111211' }]}
        onPress={handleDownload}
      >
        <FontAwesomeIcon icon={faDownload} size={18} color={isDarkMode ? '#111211' : 'white'} />
        <Text style={{ marginLeft: 6, color: isDarkMode ? '#111211' : 'white' }}>Share CSV</Text>
      </TouchableOpacity>
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
  downloadButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111211',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})
export default History