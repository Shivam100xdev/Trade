import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'nextrade_alerts';

export const useAlerts = (prices) => {
  const [alerts, setAlerts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  });
  const [triggered, setTriggered] = useState([]);
  const prevPricesRef = useRef({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if (!prices || Object.keys(prices).length === 0) return;

    const newlyTriggered = [];

    alerts.forEach(alert => {
      if (alert.triggered) return;

      const key = `${alert.symbol.toLowerCase()}usdt`;
      const currentPrice = prices[key];
      const prevPrice = prevPricesRef.current[key];

      if (!currentPrice || !prevPrice) return;

      const crossed =
        (alert.direction === 'above' && prevPrice < alert.target && currentPrice >= alert.target) ||
        (alert.direction === 'below' && prevPrice > alert.target && currentPrice <= alert.target);

      if (crossed) {
        newlyTriggered.push({ ...alert, triggeredAt: new Date().toISOString(), triggeredPrice: currentPrice });
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, triggered: true } : a));
      }
    });

    if (newlyTriggered.length > 0) {
      setTriggered(prev => [...prev, ...newlyTriggered]);
      setTimeout(() => {
        setTriggered(prev => prev.filter(t => !newlyTriggered.find(n => n.id === t.id)));
      }, 8000);
    }

    Object.assign(prevPricesRef.current, prices);
  }, [prices, alerts]);

  const addAlert = (symbol, target, direction) => {
    const alert = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      target: parseFloat(target),
      direction,
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    setAlerts(prev => [...prev, alert]);
    return alert;
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const clearTriggered = (id) => {
    setTriggered(prev => prev.filter(t => t.id !== id));
  };

  return { alerts, addAlert, removeAlert, triggered, clearTriggered };
};
