import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const ExpenseContext = createContext();

export function useExpenses() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to expenses collection
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubscribeExpenses = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setExpenses(expensesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    });

    // Listen to budget document
    const unsubscribeBudget = onSnapshot(doc(db, 'settings', 'budget'), (docSnap) => {
      if (docSnap.exists()) {
        setMonthlyBudget(docSnap.data().amount);
      }
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBudget();
    };
  }, []);

  const addExpense = async (expense) => {
    try {
      await addDoc(collection(db, 'expenses'), {
        date: new Date().toISOString(),
        ...expense
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const updateMonthlyBudget = async (newAmount) => {
    try {
      await setDoc(doc(db, 'settings', 'budget'), { amount: newAmount });
    } catch (error) {
      console.error("Error updating budget: ", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      deleteExpense,
      monthlyBudget,
      setMonthlyBudget: updateMonthlyBudget,
      totalExpenses,
      loading
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}
