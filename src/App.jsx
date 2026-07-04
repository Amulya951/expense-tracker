import { useState } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AllTransactions from './components/AllTransactions';
import { ExpenseProvider } from './context/ExpenseContext';
import './index.css';

function App() {
  const [view, setView] = useState('home'); // 'home' | 'transactions'

  return (
    <ExpenseProvider>
      {view === 'home' ? (
        <div className="animate-slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <h1 className="text-center" style={{ marginBottom: '0' }}>My Expenses</h1>
          <Dashboard />
          <ExpenseForm />
          <ExpenseList onViewAll={() => setView('transactions')} />
        </div>
      ) : (
        <AllTransactions onBack={() => setView('home')} />
      )}
    </ExpenseProvider>
  );
}

export default App;
