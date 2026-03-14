import { Transaction, DEFAULT_BUDGET } from "./types";

const STORAGE_KEY = "ledger_transactions";
const BUDGET_KEY = "ledger_budget";

export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransaction(tx: Transaction): void {
  const all = getTransactions();
  all.unshift(tx);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateTransaction(tx: Transaction): void {
  const all = getTransactions().map((t) => (t.id === tx.id ? tx : t));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteTransaction(id: string): void {
  const all = getTransactions().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getBudget(): number {
  try {
    const b = localStorage.getItem(BUDGET_KEY);
    return b ? Number(b) : DEFAULT_BUDGET;
  } catch {
    return DEFAULT_BUDGET;
  }
}

export function setBudget(amount: number): void {
  localStorage.setItem(BUDGET_KEY, String(amount));
}

export function getMonthlySpend(transactions: Transaction[]): number {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return transactions
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year && t.category !== "income";
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function getMonthlyIncome(transactions: Transaction[]): number {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return transactions
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year && t.category === "income";
    })
    .reduce((sum, t) => sum + t.amount, 0);
}
