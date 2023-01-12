import * as tf from '@tensorflow/tfjs';

export const serializeModel = async (model) => {
  const result = await model.save(tf.io.withSaveHandler(modelArtifacts => modelArtifacts));
  result.weightData = Array.from(new Uint8Array(result.weightData));
  return JSON.stringify(result);
};

export const deserializeModel = async (modelJSON) => {
  const json = JSON.parse(modelJSON);
  const weightData = new Uint8Array(json.weightData).buffer;
  const model = await tf.loadLayersModel(tf.io.fromMemory(json.modelTopology, json.weightSpecs, weightData));
  return model;
};