import React, { useState } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import { formatPrice, formatLargeNumber, formatChange, getChangeClass } from '../utils/format';
import './Market.css';

const SortIcon = ({ field, current, dir }) => {
  if (current !== field) return <span className="sort-icon muted">↕</span>;
  return <span className="sort-icon active">{dir === 'asc' ? '↑' : '↓'}</span>;
};

const Market = () => {
  const { coins, loading, error, lastUpdated, refetch } = useMarketData(25);
  const [sortField, setSortField] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = coins
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortField] ?? 0;
      const vb = b[sortField] ?? 0;
      return sortDir === 'asc' ? va - vb : vb - va;
    });

  return (
    <div className="market-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Market</h1>
          <p className="page-subtitle">
            Top cryptocurrencies by market cap
            {lastUpdated && (
              <span className="last-updated"> · Updated {lastUpdated.toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <div className="market-actions">
          <input
            className="input search-input"
            placeholder="Search coins..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-ghost" onClick={refetch} title="Refresh">
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠</span> {error}
        </div>
      )}

      {loading ? (
        <div className="market-skeleton">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="skeleton-row" style={{ animationDelay: `${i * 0.05}s` }}></div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper card">
          <table className="market-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('market_cap_rank')} className="sortable">
                  # <SortIcon field="market_cap_rank" current={sortField} dir={sortDir} />
                </th>
                <th>Coin</th>
                <th onClick={() => handleSort('current_price')} className="sortable right">
                  Price <SortIcon field="current_price" current={sortField} dir={sortDir} />
                </th>
                <th onClick={() => handleSort('price_change_percentage_24h')} className="sortable right hide-mobile">
                  24h % <SortIcon field="price_change_percentage_24h" current={sortField} dir={sortDir} />
                </th>
                <th onClick={() => handleSort('price_change_percentage_7d_in_currency')} className="sortable right hide-mobile">
                  7d % <SortIcon field="price_change_percentage_7d_in_currency" current={sortField} dir={sortDir} />
                </th>
                <th onClick={() => handleSort('market_cap')} className="sortable right hide-mobile">
                  Market Cap <SortIcon field="market_cap" current={sortField} dir={sortDir} />
                </th>
                <th onClick={() => handleSort('total_volume')} className="sortable right hide-sm">
                  Volume 24h <SortIcon field="total_volume" current={sortField} dir={sortDir} />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((coin, idx) => {
                const change24 = coin.price_change_percentage_24h;
                const change7d = coin.price_change_percentage_7d_in_currency;
                return (
                  <tr key={coin.id} style={{ animationDelay: `${idx * 0.02}s` }}>
                    <td className="rank-col">
                      <span className="rank">{coin.market_cap_rank}</span>
                    </td>
                    <td className="coin-col">
                      <div className="coin-row">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="coin-img"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div className="coin-info">
                          <span className="coin-name">{coin.name}</span>
                          <span className="coin-sym">{coin.symbol.toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="right price-col font-mono">
                      ${formatPrice(coin.current_price)}
                    </td>
                    <td className={`right font-mono hide-mobile ${getChangeClass(change24)}`}>
                      {formatChange(change24)}
                    </td>
                    <td className={`right font-mono hide-mobile ${getChangeClass(change7d)}`}>
                      {formatChange(change7d)}
                    </td>
                    <td className="right font-mono hide-mobile text-secondary">
                      {formatLargeNumber(coin.market_cap)}
                    </td>
                    <td className="right font-mono hide-sm text-secondary">
                      {formatLargeNumber(coin.total_volume)}
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

export default Market;
