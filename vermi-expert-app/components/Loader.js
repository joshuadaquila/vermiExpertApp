import React, { useEffect, useRef,useState } from "react";
import { View, Text, Button, Animated, StyleSheet } from "react-native";
import Spinner from "react-native-spinkit";  // For the spinner animation

const Loader = () => {
  const [loading, setLoading] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current; // Create an animated value

  useEffect(() => {
    setLoading(true); // Start spinner animation automatically on mount
    
    // Loop the animation to rotate continuously
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // Duration of one full rotation (2 seconds)
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Rotate from 0 degrees to 360 degrees
  });

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>Analyzing...</Text>
        {/* Display the spinner from react-native-spinkit if loading */}
        {loading && (
          <Spinner
            isVisible={loading}
            size={50}
            type="ChasingDots" // You can choose any spinner type you prefer
            color="#1F4529" // Blue color for the spinner
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 2,
  },
  main: {
    width: 200,
    padding: 20,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make it circular
    borderWidth: 8,
    borderColor: "#f3f3f3", // Light grey background color for the spinner
    borderTopColor: "#3498db", // Blue color for the top part of the spinner
    marginBottom: 10, // Space between spinner and text
  },
  text: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
});

export default Loader;
