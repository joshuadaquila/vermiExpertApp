import React from "react";
import { View, Text } from "react-native";

const BtStat = ({ status }) => {
  return (
    <View
      style={{
        backgroundColor: status === "true" ? "green" : "red", // Change background color based on status
      }}
    >
      <Text
        style={{
          color: "white", // Text color remains white for both statuses
          // fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {status === "true" ? "Bluetooth Connected!" : "Bluetooth Disconnected!"}
      </Text>
    </View>
  );
};

export default BtStat;
