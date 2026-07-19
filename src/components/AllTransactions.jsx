import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FaUtensils, FaPlane, FaBook, FaEllipsisH, FaTrash, FaFilm, FaArrowLeft, FaSortAmountDown, FaSortAmountUp, FaShoppingBag, FaCalendarDay } from 'react-icons/fa';
import CustomSelect from './CustomSelect';
import { CATEGORIES } from './ExpenseForm';

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
  const [sortBy, setSortBy] = useState('date-desc');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterSubCategory, setFilterSubCategory] = useState('All Subcategories');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Available categories for filter dropdown
  const categoryOptions = ['All Categories', ...Object.keys(CATEGORIES)];
  
  // Available subcategories based on selected category
  const subCategoryOptions = ['All Subcategories'];
  if (filterCategory !== 'All Categories' && CATEGORIES[filterCategory]) {
    subCategoryOptions.push(...CATEGORIES[filterCategory]);
  }

  // Handle category change (reset subcategory)
  const handleCategoryFilter = (cat) => {
    setFilterCategory(cat);
    setFilterSubCategory('All Subcategories');
  };

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFromDate(today);
    setToDate(today);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    if (filterCategory !== 'All Categories' && expense.category !== filterCategory) {
      return false;
    }
    if (filterSubCategory !== 'All Subcategories' && expense.description !== filterSubCategory) {
      return false;
    }
    
    // Date filtering
    if (fromDate || toDate) {
      const expDate = new Date(expense.date);
      // Reset time to start of day for comparison
      expDate.setHours(0, 0, 0, 0);
      
      if (fromDate) {
        const fDate = new Date(fromDate);
        fDate.setHours(0, 0, 0, 0);
        if (expDate < fDate) return false;
      }
      
      if (toDate) {
        const tDate = new Date(toDate);
        tDate.setHours(0, 0, 0, 0);
        if (expDate > tDate) return false;
      }
    }
    
    return true;
  });

  // Calculate total for filtered view
  const totalSpent = filteredExpenses.filter(e => e.type !== 'income').reduce((sum, exp) => sum + Number(exp.amount), 0);
  const totalEarned = filteredExpenses.filter(e => e.type === 'income').reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Sort filtered expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return new Date(b.date) - new Date(a.date);
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

      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--card-border)' }}>
        <div className="flex gap-4 mb-4">
          <div style={{ flex: 1 }}>
            <CustomSelect 
              label="Filter by Category"
              value={filterCategory} 
              onChange={handleCategoryFilter} 
              options={categoryOptions}
            />
          </div>
          {filterCategory !== 'All Categories' && filterCategory !== 'Others' && (
            <div style={{ flex: 1 }}>
              <CustomSelect 
                label="Filter by Subcategory"
                value={filterSubCategory} 
                onChange={setFilterSubCategory} 
                options={subCategoryOptions}
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-4 items-end">
          <div style={{ flex: 1 }}>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>From Date</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>To Date</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <button 
            onClick={setToday}
            className="btn-primary"
            style={{ padding: '8px 16px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaCalendarDay /> Today
          </button>
        </div>
      </div>

      <div className="flex gap-2" style={{ padding: '12px 24px', overflowX: 'auto', borderBottom: '1px solid var(--card-border)' }}>
        <span className="text-secondary" style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>Sort by:</span>
        <button 
          className={`btn-primary ${sortBy.includes('amount') ? 'active' : ''}`}
          style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', background: sortBy.includes('amount') ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setSortBy(sortBy === 'amount-desc' ? 'amount-asc' : 'amount-desc')}
        >
          {sortBy === 'amount-desc' ? <FaSortAmountDown /> : <FaSortAmountUp />} Amount
        </button>
        {sortBy.includes('amount') && (
           <button 
             className="btn-primary"
             style={{ padding: '8px 12px', width: 'auto', fontSize: '0.8rem', background: 'rgba(15, 23, 42, 0.6)' }}
             onClick={() => setSortBy('date-desc')}
           >
             Clear Sort
           </button>
        )}
      </div>
      
      <div className="flex justify-between items-center" style={{ padding: '12px 24px', borderBottom: '1px solid var(--card-border)' }}>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Totals for this view:</span>
        <div className="flex gap-4 text-right">
          <div>
             <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Spent</span>
             <h3 style={{ margin: 0, color: 'var(--danger-color)' }}>₹{totalSpent.toLocaleString()}</h3>
          </div>
          <div>
             <span className="text-secondary" style={{ fontSize: '0.8rem', display: 'block' }}>Earned</span>
             <h3 style={{ margin: 0, color: 'var(--success-color)' }}>₹{totalEarned.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px', flex: 1, overflowY: 'auto' }}>
        {sortedExpenses.length === 0 ? (
          <p className="text-center text-secondary" style={{ marginTop: '24px' }}>No transactions found for these filters.</p>
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
                <span className={`expense-amount ${expense.type === 'income' ? 'amount-positive' : 'amount-negative'}`}>
                  {expense.type === 'income' ? '+' : '-'}₹{Number(expense.amount).toLocaleString()}
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
