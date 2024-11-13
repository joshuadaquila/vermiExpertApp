import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, FlatList } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'; // Import Buffer from the 'buffer' package

const BluetoothTest = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [deviceId, setDeviceId] = useState(null);
    const [devices, setDevices] = useState([]);
    const [manager, setManager] = useState(null);
    const [receivedData, setReceivedData] = useState('');

    useEffect(() => {
        const bleManager = new BleManager();
        setManager(bleManager);

        // Request permissions on Android
        if (Platform.OS === 'android') {
            requestPermissions();
        }

        // Start scanning for devices
        startScan(bleManager);

        // Cleanup on unmount
        return () => {
            bleManager.stopDeviceScan();
            bleManager.destroy();
        };
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);
            if (
                granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                console.log('Bluetooth scan and connect permissions granted');
            } else {
                console.log('Bluetooth permissions not granted');
            }
        }
    };

    const startScan = (bleManager) => {
        bleManager.startDeviceScan([], { allowDuplicates: false }, (error, device) => {
            if (error) {
                console.log('Error scanning devices', error);
                return;
            }

            // Check if the device is already in the list
            setDevices(prevDevices => {
                if (!prevDevices.some(dev => dev.id === device.id)) {
                    return [...prevDevices, device];
                }
                return prevDevices;
            });
        });

        // Stop scanning after a few seconds
        setTimeout(() => {
            bleManager.stopDeviceScan();
            console.log('Scan stopped');
        }, 5000); // Stop after 5 seconds (or adjust as needed)
    };

    const connectToDevice = (deviceId) => {
        if (manager) {
            manager.connectToDevice(deviceId)
                .then((device) => {
                    setIsConnected(true);
                    setDeviceId(device.id);
                    console.log('Connected to device:', device.id);

                    // Discover services and characteristics
                    return device.discoverAllServicesAndCharacteristics();
                })
                .then((device) => {
                    // Start listening to notifications from the device (replace with your characteristic UUID)
                    const characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; // Replace with your characteristic UUID
                    device.monitorCharacteristicForService('0000ffe0-0000-1000-8000-00805f9b34fb', characteristicUUID, (error, characteristic) => {
                        if (error) {
                            console.log('Error reading characteristic:', error);
                            return;
                        }

                        // Decode the received base64 data
                        const data = characteristic.value
                            ? Buffer.from(characteristic.value, 'base64').toString('utf-8')  // Decoding base64 to UTF-8 string
                            : '';

                        setReceivedData(data);
                    });
                })
                .catch((error) => {
                    console.log('Connection error', error);
                });
        }
    };

    const disconnectFromDevice = () => {
        if (manager && deviceId) {
            manager.disconnectFromDevice(deviceId)
                .then(() => {
                    setIsConnected(false);
                    setDeviceId(null);
                    setReceivedData(''); // Clear the received data on disconnect
                    console.log('Disconnected from device');
                })
                .catch((error) => {
                    console.log('Disconnection error', error);
                });
        }
    };

    return (
        <View>
            <Text>{isConnected ? 'Connected to ' + deviceId : 'Not connected'}</Text>
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text>{item.name || item.id}</Text>
                        <Button title={`Connect to ${item.name || item.id}`} onPress={() => connectToDevice(item.id)} />
                    </View>
                )}
            />
            <Button title="Disconnect" onPress={disconnectFromDevice} disabled={!isConnected} />
            
            {/* Display the received data */}
            {receivedData ? (
                <View style={{ marginTop: 20 }}>
                    <Text>Data from Device:</Text>
                    <Text>{receivedData}</Text>
                </View>
            ) : null}
        </View>
    );
};

export default BluetoothTest;
