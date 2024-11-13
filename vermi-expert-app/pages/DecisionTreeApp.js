import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import RNFS from 'react-native-fs'; // For reading files

// Function to traverse the decision tree and make predictions
const predict = (tree, features) => {
  let node = tree;
  while (node.feature) {
    const featureValue = features[node.feature];
    if (featureValue <= node.threshold) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  return node.prediction; // Return the predicted class label
};

const DecisionTreeApp = () => {
  const [temperature, setTemperature] = useState('');
  const [moisture, setMoisture] = useState('');
  const [ph, setPh] = useState('');
  const [prediction, setPrediction] = useState('');

  const loadModel = async () => {
    try {
      // Read the model from the assets folder using readFileAssets
      const jsonString = await RNFS.readFileAssets('model.json'); // Adjust the file path if necessary

      const tree = JSON.parse(jsonString);

      // Input features for prediction
      const features = {
        Temperature: parseFloat(temperature),
        Moisture: parseFloat(moisture),
        pH: parseFloat(ph),
      };

      // Predict using the loaded decision tree model
      const result = predict(tree, features);
      console.log(result);
      setPrediction(result); // Assuming 0 is unhealthy, 1 is healthy
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Temperature"
        value={temperature}
        onChangeText={setTemperature}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder="Moisture"
        value={moisture}
        onChangeText={setMoisture}
        keyboardType="numeric"
        style={{ marginBottom: 10 }}
      />
      <TextInput
        placeholder="pH"
        value={ph}
        onChangeText={setPh}
        keyboardType="numeric"
        style={{ marginBottom: 20 }}
      />
      <Button title="Predict" onPress={loadModel} />

      {prediction ? (
        <Text style={{ marginTop: 20 }}>Prediction: {prediction}</Text>
      ) : null}
    </View>
  );
};

export default DecisionTreeApp;
