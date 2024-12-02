import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import BluetoothTest from "../pages/BluetoothComponent";
import Sensor from "../pages/Sensor";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisV, faGauge, faHamburger, faHeart, faHistory, faInbox, faLineChart, faWorm } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [showMore, setShowMore] = useState(false);

  const renderContent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <BluetoothTest />;
      case "Sensor":
        return <Sensor />;
      default:
        return <BluetoothTest />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      {showMore && 
        <View style={styles.OptionsCon}>
          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4, alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHistory}/>
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}>
            <FontAwesomeIcon icon={faInbox}/>
            <Text style={styles.buttonText}>Vermibeds</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{flexDirection: 'row', marginVertical: 4,  alignItems: 'center'}}>
            <FontAwesomeIcon icon={faHeart}/>
            <Text style={styles.buttonText}>Favorites</Text>
          </TouchableOpacity>
        </View>}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveComponent("Dashboard")}
        >
          <FontAwesomeIcon icon={faGauge}/>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setActiveComponent("Sensor")}
        >
          <FontAwesomeIcon icon={faLineChart}/>
          <Text style={styles.buttonText}>Sensor Monitoring</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button}
            onPress={() => setShowMore(!showMore)}
        >
          <FontAwesomeIcon icon={faWorm} size={20} color="green"/>
          {/* <Text style={styles.buttonText}>Sensor Monitoring</Text> */}
        </TouchableOpacity>
      </View>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#111211'
  },
  content: {
    flex: 1,
    backgroundColor: "#111211",
    marginBottom: 15,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
  },
  button: {
    paddingHorizontal: 10,
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#111211",
    marginHorizontal: 4
  },
  OptionsCon: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 50,
    right: 10,
    zIndex: 1,
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  }
  
});

export default Footer;
