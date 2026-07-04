import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FaMoneyBillWave, FaUtensils, FaPlane, FaBook, FaEllipsisH } from 'react-icons/fa';

export default function Dashboard() {
  const { totalExpenses, monthlyBudget, setMonthlyBudget } = useExpenses();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  const remaining = monthlyBudget - totalExpenses;
  const progress = Math.min((totalExpenses / monthlyBudget) * 100, 100);
  const isOverBudget = remaining < 0;

  const handleSaveBudget = () => {
    setMonthlyBudget(tempBudget);
    setIsEditingBudget(false);
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-2">
        <h2 style={{ margin: 0 }}>Budget Overview</h2>
        {isEditingBudget ? (
          <div className="flex gap-2">
            <input 
              type="number" 
              value={tempBudget}
              onChange={(e) => setTempBudget(Number(e.target.value))}
              style={{ width: '100px', marginBottom: 0, padding: '4px 8px' }}
            />
            <button onClick={handleSaveBudget} className="btn-primary" style={{ padding: '4px 12px', width: 'auto' }}>Save</button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditingBudget(true)} 
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Edit Budget
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <p className="text-secondary">Total Spent</p>
          <h3 style={{ fontSize: '1.8rem', margin: 0 }}>₹{totalExpenses.toLocaleString()}</h3>
        </div>
        <div className="text-right">
          <p className="text-secondary">Remaining</p>
          <h3 className={isOverBudget ? 'amount-negative' : 'amount-positive'} style={{ fontSize: '1.8rem', margin: 0 }}>
            ₹{remaining.toLocaleString()}
          </h3>
        </div>
      </div>

      <div className="progress-container">
        <div 
          className="progress-fill" 
          style={{ 
            width: `${progress}%`,
            background: isOverBudget ? 'var(--danger-color)' : 'linear-gradient(90deg, var(--accent-color), #d946ef)'
          }}
        />
      </div>
      <p className="text-secondary" style={{ marginTop: '8px', fontSize: '0.8rem', textAlign: 'right' }}>
        {progress.toFixed(1)}% of budget used
      </p>
    </div>
  );
}
