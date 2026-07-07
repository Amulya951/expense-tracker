import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AllTransactions from './components/AllTransactions';
import Auth from './components/Auth';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import './index.css';

function AppContent() {
  const { user, loading } = useExpenses();
  const [view, setView] = useState('home');

  if (loading) {
    return <div className="text-center text-secondary" style={{ marginTop: '40px' }}>Loading...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <FaUserCircle size={40} color="var(--text-secondary)" />
          )}
          <div>
            <h3 className="shine-text" style={{ margin: 0, fontSize: '1.2rem' }}>Hi, {user.displayName || 'User'}</h3>
          </div>
        </div>
        <button 
          onClick={() => signOut(auth)}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}
          title="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>

      {view === 'home' ? (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <Dashboard />
          <ExpenseForm />
          <ExpenseList onViewAll={() => setView('transactions')} />
        </div>
      ) : (
        <AllTransactions onBack={() => setView('home')} />
      )}
    </div>
  );
}

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
