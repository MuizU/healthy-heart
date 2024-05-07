import * as tf from "@tensorflow/tfjs";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

let model: tf.LayersModel | null = null;

const loadModel = async () => {
  model = await tf.loadLayersModel("file://public/model.json");
};

loadModel();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
