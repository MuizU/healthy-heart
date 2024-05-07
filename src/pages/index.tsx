"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useState } from "react";
import axios from "axios";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState("");
  const [selectedRow, setSelectedRow] = useState<number[] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const headersList = headers();

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
      setSelectedRow(randomRow);
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
            accept=".csv"
            onChange={handleFileUpload}
            className={styles.fileInput}
          />
          <button
            className={styles.button}
            onClick={handleAnalyzeClick}
            disabled={!file}
          >
            {!selectedRow ? "Upload and Analyze" : "Upload another report"}
          </button>

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
