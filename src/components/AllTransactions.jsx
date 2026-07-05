import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FaUtensils, FaPlane, FaBook, FaEllipsisH, FaTrash, FaFilm, FaArrowLeft, FaSortAmountDown, FaSortAmountUp, FaSortAlphaDown, FaShoppingBag } from 'react-icons/fa';

const categoryIcons = {
  Food: <FaUtensils />,
  Travel: <FaPlane />,
  Studies: <FaBook />,
  Entertainment: <FaFilm />,
  Shopping: <FaShoppingBag />,
  Others: <FaEllipsisH />
};

export default function AllTransactions({ onBack }) {
  const { expenses, deleteExpense } = useExpenses();
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc, category

  const sortedExpenses = [...expenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  return (
    <div className="glass-card animate-slide-in" style={{ padding: '0', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center" style={{ padding: '24px 24px 12px 24px', borderBottom: '1px solid var(--card-border)' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', marginRight: '16px' }}
        >
          <FaArrowLeft />
        </button>
        <h2 style={{ margin: 0, flex: 1 }}>All Transactions</h2>
      </div>

      <div className="flex gap-2" style={{ padding: '12px 24px', overflowX: 'auto', borderBottom: '1px solid var(--card-border)' }}>
        <button 
          className={`btn-primary ${sortBy.includes('date') ? 'active' : ''}`}
          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', background: sortBy.includes('date') ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setSortBy(sortBy === 'date-desc' ? 'date-asc' : 'date-desc')}
        >
          {sortBy === 'date-desc' ? <FaSortAmountDown /> : <FaSortAmountUp />} Date
        </button>
        <button 
          className={`btn-primary ${sortBy.includes('amount') ? 'active' : ''}`}
          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', background: sortBy.includes('amount') ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setSortBy(sortBy === 'amount-desc' ? 'amount-asc' : 'amount-desc')}
        >
          {sortBy === 'amount-desc' ? <FaSortAmountDown /> : <FaSortAmountUp />} Amount
        </button>
        <button 
          className={`btn-primary ${sortBy === 'category' ? 'active' : ''}`}
          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', background: sortBy === 'category' ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setSortBy('category')}
        >
          <FaSortAlphaDown /> Category
        </button>
      </div>
      
      <div style={{ padding: '12px 24px', flex: 1, overflowY: 'auto' }}>
        {sortedExpenses.length === 0 ? (
          <p className="text-center text-secondary" style={{ marginTop: '24px' }}>No transactions found.</p>
        ) : (
          sortedExpenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="flex items-center">
                <div className="expense-icon">
                  {categoryIcons[expense.category] || <FaEllipsisH />}
                </div>
                <div className="expense-details">
                  <h4 style={{ margin: 0 }}>{expense.description}</h4>
                  <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
                    {expense.category} • {expense.paymentMethod || 'UPI'} • {new Date(expense.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="expense-amount amount-negative">
                  -₹{Number(expense.amount).toLocaleString()}
                </span>
                <button 
                  onClick={() => deleteExpense(expense.id)}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--text-secondary)', 
                    cursor: 'pointer', padding: '8px' 
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
