import { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import MonthlyReport from "./components/MonthlyReport";
import type { Expense } from "./types";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/expenses`);
        if (response.ok) {
          const data = await response.json();
          setExpenses(data.expenses);
        } else {
          console.error("Failed to fetch expenses");
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        alert("Error connecting to server. Make sure the backend is running.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expense: Expense) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/adding_expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        const data = await response.json();
        const expenseWithId = { ...expense, id: data.id };
        setExpenses([expenseWithId, ...expenses]);
      } else {
        alert("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error connecting to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expense: Expense) => {
    setIsLoading(true);
    try{
      const response = await fetch(`${API_URL}/deleting_expense/${expense.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense)
      });

      if (response.ok) {
        setExpenses(expenses.filter(e => e.id !== expense.id));
      } else {
        alert("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error handling deleting expense:", error);
      alert("Error connecting to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdatExpense = async (expense: Expense) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/updating_expense/${expense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expense),
      });

      if (response.ok) {
        setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
        setEditingExpense(null);
      } else {
        alert("Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Error connecting to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Expense Tracker</h1>
      </header>

      <div className="app-container">
        <div className="app-content">
          <div className="left-column">
            <ExpenseForm onAddExpense={handleAddExpense} onUpdateExpense={handleUpdatExpense} editingExpense={editingExpense}/>
            <MonthlyReport />
          </div>
          <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense}/>
        </div>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default App;
