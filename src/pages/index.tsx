"use client";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);

  const handleAnalyzeClick = async () => {
    try {
      const csvData = await fetch("/ECG5000_TRAIN.csv").then((response) =>
        response.text()
      );
      const rows = csvData.split("\n").slice(1); // Exclude header row
      const randomRowIndex = Math.floor(Math.random() * rows.length); // make
      const randomRow = rows[randomRowIndex] // make it 0
        .split(",")
        .slice(0, -1)
        .map(Number);

      const response = await axios.post("/api/classify", {
        data: randomRow,
      });
      setSelectedRow(randomRow);
      setAnalysisResult(response.data.result[0]);
    } catch (error) {
      console.error("Error analyzing data:", error);
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
        <div className={styles.grid}>
          <button onClick={handleAnalyzeClick}>
            {!selectedRow ? "Click to process" : "processing...."}
          </button>
        </div>
        {selectedRow && (
          <div>
            <h2>Selected Row:</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  {selectedRow.map((_, index) => (
                    <th key={index}>Column {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {selectedRow.map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {analysisResult && (
          <div>
            <h2>Analysis Result:</h2>
            <pre>{JSON.stringify(analysisResult)}</pre>
          </div>
        )}
      </main>
    </>
  );
}
