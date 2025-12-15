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

        // Using open.er-api.com - free API, no key required, more reliable
        const response = await fetch("https://open.er-api.com/v6/latest/USD", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch exchange rate`);
        }

        const data = await response.json();
        console.log("Exchange rate API response:", data);

        // Check if result is success
        if (data.result !== "success") {
          throw new Error(`API error: ${data.result}`);
        }

        // Get the MXN rate from rates object
        const mxnRate = data.rates?.MXN;

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
