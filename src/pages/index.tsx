"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showMetrics, setShowMetrics] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };
  const handleAnalyzeClick = async () => {
    if (!file) return;

    try {
      const csvData = await file.text();
      const rows = csvData.split("\n").slice(1); // Exclude header row
      const randomRow = rows[0] // make it 0
        .split(",")
        .slice(0, -1)
        .map(Number);

      const response = await axios.post("/api/classify", {
        data: randomRow,
      });
      setAnalysisResult(getResult(response.data.result[0]));
    } catch (error) {
      setAnalysisResult("Invalid file");
    }
  };

  const getResult = (index: number) => {
    switch (index) {
      case 0:
        return "Normal (N)";
      case 1:
        return "R-on-T Premature Ventricular Contraction (R-on-T PVC)";
      case 2:
        return "Premature Ventricular Contraction (PVC)";
      case 3:
        return "Supra-ventricular Premature or Ectopic Beat (SP or EB)";
      case 4:
        return "Unclassified Beat (UB)";
      default:
        return "unknown";
    }
  };

  const resetForm = () => {
    setFile(null);
    setAnalysisResult("");
  };

  return (
    <>
      <Head>
        <title>Healthy Heart</title>
        <meta name="description" content="Healt Test" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.container}>
          <h1 className={styles.title}>ECG Analysis</h1>
          <input
            type="file"
            key={Number(file)}
            accept=".csv"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          <button
            className={styles.toggleButton}
            onClick={() => setShowMetrics(!showMetrics)}
          >
            {showMetrics ? "Hide Metrics" : "Show Metrics"}
          </button>
          {showMetrics && (
            <div className={styles.metrics}>
              <h3>Metrics</h3>
              <p>Precision: 0.9261</p>
              <p>Recall: 0.941</p>
              <p>Accuracy: 0.941</p>
              <p>F1 Score: 0.9304</p>
              <p>Balanced Accuracy: 0.5006</p>
            </div>
          )}
          {(!file || (!!file && !analysisResult)) && (
            <button
              className={styles.button}
              onClick={handleAnalyzeClick}
              disabled={!file}
            >
              Upload and Analyze
            </button>
          )}
          {!!file && !!analysisResult && (
            <button className={styles.button} onClick={resetForm}>
              Reset
            </button>
          )}
          {analysisResult && (
            <div className={styles.result}>
              <h2>ECG Result:</h2>
              <pre>{analysisResult}</pre>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
