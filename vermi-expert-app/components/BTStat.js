import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const BtStat = ({ status, clicked, message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide the component after 3 seconds if status is true
    // if (status === "true") {
    //   const timer = setTimeout(() => {
    //     setVisible(false);
    //   }, 3000); // 3 seconds timeout

    //   // Cleanup the timeout if the component is unmounted or status changes
    //   return () => clearTimeout(timer);
    // }
  }, [status]); // Re-run effect when status changes

  if (!visible) return null; // Don't render the component if it's not visible

  return (
    <TouchableOpacity
      style={{
        backgroundColor: status === "true" ? "green" : "red", // Change background color based on status
      }}
      onPress={clicked}
    >
      <Text
        style={{
          color: "white", // Text color remains white for both statuses
          textAlign: "center",
        }}
      >
        {message}
      </Text>
    </TouchableOpacity>
  );
};

export default BtStat;
