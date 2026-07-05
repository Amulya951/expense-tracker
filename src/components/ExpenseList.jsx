import { useExpenses } from '../context/ExpenseContext';
import { FaUtensils, FaPlane, FaBook, FaEllipsisH, FaTrash, FaFilm, FaShoppingBag } from 'react-icons/fa';

const categoryIcons = {
  Food: <FaUtensils />,
  Travel: <FaPlane />,
  Studies: <FaBook />,
  Entertainment: <FaFilm />,
  Shopping: <FaShoppingBag />,
  Others: <FaEllipsisH />
};

export default function ExpenseList({ onViewAll }) {
  const { expenses, deleteExpense } = useExpenses();

  const recentExpenses = expenses.slice(0, 20);

  if (expenses.length === 0) {
    return (
      <div className="glass-card text-center text-secondary">
        <p>No expenses added yet. Start tracking!</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '0' }}>
      <div className="flex justify-between items-center" style={{ padding: '24px 24px 0 24px' }}>
        <h3 style={{ margin: 0 }}>Recent Transactions</h3>
        {expenses.length > 20 && (
          <button 
            onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            View All
          </button>
        )}
      </div>
      
      <div style={{ padding: '12px 24px' }}>
        {recentExpenses.map((expense) => (
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
        ))}
      </div>
      
      {expenses.length <= 20 && expenses.length > 0 && (
        <div className="text-center" style={{ padding: '0 24px 24px 24px' }}>
          <button 
            onClick={onViewAll}
            style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            View All Transactions History
          </button>
        </div>
      )}
    </div>
  );
}
