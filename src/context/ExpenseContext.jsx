import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, query, orderBy, where, getDocs, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

const ExpenseContext = createContext();

export function useExpenses() {
  return useContext(ExpenseContext);
}

export function ExpenseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(50000);
  const [loading, setLoading] = useState(true);

  // Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Run migration logic once when a user logs in
        // (Assigns old expenses without a userId to this user)
        try {
          const snapshot = await getDocs(collection(db, 'expenses'));
          const updatePromises = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (!data.userId) {
              updatePromises.push(updateDoc(doc(db, 'expenses', docSnap.id), { userId: currentUser.uid }));
            }
          });
          await Promise.all(updatePromises);
        } catch (err) {
          console.error("Migration error:", err);
        }
      } else {
        setExpenses([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // Listen to expenses collection scoped to the logged-in user
    const q = query(
      collection(db, 'expenses'), 
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    
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

    // Listen to budget document scoped to the user
    const unsubscribeBudget = onSnapshot(doc(db, 'settings', `budget_${user.uid}`), (docSnap) => {
      if (docSnap.exists()) {
        setMonthlyBudget(docSnap.data().amount);
      } else {
        // Default budget if not set
        setMonthlyBudget(50000);
      }
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeBudget();
    };
  }, [user]);

  const addExpense = async (expense) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'expenses'), {
        date: new Date().toISOString(),
        userId: user.uid,
        ...expense
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const deleteExpense = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'expenses', id));
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  const updateMonthlyBudget = async (newAmount) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'settings', `budget_${user.uid}`), { amount: newAmount });
    } catch (error) {
      console.error("Error updating budget: ", error);
    }
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <ExpenseContext.Provider value={{
      user,
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
