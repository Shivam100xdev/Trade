import React from 'react';
import LivePriceTicker from '../components/LivePriceTicker';
import LiveChart from '../components/LiveChart';
import AlertPanel from '../components/AlertPanel';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatLargeNumber } from '../utils/format';
import { useBTCHistory } from '../hooks/useWebSocket';
import './Dashboard.css';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="stat-card card">
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-value font-mono" style={{ color }}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  </div>
);

const Dashboard = ({ prices, priceChanges, connected, alerts, addAlert, removeAlert, marketData }) => {
  const { user } = useAuth();
  const btcHistory = useBTCHistory(80);

  const btcPrice = prices.btcusdt;
  const ethPrice = prices.ethusdt;
  const btcCoin = marketData?.find(c => c.symbol === 'btc');
  const ethCoin = marketData?.find(c => c.symbol === 'eth');
  const totalMarketCap = marketData?.reduce((s, c) => s + (c.market_cap || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"></h1>
          <p className="page-subtitle">
            Welcome back, <span className="highlight">{user?.name || 'Trader'}</span>
          </p>
        </div>
        <div className="header-right">
          <div className={`ws-badge ${connected ? 'connected' : 'disconnected'}`}>
            <span className={connected ? 'live-dot' : ''}></span>
            {connected ? 'WebSocket Live' : 'Reconnecting...'}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Bitcoin (BTC)"
          value={btcPrice ? `$${formatPrice(btcPrice)}` : '—'}
          sub={btcCoin ? `MCap: ${formatLargeNumber(btcCoin.market_cap)}` : 'Loading...'}
          color="var(--accent-cyan)"
          icon="₿"
        />
        <StatCard
          label="Ethereum (ETH)"
          value={ethPrice ? `$${formatPrice(ethPrice)}` : '—'}
          sub={ethCoin ? `MCap: ${formatLargeNumber(ethCoin.market_cap)}` : 'Loading...'}
          color="#627eea"
          icon="Ξ"
        />
        <StatCard
          label="Total Market Cap"
          value={totalMarketCap ? formatLargeNumber(totalMarketCap) : '—'}
          sub="Top 20 coins"
          color="var(--accent-yellow)"
          icon="◈"
        />
        <StatCard
          label="Active Alerts"
          value={alerts.filter(a => !a.triggered).length}
          sub={`${alerts.filter(a => a.triggered).length} triggered`}
          color="var(--accent-green)"
          icon="🔔"
        />
      </div>

      <div className="ticker-section">
        <LivePriceTicker
          prices={prices}
          priceChanges={priceChanges}
          marketData={marketData}
        />
      </div>

      <div className="main-grid">
        <div className="chart-col">
          <LiveChart history={btcHistory} />
        </div>
        <div className="alert-col">
          <AlertPanel
            alerts={alerts}
            addAlert={addAlert}
            removeAlert={removeAlert}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
