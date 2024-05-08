import * as tf from "@tensorflow/tfjs-node";

import type { NextApiRequest, NextApiResponse } from "next";

let model: tf.LayersModel | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  console.log("before post");
  if (req.method === "POST") {
    const tf = await import("@tensorflow/tfjs-node");
    const loadModel = async () => {
      model = await tf.loadLayersModel("file://public/model.json");
    };

    loadModel();

    try {
      const inputData = req.body.data.map(Number);
      const result = await classify(inputData);
      res.status(200).json({ result });
    } catch (error) {
      console.log("error: ", error);
      res.status(500).json({ error: "failed to classify" });
    }
  } else {
    res.status(405).end();
  }
}

const classify = async (inputData: number[]): Promise<number[]> => {
  const inputTensor = tf.tensor3d(
    [inputData.map((value) => [value])],
    [1, inputData.length, 1]
  );

  if (!model) {
    throw new Error("Model not loaded");
  }

  const predictions = model.predict(inputTensor) as tf.Tensor;
  const result = predictions.argMax(-1).dataSync();

  return Array.from(result);
};
