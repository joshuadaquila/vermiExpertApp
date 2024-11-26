import React, { createContext, useState } from "react";

export const BluetoothContext = createContext();

export const BluetoothProvider = ({ children }) => {
  const [bluetoothData, setBluetoothData] = useState(null);

  return (
    <BluetoothContext.Provider value={{ bluetoothData, setBluetoothData }}>
      {children}
    </BluetoothContext.Provider>
  );
};
