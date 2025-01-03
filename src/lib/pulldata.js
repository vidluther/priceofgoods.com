// src/lib/usePriceData.js (or .jsx)
import { useState, useEffect } from "react";

export function pullData() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://data.priceofgoods.com/latest.json",
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPriceData(data);
      } catch (error) {
        console.error("Failed to fetch prices:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { priceData, loading, error };
}
