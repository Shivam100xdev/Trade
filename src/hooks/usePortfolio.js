import { useState, useEffect } from 'react';

const STORAGE_KEY = 'nextrade_portfolio';

const defaultPortfolio = [];

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultPortfolio;
    } catch {
      return defaultPortfolio;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const addAsset = (symbol, name, amount, buyPrice) => {
    const asset = {
      id: Date.now(),
      symbol: symbol.toLowerCase(),
      displaySymbol: symbol.toUpperCase(),
      name,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      addedAt: new Date().toISOString(),
    };
    setPortfolio(prev => [...prev, asset]);
    return asset;
  };

  const removeAsset = (id) => {
    setPortfolio(prev => prev.filter(a => a.id !== id));
  };

  const updateAsset = (id, updates) => {
    setPortfolio(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const calculatePnL = (asset, currentPrice) => {
    if (!currentPrice) return { pnl: 0, pnlPercent: 0, currentValue: 0, costBasis: 0 };
    const costBasis = asset.amount * asset.buyPrice;
    const currentValue = asset.amount * currentPrice;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return { pnl, pnlPercent, currentValue, costBasis };
  };

  const getTotalValue = (livePrices, marketPrices = {}) => {
    return portfolio.reduce((total, asset) => {
      const wsKey = `${asset.symbol}usdt`;
      const price = livePrices[wsKey] || marketPrices[asset.displaySymbol] || asset.buyPrice;
      return total + asset.amount * price;
    }, 0);
  };

  const getTotalCost = () => {
    return portfolio.reduce((total, asset) => total + asset.amount * asset.buyPrice, 0);
  };

  return {
    portfolio,
    addAsset,
    removeAsset,
    updateAsset,
    calculatePnL,
    getTotalValue,
    getTotalCost,
  };
};
