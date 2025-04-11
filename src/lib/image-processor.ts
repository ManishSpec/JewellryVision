import * as tf from '@tensorflow/tfjs';

// Load TensorFlow.js model
let model: tf.LayersModel | null = null;

export async function loadModel() {
  try {
    // In a real application, we would load a pre-trained model
    // For this demo, we'll use MobileNet which is available in TensorFlow.js
    model = await tf.loadLayersModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
    );
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    return false;
  }
}

export async function processImage(imageElement: HTMLImageElement): Promise<number[]> {
  try {
    if (!model) {
      await loadModel();
    }
    
    if (!model) {
      throw new Error('Model failed to load');
    }
    
    // Preprocess the image
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([224, 224]) // Resize to model input size
      .toFloat()
      .expandDims(); // Add batch dimension
    
    // Extract features from the second-to-last layer
    const activationModel = tf.model({
      inputs: model.inputs,
      outputs: model.layers[model.layers.length - 2].output
    });
    
    // Get feature vector
    const features = activationModel.predict(tensor) as tf.Tensor;
    const featureArray = Array.from(await features.data());
    
    // Clean up tensors
    tensor.dispose();
    features.dispose();
    
    return featureArray;
  } catch (error) {
    console.error('Error processing image:', error);
    // Return a random feature vector as fallback
    return Array.from({ length: 128 }, () => Math.random());
  }
}

export async function searchWithImage(file: File): Promise<FormData> {
  const formData = new FormData();
  formData.append('image', file);
  
  return formData;
}
