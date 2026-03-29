export const formatPrice = (price, decimals = 2) => {
  if (price === undefined || price === null || isNaN(price)) return '—';
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(decimals);
  return price.toFixed(6);
};

export const formatLargeNumber = (num) => {
  if (!num) return '—';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};

export const formatChange = (change) => {
  if (change === undefined || change === null) return '—';
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};

export const formatPnL = (pnl) => {
  if (isNaN(pnl)) return '$0.00';
  const sign = pnl >= 0 ? '+' : '';
  return `${sign}$${Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getChangeClass = (value) => {
  if (!value || value === 0) return '';
  return value > 0 ? 'text-green' : 'text-red';
};

export const POPULAR_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin' },
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum' },
  { symbol: 'BNB', name: 'BNB', id: 'binancecoin' },
  { symbol: 'SOL', name: 'Solana', id: 'solana' },
  { symbol: 'ADA', name: 'Cardano', id: 'cardano' },
  { symbol: 'DOT', name: 'Polkadot', id: 'polkadot' },
  { symbol: 'AVAX', name: 'Avalanche', id: 'avalanche-2' },
  { symbol: 'MATIC', name: 'Polygon', id: 'matic-network' },
  { symbol: 'LINK', name: 'Chainlink', id: 'chainlink' },
  { symbol: 'LTC', name: 'Litecoin', id: 'litecoin' },
];
