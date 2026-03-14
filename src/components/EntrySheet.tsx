import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES, Transaction } from "@/lib/types";
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

const NUMPAD_KEYS = ["1","2","3","4","5","6","7","8","9",".","0","⌫"];

interface EntrySheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, "id" | "date">) => void;
  editTx?: Transaction | null;
  onDelete?: (id: string) => void;
}

const EntrySheet = ({ open, onClose, onSave, editTx, onDelete }: EntrySheetProps) => {
  const [display, setDisplay] = useState(editTx ? String(editTx.amount) : "0");
  const [category, setCategory] = useState(editTx?.category || "food");
  const [note, setNote] = useState(editTx?.note || "");

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setDisplay((d) => (d.length <= 1 ? "0" : d.slice(0, -1)));
      return;
    }
    if (key === "." && display.includes(".")) return;
    // limit to 2 decimal places
    const parts = display.split(".");
    if (parts[1] && parts[1].length >= 2) return;

    setDisplay((d) => (d === "0" && key !== "." ? key : d + key));
  };

  const handleSave = () => {
    const amount = parseFloat(display);
    if (isNaN(amount) || amount <= 0) return;
    onSave({ amount, category, note });
    onClose();
  };

  const handleDelete = () => {
    if (editTx && onDelete) {
      onDelete(editTx.id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl safe-bottom"
            style={{ maxHeight: "92vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-2">
              <h2 className="text-lg font-semibold text-foreground">
                {editTx ? "Edit" : "New Expense"}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full active:bg-muted">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Amount Display */}
            <div className="text-center py-4">
              <span className="text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                ${display}
              </span>
            </div>

            {/* Note input */}
            <div className="px-4 pb-3">
              <input
                type="text"
                placeholder="Add note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-sm px-4 py-2.5 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Categories */}
            <div className="px-4 pb-3">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[60px] py-2 px-2 rounded-xl transition-all ${
                      category === cat.id
                        ? "bg-primary/10 ring-2 ring-primary/30"
                        : "active:bg-muted"
                    }`}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                    >
                      {iconMap[cat.icon]}
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-1 px-4 pb-2">
              {NUMPAD_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="h-12 rounded-xl text-lg font-medium text-foreground active:bg-muted transition-colors flex items-center justify-center"
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-2">
              {editTx && onDelete && (
                <button
                  onClick={handleDelete}
                  className="h-12 px-6 rounded-2xl bg-destructive/10 text-destructive font-semibold text-[15px] active:scale-[0.98] transition-transform"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-lg"
              >
                {editTx ? "Update" : "Save"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EntrySheet;
