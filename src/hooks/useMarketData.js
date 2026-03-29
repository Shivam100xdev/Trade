import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export const useMarketData = (limit = 20) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMarkets = useCallback(async () => {
    try {
      setError(null);
      const res = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h,7d',
        },
      });
      setCoins(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Rate limited by CoinGecko. Retrying soon...');
      } else {
        setError('Failed to fetch market data');
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [fetchMarkets]);

  return { coins, loading, error, lastUpdated, refetch: fetchMarkets };
};
