import { faClose, faGauge, faHeart, faHistory, faInbox, faInfoCircle, faLineChart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const Sidebar = ({ toggleThis, menu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-Dimensions.get("window").width)).current; // Sidebar starts off-screen
  const navigation = useNavigation(); // Get navigation prop

  // Slide-in and slide-out animation for the sidebar
  const toggleSidebar = (open) => {
    Animated.timing(slideAnim, {
      toValue: open ? 0 : -Dimensions.get("window").width, // Slide in or out
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!open) {
        toggleThis(); // Call toggleThis only after animation completes
      }
    });
  };

  // Automatically open the sidebar when the component is mounted
  useEffect(() => {
    setIsOpen(true);
    toggleSidebar(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    toggleSidebar(false);
  };

  const isActive = (currentMenu) => menu === currentMenu; // Check if the menu item matches the passed prop

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName); // Navigate to the desired screen
    handleClose(); // Close the sidebar after navigating
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isOpen) handleClose(); // Close the sidebar when tapping outside
      }}
    >
      <View style={styles.container}>
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]} // Apply sliding animation to the sidebar
        >
          <Text style={styles.sidebarText}>VermiExpert App</Text>
          
          {/* Menu items */}
          <TouchableOpacity
            style={[styles.menuItem, isActive("dashboard") && styles.activeMenu]}
            onPress={() => navigateToScreen("Dashboard")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faGauge} style={[styles.menuIcon, isActive("dashboard") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("dashboard") && styles.activeMenuText]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isActive("sensorMonitoring") && styles.activeMenu]}
            onPress={() => navigateToScreen("SensorMonitoring")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faLineChart} style={[styles.menuIcon, isActive("sensorMonitoring") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("sensorMonitoring") && styles.activeMenuText]}>Sensor Monitoring</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isActive("history") && styles.activeMenu]}
            onPress={() => navigateToScreen("History")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faHistory} style={[styles.menuIcon, isActive("history") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("history") && styles.activeMenuText]}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isActive("vermiBeds") && styles.activeMenu]}
            onPress={() => navigateToScreen("VermiBeds")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faInbox} style={[styles.menuIcon, isActive("vermiBeds") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("vermiBeds") && styles.activeMenuText]}>Vermi Beds</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isActive("favorites") && styles.activeMenu]}
            onPress={() => navigateToScreen("Favorites")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faHeart} style={[styles.menuIcon, isActive("favorites") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("favorites") && styles.activeMenuText]}>Favorites</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, isActive("about") && styles.activeMenu]}
            onPress={() => navigateToScreen("About")} // Add onPress for navigation
          >
            <FontAwesomeIcon icon={faInfoCircle} style={[styles.menuIcon, isActive("about") && styles.activeMenuText]} />
            <Text style={[styles.menuText, isActive("about") && styles.activeMenuText]}>About</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: Dimensions.get("window").width - 50,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    padding: 20,
  },
  sidebarText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  menuItem: {
    padding: 15,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 2,
  },
  menuText: {
    fontWeight: "bold",
    color: "#000",
  },
  activeMenu: {
    backgroundColor: "#111211",
    borderRadius: 40,
  },
  activeMenuText: {
    color: "white",
  },
  closeIcon: {
    fontSize: 30,
    color: "white",
  },
});

export default Sidebar;
