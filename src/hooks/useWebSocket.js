import { useState, useEffect, useRef, useCallback } from 'react';

const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

export const useWebSocket = (symbols = ['btcusdt', 'ethusdt']) => {
  const [prices, setPrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const prevPricesRef = useRef({});
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    try {
      const streamNames = symbols.map(s => `${s}@trade`).join('/');
      const url = `${BINANCE_WS_BASE}/${streamNames}`;
      
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const symbol = data.s?.toLowerCase();
          const price = parseFloat(data.p);

          if (symbol && !isNaN(price)) {
            setPrices(prev => {
              const prevPrice = prevPricesRef.current[symbol];
              let direction = 'neutral';
              if (prevPrice !== undefined) {
                direction = price > prevPrice ? 'up' : price < prevPrice ? 'down' : 'neutral';
              }
              prevPricesRef.current[symbol] = price;

              setPriceChanges(c => ({ ...c, [symbol]: direction }));
              setTimeout(() => setPriceChanges(c => ({ ...c, [symbol]: 'neutral' })), 600);

              return { ...prev, [symbol]: price };
            });
          }
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {}
  }, [symbols]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  return { prices, priceChanges, connected };
};

export const useBTCHistory = (maxPoints = 60) => {
  const [history, setHistory] = useState([]);
  const { prices } = useWebSocket(['btcusdt']);

  useEffect(() => {
    if (prices.btcusdt) {
      setHistory(prev => {
        const now = new Date();
        const label = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
        const updated = [...prev, { price: prices.btcusdt, label, time: now.getTime() }];
        return updated.slice(-maxPoints);
      });
    }
  }, [prices.btcusdt, maxPoints]);

  return history;
};
