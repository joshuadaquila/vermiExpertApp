import React, { createContext, useState } from "react";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState(null);

  return (
    <BluetoothContext.Provider value={{ sensorData, setSensorData }}>
      {children}
    </BluetoothContext.Provider>
  );
};
