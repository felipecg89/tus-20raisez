import { useState, useEffect } from "react";

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<number>(17);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        setLoading(true);
        // Using exchangerate.host - completely free, no API key required
        const response = await fetch(
          "https://api.exchangerate.host/latest?base=USD&symbols=MXN",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch exchange rate`);
        }

        const data = await response.json();
        console.log("Exchange rate API response:", data);

        // Check if success flag is true (exchangerate.host includes this)
        if (data.success === false) {
          throw new Error("API returned success: false");
        }

        // Try to get the MXN rate from the response
        const mxnRate = data.rates?.MXN || data.MXN;

        if (!mxnRate || typeof mxnRate !== 'number') {
          throw new Error(`Invalid MXN rate in response: ${mxnRate}`);
        }

        setExchangeRate(Math.round(mxnRate * 100) / 100);
        setLastUpdated(new Date().toLocaleDateString());
        setError(null);
      } catch (err) {
        console.error("Exchange rate fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        // Keep fallback rate of 17 if API fails
        setExchangeRate(17);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();

    // Set up interval to refresh daily (every 24 hours)
    const interval = setInterval(fetchExchangeRate, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { exchangeRate, loading, error, lastUpdated };
};
