export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
}

export interface Category {
  id: string;
  label: string;
  icon: string; // lucide icon name
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "food", label: "Food", icon: "UtensilsCrossed", color: "hsl(24, 95%, 53%)" },
  { id: "transport", label: "Transport", icon: "Car", color: "hsl(226, 70%, 55%)" },
  { id: "shopping", label: "Shopping", icon: "ShoppingBag", color: "hsl(330, 65%, 55%)" },
  { id: "bills", label: "Bills", icon: "Zap", color: "hsl(45, 93%, 47%)" },
  { id: "health", label: "Health", icon: "Heart", color: "hsl(0, 84%, 60%)" },
  { id: "entertainment", label: "Fun", icon: "Gamepad2", color: "hsl(280, 65%, 55%)" },
  { id: "income", label: "Income", icon: "TrendingUp", color: "hsl(142, 71%, 45%)" },
  { id: "other", label: "Other", icon: "MoreHorizontal", color: "hsl(215, 16%, 47%)" },
];

export const DEFAULT_BUDGET = 2000;
