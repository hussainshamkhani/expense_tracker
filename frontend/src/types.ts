export type Category =
  | "Transport"
  | "Food"
  | "Shopping"
  | "Rent"
  | "Bills"
  | "Groceries"
  | "Entertainment";

export interface Expense {
  id?: number;
  category: Category;
  amount: number;
  notes?: string;
  date: string;
}

export const categories: Category[] = [
  "Transport",
  "Food",
  "Shopping",
  "Rent",
  "Bills",
  "Groceries",
  "Entertainment"
];
