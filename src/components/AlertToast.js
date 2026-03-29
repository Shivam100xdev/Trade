import React from 'react';
import { formatPrice } from '../utils/format';

const AlertToast = ({ triggered, clearTriggered }) => {
  if (!triggered || triggered.length === 0) return null;

  return (
    <div className="alert-toast">
      {triggered.map(alert => (
        <div key={alert.id} className="toast">
          <span className="toast-icon">⚡</span>
          <div>
            <div className="toast-title">Price Alert Triggered!</div>
            <div className="toast-body">
              {alert.symbol} {alert.direction === 'above' ? 'rose above' : 'dropped below'} ${formatPrice(alert.target)}
              {alert.triggeredPrice && ` → Now $${formatPrice(alert.triggeredPrice)}`}
            </div>
          </div>
          <button
            onClick={() => clearTriggered(alert.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: 'auto', fontSize: '16px', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertToast;
