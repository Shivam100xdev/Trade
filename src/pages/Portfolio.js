import React, { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatPrice, formatPnL, getChangeClass, POPULAR_COINS } from '../utils/format';
import './Portfolio.css';

const Portfolio = ({ prices, marketData }) => {
  const { portfolio, addAsset, removeAsset, calculatePnL, getTotalValue, getTotalCost } = usePortfolio();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: 'BTC', name: 'Bitcoin', amount: '', buyPrice: '' });
  const [formError, setFormError] = useState('');

  const getLivePrice = (asset) => {
    const wsKey = `${asset.symbol}usdt`;
    if (prices[wsKey]) return prices[wsKey];
    const mCoin = marketData?.find(c =>
      c.symbol.toLowerCase() === asset.symbol.toLowerCase() ||
      c.name.toLowerCase() === asset.name.toLowerCase()
    );
    return mCoin?.current_price || asset.buyPrice;
  };

  const getMarketPrices = () => {
    const mp = {};
    marketData?.forEach(c => { mp[c.symbol.toUpperCase()] = c.current_price; });
    return mp;
  };

  const totalValue = getTotalValue(prices, getMarketPrices());
  const totalCost = getTotalCost();
  const totalPnL = totalValue - totalCost;
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  const handleCoinChange = (e) => {
    const coin = POPULAR_COINS.find(c => c.symbol === e.target.value);
    setForm(f => ({ ...f, symbol: coin.symbol, name: coin.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setFormError('Enter a valid amount'); return;
    }
    if (!form.buyPrice || isNaN(parseFloat(form.buyPrice)) || parseFloat(form.buyPrice) <= 0) {
      setFormError('Enter a valid buy price'); return;
    }
    addAsset(form.symbol, form.name, form.amount, form.buyPrice);
    setForm({ symbol: 'BTC', name: 'Bitcoin', amount: '', buyPrice: '' });
    setShowForm(false);
  };

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Portfolio</h1>
          <p className="page-subtitle">Track your crypto holdings with live P&L</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ Add Asset'}
        </button>
      </div>

      {showForm && (
        <div className="add-asset-card card animate-slide-up">
          <h3 className="form-title">Add New Asset</h3>
          <form onSubmit={handleSubmit} className="asset-form">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Coin</label>
                <select className="input" value={form.symbol} onChange={handleCoinChange}>
                  {POPULAR_COINS.map(c => (
                    <option key={c.symbol} value={c.symbol}>{c.symbol} — {c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount Held</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 0.5"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  step="any"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Buy Price (USD)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="e.g. 45000"
                  value={form.buyPrice}
                  onChange={e => setForm(f => ({ ...f, buyPrice: e.target.value }))}
                  step="any"
                  min="0"
                />
              </div>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Add to Portfolio</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="portfolio-summary">
        <div className="summary-card card">
          <div className="summary-label">Total Value</div>
          <div className="summary-value font-mono">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className="summary-card card">
          <div className="summary-label">Total Cost Basis</div>
          <div className="summary-value font-mono">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div className={`summary-card card ${totalPnL >= 0 ? 'pnl-positive' : 'pnl-negative'}`}>
          <div className="summary-label">Total P&L</div>
          <div className={`summary-value font-mono ${totalPnL >= 0 ? 'text-green' : 'text-red'}`}>
            {formatPnL(totalPnL)}
          </div>
          <div className={`summary-pct font-mono ${totalPnL >= 0 ? 'text-green' : 'text-red'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnLPct.toFixed(2)}%
          </div>
        </div>
        <div className="summary-card card">
          <div className="summary-label">Holdings</div>
          <div className="summary-value font-mono">{portfolio.length}</div>
          <div className="summary-pct" style={{ color: 'var(--text-muted)' }}>assets</div>
        </div>
      </div>

      {portfolio.length === 0 ? (
        <div className="empty-portfolio card">
          <div className="empty-emoji">📊</div>
          <h3>No assets yet</h3>
          <p>Add your first crypto holding to start tracking P&L</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Asset</button>
        </div>
      ) : (
        <div className="holdings-table-wrapper card">
          <table className="holdings-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="right">Amount</th>
                <th className="right">Buy Price</th>
                <th className="right">Current Price</th>
                <th className="right">Current Value</th>
                <th className="right">P&L</th>
                <th className="right">P&L %</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((asset) => {
                const livePrice = getLivePrice(asset);
                const { pnl, pnlPercent, currentValue } = calculatePnL(asset, livePrice);
                return (
                  <tr key={asset.id}>
                    <td>
                      <div className="asset-cell">
                        <div className="asset-symbol-badge">{asset.displaySymbol.slice(0, 3)}</div>
                        <div>
                          <div className="asset-sym">{asset.displaySymbol}</div>
                          <div className="asset-name-small">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right font-mono">{asset.amount}</td>
                    <td className="right font-mono text-muted">${formatPrice(asset.buyPrice)}</td>
                    <td className="right font-mono">${formatPrice(livePrice)}</td>
                    <td className="right font-mono">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className={`right font-mono ${getChangeClass(pnl)}`}>{formatPnL(pnl)}</td>
                    <td className={`right font-mono ${getChangeClass(pnlPercent)}`}>
                      {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </td>
                    <td className="right">
                      <button className="remove-btn" onClick={() => removeAsset(asset.id)} title="Remove">✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
