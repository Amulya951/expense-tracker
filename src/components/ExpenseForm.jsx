import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { FaPlus, FaCalculator } from 'react-icons/fa';
import CustomSelect from './CustomSelect';
import Calculator from './Calculator';

export const CATEGORIES = {
  Food: ['Meal', 'Beverages', 'Groceries', 'Snacks', 'Maggie', 'Others'],
  Travel: ['Auto', 'Cab', 'Metro', 'Others'],
  Studies: ['Books', 'Tuition', 'Supplies', 'Courses', 'Others'],
  Entertainment: ['Movies', 'Games', 'Concerts', 'Others'],
  Shopping: ['Clothing', 'Electronics', 'Accessories', 'Others'],
  Others: [] // Special case for custom input
};

export default function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [subCategory, setSubCategory] = useState(CATEGORIES['Food'][0]);
  const [customDescription, setCustomDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showCalculator, setShowCalculator] = useState(false);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat !== 'Others') {
      setSubCategory(CATEGORIES[newCat][0]);
    } else {
      setSubCategory('Custom');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    // For 'Others', require a custom description
    if ((category === 'Others' || subCategory === 'Others') && !customDescription.trim()) return;

    const finalDescription = (category === 'Others' || subCategory === 'Others') ? customDescription : subCategory;

    addExpense({
      amount: Number(amount),
      category,
      description: finalDescription,
      paymentMethod
    });

    setAmount('');
    setCustomDescription('');
  };

  return (
    <form className="glass-card" style={{ position: 'relative', zIndex: 50 }} onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      
      <div className="mt-4 relative">
        <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button 
            type="button" 
            onClick={() => setShowCalculator(!showCalculator)}
            className="btn-primary flex items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-accent transition-colors"
            title="Open Calculator"
            style={{ width: '48px', height: '48px' }}
          >
            <FaCalculator size={20} />
          </button>
        </div>
        {showCalculator && (
          <Calculator 
            onApply={(val) => setAmount(val)} 
            onClose={() => setShowCalculator(false)} 
          />
        )}
      </div>

      <div className="flex gap-4">
        <div style={{ flex: 1 }}>
          <CustomSelect 
            label="Category"
            value={category} 
            onChange={handleCategoryChange} 
            options={Object.keys(CATEGORIES)}
          />
        </div>

        {category !== 'Others' && (
          <div style={{ flex: 1 }}>
            <CustomSelect 
              label="Subcategory"
              value={subCategory} 
              onChange={setSubCategory} 
              options={CATEGORIES[category]}
            />
          </div>
        )}
      </div>

      <div className="mt-4" style={{ marginBottom: '16px' }}>
        <label className="text-secondary" style={{ display: 'block', marginBottom: '8px' }}>Payment Method</label>
        <div className="flex gap-2">
          {['UPI', 'Cash', 'Card'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.9rem',
                background: paymentMethod === method ? 'var(--accent-color)' : 'rgba(15, 23, 42, 0.6)',
                boxShadow: paymentMethod === method ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                transform: paymentMethod === method ? 'translateY(-2px)' : 'none'
              }}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {(category === 'Others' || subCategory === 'Others') && (
        <div>
          <label className="text-secondary" style={{ display: 'block', marginBottom: '4px' }}>What was it for?</label>
          <input 
            type="text" 
            placeholder="e.g. Movie tickets, Gift..." 
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit" className="btn-primary mt-4">
        <FaPlus /> Add Expense
      </button>
    </form>
  );
}
