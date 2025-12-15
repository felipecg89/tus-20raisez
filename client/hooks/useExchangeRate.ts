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
          "https://api.exchangerate.host/latest?base=USD&symbols=MXN"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exchange rate");
        }

        const data = await response.json();

        if (data.rates && data.rates.MXN) {
          setExchangeRate(Math.round(data.rates.MXN * 100) / 100);
          setLastUpdated(new Date().toLocaleDateString());
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
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
