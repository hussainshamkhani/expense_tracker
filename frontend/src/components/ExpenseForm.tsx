import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Expense } from "../types";
import { categories } from "../types";

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (expense: Expense) => void;
  editingExpense: Expense | null;
}

export default function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense }: ExpenseFormProps) {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-GB").replace(/\//g, "-")
  );

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setAmount(editingExpense.amount.toString());
      setNotes(editingExpense.notes || "");
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const expense: Expense = {
      category,
      amount: parseFloat(amount),
      notes: notes || undefined,
      date,
    };

    if (editingExpense) {
      onUpdateExpense({...expense, id: editingExpense.id });
    } else {
      onAddExpense(expense);
    }

    // Reset form
    setAmount("");
    setNotes("");
    setCategory(categories[0]);
    setDate(new Date().toLocaleDateString("en-GB").replace(/\//g, "-"));
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>{editingExpense ? "Edit Expense": "Add Expense"}</h2>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes (optional)</label>
        <input
          type="text"
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date (DD-MM-YYYY)</label>
        <input
          type="text"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="DD-MM-YYYY"
        />
      </div>

      <button type="submit" className="btn-primary">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </button>
    </form>
  );
}
