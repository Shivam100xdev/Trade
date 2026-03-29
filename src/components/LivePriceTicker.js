import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/format';
import './LivePriceTicker.css';

const CoinIcon = ({ symbol }) => {
  const icons = {
    BTC: { color: '#f7931a', letter: '₿' },
    ETH: { color: '#627eea', letter: 'Ξ' },
  };
  const icon = icons[symbol] || { color: '#00d4ff', letter: symbol[0] };
  return (
    <div className="coin-icon" style={{ background: `${icon.color}20`, color: icon.color, border: `1px solid ${icon.color}40` }}>
      {icon.letter}
    </div>
  );
};

const LivePriceCard = ({ symbol, name, price, change, priceDirection }) => {
  const [flash, setFlash] = useState('');

  useEffect(() => {
    if (priceDirection && priceDirection !== 'neutral') {
      setFlash(priceDirection);
      const t = setTimeout(() => setFlash(''), 600);
      return () => clearTimeout(t);
    }
  }, [price, priceDirection]);

  const isPositive = change >= 0;

  return (
    <div className={`live-price-card ${flash}`}>
      <div className="lpc-header">
        <CoinIcon symbol={symbol} />
        <div className="lpc-names">
          <span className="lpc-symbol">{symbol}</span>
          <span className="lpc-name">{name}</span>
        </div>
        <div className={`lpc-badge ${isPositive ? 'badge-green' : 'badge-red'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(change || 0).toFixed(2)}%
        </div>
      </div>
      <div className={`lpc-price ${flash === 'up' ? 'price-flash-up' : flash === 'down' ? 'price-flash-down' : ''}`}>
        ${formatPrice(price)}
      </div>
      <div className="lpc-footer">
        <span className="live-dot"></span>
        <span className="lpc-live-text">Live WebSocket</span>
      </div>
    </div>
  );
};

const LivePriceTicker = ({ prices, priceChanges, marketData }) => {
  const getBtcChange = () => {
    const coin = marketData?.find(c => c.symbol === 'btc');
    return coin?.price_change_percentage_24h || 0;
  };
  const getEthChange = () => {
    const coin = marketData?.find(c => c.symbol === 'eth');
    return coin?.price_change_percentage_24h || 0;
  };

  return (
    <div className="live-ticker-grid">
      <LivePriceCard
        symbol="BTC"
        name="Bitcoin"
        price={prices.btcusdt}
        change={getBtcChange()}
        priceDirection={priceChanges.btcusdt}
      />
      <LivePriceCard
        symbol="ETH"
        name="Ethereum"
        price={prices.ethusdt}
        change={getEthChange()}
        priceDirection={priceChanges.ethusdt}
      />
    </div>
  );
};

export default LivePriceTicker;
