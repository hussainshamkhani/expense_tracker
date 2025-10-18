import type { Expense } from "../types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from "@fortawesome/free-solid-svg-icons";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (expense: Expense) => void;
  onEditExpense: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onDeleteExpense, onEditExpense }: ExpenseListProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  // Get sorted dates (newest first)
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('-').map(Number);
    const [dayB, monthB, yearB] = b.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="expense-list">
      <h2>Expenses</h2>

      {expenses.length === 0 ? (
        <p className="empty-state">No expenses yet. Add your first expense!</p>
      ) : (
        <>
          <div className="expenses-container">
            {sortedDates.map((date) => (
              <div key={date}>
                <h3 className="date-group-header">{date}</h3>
                {groupedExpenses[date].map((expense, index) => (
                  <div key={expense.id || index} className="expense-item">
                    <div className="expense-content">
                      <div className="expense-header">
                        <span className="category-badge">{expense.category}</span>
                      </div>
                      <div className="expense-body">
                        <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                        {expense.notes && (
                          <span className="expense-notes">{expense.notes}</span>
                        )}
                      </div>
                    </div>
                    <button className="delete-btn" onClick={() => onDeleteExpense(expense)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="edit-btn" onClick={() => onEditExpense(expense)}>
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="total-section">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}