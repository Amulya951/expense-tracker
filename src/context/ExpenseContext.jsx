import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export function useExpenses() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? Number(saved) : 50000;
  });

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', monthlyBudget.toString());
  }, [monthlyBudget]);

  const addExpense = (expense) => {
    setExpenses(prev => [{
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...expense
    }, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      deleteExpense,
      monthlyBudget,
      setMonthlyBudget,
      totalExpenses
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}
