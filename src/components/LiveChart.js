import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatPrice } from '../utils/format';
import './LiveChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const LiveChart = ({ history }) => {
  const latestPrice = history.length > 0 ? history[history.length - 1].price : null;
  const firstPrice = history.length > 0 ? history[0].price : null;
  const priceChange = latestPrice && firstPrice ? latestPrice - firstPrice : 0;
  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? '#00ff88' : '#ff3d6b';

  const chartData = useMemo(() => ({
    labels: history.map(h => h.label),
    datasets: [
      {
        label: 'BTC/USDT',
        data: history.map(h => h.price),
        borderColor: lineColor,
        borderWidth: 2,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, isPositive ? 'rgba(0,255,136,0.15)' : 'rgba(255,61,107,0.15)');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  }), [history, lineColor, isPositive]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,20,36,0.95)',
        borderColor: 'rgba(30,45,74,0.8)',
        borderWidth: 1,
        titleColor: '#6b7db3',
        bodyColor: '#e8f0fe',
        bodyFont: { family: "'Space Mono', monospace", size: 13 },
        titleFont: { family: "'Space Mono', monospace", size: 11 },
        padding: 12,
        callbacks: {
          label: (ctx) => `$${formatPrice(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(30,45,74,0.4)', drawBorder: false },
        ticks: {
          color: '#3d4f73',
          font: { family: "'Space Mono', monospace", size: 10 },
          maxTicksLimit: 8,
          maxRotation: 0,
        },
        border: { display: false },
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(30,45,74,0.4)', drawBorder: false },
        ticks: {
          color: '#6b7db3',
          font: { family: "'Space Mono', monospace", size: 10 },
          callback: (val) => `$${formatPrice(val)}`,
        },
        border: { display: false },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  }), []);

  return (
    <div className="live-chart-card card">
      <div className="chart-header">
        <div className="chart-title-group">
          <h3 className="chart-title">BTC / USDT</h3>
          <span className="chart-subtitle">Real-time price</span>
        </div>
        <div className="chart-price-group">
          {latestPrice && (
            <>
              <span className="chart-current-price">${formatPrice(latestPrice)}</span>
              <span className={`chart-price-change ${isPositive ? 'text-green' : 'text-red'}`}>
                {isPositive ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)}
              </span>
            </>
          )}
        </div>
        <div className="chart-live-badge">
          <span className="live-dot"></span>
          <span>LIVE</span>
        </div>
      </div>

      {history.length < 2 ? (
        <div className="chart-loading">
          <div className="chart-loading-bars">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 60}%` }}></div>
            ))}
          </div>
          <p>Collecting live data...</p>
        </div>
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default LiveChart;
