import RNFS from 'react-native-fs'; 

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

const loadModel = async (temperature, moisture, ph) => {
  try {
    // Read the model from the assets folder using readFileAssets
    const jsonString = await RNFS.readFileAssets('model.json'); 

    const tree = JSON.parse(jsonString);

    // Input features for prediction
    const features = {
      Temperature: parseFloat(temperature),
      Moisture: parseFloat(moisture),
      pH: parseFloat(ph),
    };

    // Predict using the loaded decision tree model
    const result = predict(tree, features);
    console.log("result is ", typeof(result))
    return result;
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

export default loadModel;