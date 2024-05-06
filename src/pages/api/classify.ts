import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

let model: tf.LayersModel | null = null;

const loadModel = async () => {
  model = await tf.loadLayersModel("@public/model.json");
};

loadModel();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const inputData = req.body.data;
      const result = await classify(inputData);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: "failed to classify" });
    }
  } else {
    res.status(405).end();
  }
}

const classify = async (inputData: number[][]): Promise<number[][]> => {
  const inputTensor = tf.tensor(inputData);
  if (!model) {
    throw new Error("Model not loaded");
  }

  const predictions = model.predict(inputTensor) as tf.Tensor;

  const result = (await predictions.array()) as number[][];

  return result;
};
