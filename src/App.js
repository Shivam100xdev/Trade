
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useWebSocket } from './hooks/useWebSocket';
import { useAlerts } from './hooks/useAlerts';
import { useMarketData } from './hooks/useMarketData';
import Navbar from './components/Navbar';
import AlertToast from './components/AlertToast';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Wrapper that provides WS data + routing
const AppInner = () => {
  const { user, loading } = useAuth();
  const { prices, priceChanges, connected } = useWebSocket(['btcusdt', 'ethusdt']);
  const { alerts, addAlert, removeAlert, triggered, clearTriggered } = useAlerts(prices);
  const { coins: marketData } = useMarketData(25);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '2px solid var(--border)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthPage && user && <Navbar connected={connected} />}
      <AlertToast triggered={triggered} clearTriggered={clearTriggered} />

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard
                prices={prices}
                priceChanges={priceChanges}
                connected={connected}
                alerts={alerts}
                addAlert={addAlert}
                removeAlert={removeAlert}
                marketData={marketData}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/market"
          element={user ? <Market /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/portfolio"
          element={
            user ? (
              <Portfolio prices={prices} marketData={marketData} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
