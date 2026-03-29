import React, { useState } from 'react';
import { formatPrice } from '../utils/format';
import './AlertPanel.css';

const AlertPanel = ({ alerts, addAlert, removeAlert }) => {
  const [symbol, setSymbol] = useState('BTC');
  const [target, setTarget] = useState('');
  const [direction, setDirection] = useState('above');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!target || isNaN(parseFloat(target)) || parseFloat(target) <= 0) {
      setError('Enter a valid price target');
      return;
    }
    addAlert(symbol, target, direction);
    setTarget('');
  };

  const activeAlerts = alerts.filter(a => !a.triggered);
  const triggeredAlerts = alerts.filter(a => a.triggered);

  return (
    <div className="alert-panel card">
      <div className="panel-header">
        <h3 className="panel-title">Price Alerts</h3>
        <span className="alert-count">{activeAlerts.length} active</span>
      </div>

      <form className="alert-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <select className="input select-input" value={symbol} onChange={e => setSymbol(e.target.value)}>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
            <option value="SOL">SOL</option>
          </select>
          <select className="input select-input" value={direction} onChange={e => setDirection(e.target.value)}>
            <option value="above">Above ▲</option>
            <option value="below">Below ▼</option>
          </select>
        </div>
        <div className="form-row">
          <input
            className="input"
            type="number"
            placeholder="Target price (USD)"
            value={target}
            onChange={e => setTarget(e.target.value)}
            step="0.01"
          />
          <button type="submit" className="btn btn-primary">Set</button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>

      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔔</span>
            <p>No alerts set</p>
          </div>
        ) : (
          <>
            {activeAlerts.map(alert => (
              <div key={alert.id} className="alert-item active">
                <div className="alert-info">
                  <span className="alert-symbol">{alert.symbol}</span>
                  <span className={`alert-direction ${alert.direction === 'above' ? 'text-green' : 'text-red'}`}>
                    {alert.direction === 'above' ? '▲ Above' : '▼ Below'}
                  </span>
                  <span className="alert-target font-mono">${formatPrice(alert.target)}</span>
                </div>
                <button className="alert-remove" onClick={() => removeAlert(alert.id)}>✕</button>
              </div>
            ))}
            {triggeredAlerts.length > 0 && (
              <>
                <div className="alerts-divider">Triggered</div>
                {triggeredAlerts.slice(-3).map(alert => (
                  <div key={alert.id} className="alert-item triggered">
                    <div className="alert-info">
                      <span className="alert-symbol">{alert.symbol}</span>
                      <span className="text-yellow">⚡ Hit ${formatPrice(alert.target)}</span>
                    </div>
                    <button className="alert-remove" onClick={() => removeAlert(alert.id)}>✕</button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;
