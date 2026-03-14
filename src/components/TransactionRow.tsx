import { Transaction, CATEGORIES } from "@/lib/types";
import {
  UtensilsCrossed, Car, ShoppingBag, Zap, Heart,
  Gamepad2, TrendingUp, MoreHorizontal
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  MoreHorizontal: <MoreHorizontal className="w-5 h-5" />,
};

interface TransactionRowProps {
  transaction: Transaction;
  onTap: (tx: Transaction) => void;
}

const TransactionRow = ({ transaction, onTap }: TransactionRowProps) => {
  const cat = CATEGORIES.find((c) => c.id === transaction.category);
  const isIncome = transaction.category === "income";
  const d = new Date(transaction.date);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <button
      onClick={() => onTap(transaction)}
      className="group flex items-center justify-between py-3 px-4 w-full active:scale-[0.98] active:bg-muted transition-all duration-150"
    >
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: cat ? `${cat.color}15` : undefined, color: cat?.color }}
        >
          {cat ? iconMap[cat.icon] : iconMap.MoreHorizontal}
        </div>
        <div className="text-left">
          <p className="text-[15px] font-medium text-foreground">
            {transaction.note || cat?.label || "Expense"}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <span
        className={`tabular-nums font-medium text-[15px] ${
          isIncome ? "text-success" : "text-foreground"
        }`}
      >
        {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
      </span>
    </button>
  );
};

export default TransactionRow;
