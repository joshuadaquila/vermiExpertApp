import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"; // Import Image component
import { BlurView } from '@react-native-community/blur'; // Import the BlurView component

export default function BluetoothNotice() {
  return (
    <View style={styles.container}>
      {/* Full-screen BlurView */}
      <BlurView
        style={styles.blurView}
        blurType="light" // Set the blur style: light, dark, extra light, etc.
        blurAmount={10}  // Adjust the blur intensity
      >
        {/* This view will have the white background with the message */}
        <View style={styles.noticeContainer}>
          <Text style={styles.text}>Bluetooth Not Connected</Text>
          {/* Render the Image */}
          <Image 
            source={require('../resources/bt.png')} // Adjust the path as needed
            style={styles.image} // Style the image as needed
          />
          <Text style={{textAlign: 'center'}}>Open and connect your bluetooth to the sensor's bluetooth device.</Text>
          
          {/* Styled Ok Button */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ok</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Positioning it absolutely
    top: 0, // Start from the top of the screen
    left: 0, // Full width
    right: 0, // Full width
    bottom: 0, // Full height
    zIndex: 1, // Ensure it's on top of other content
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  blurView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute', // Position blur view behind the notice
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  noticeContainer: {
    marginTop: 80,
    width: '80%', // Make the container take up a percentage of the screen width
    height: '50%',
    backgroundColor: 'white', // White background for the notice
    padding: 20,
    borderRadius: 10,
    zIndex: 2, // Make sure it's above the blur
    alignItems: 'center', // Center the text inside the notice container
    justifyContent: 'center', // Ensure the text is centered vertically
  },
  text: {
    color: 'black', // Black text on white background
    fontWeight: 'bold',
    fontSize: 18, // You can adjust the font size here
  },
  image: {
    width: 100, // Adjust width of the image
    height: 100, // Adjust height of the image
    marginBottom: 10, // Add some spacing if needed
  },
  button: {
    marginTop: 20,
    backgroundColor: '#111211', // Button color
    paddingVertical: 10, // Vertical padding for height
    paddingHorizontal: 30, // Horizontal padding for width
    borderRadius: 20, // Rounded corners
    alignItems: 'center', // Center the text inside the button
    justifyContent: 'center', // Center the text vertically
  },
  buttonText: {
    color: 'white', // Text color inside the button
    fontWeight: 'bold',
    fontSize: 16, // Text size
  },
});
