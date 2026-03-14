import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";
import { Transaction } from "@/lib/types";
import {
  getTransactions, saveTransaction, updateTransaction,
  deleteTransaction, getBudget, getMonthlySpend
} from "@/lib/storage";
import BudgetRing from "@/components/BudgetRing";
import TransactionRow from "@/components/TransactionRow";
import EntrySheet from "@/components/EntrySheet";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget] = useState(getBudget);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const reload = useCallback(() => setTransactions(getTransactions()), []);

  useEffect(() => { reload(); }, [reload]);

  const spent = getMonthlySpend(transactions);

  const handleSave = (data: Omit<Transaction, "id" | "date">) => {
    if (editTx) {
      updateTransaction({ ...editTx, ...data });
    } else {
      saveTransaction({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        ...data,
      });
    }
    setEditTx(null);
    reload();
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setEditTx(null);
    reload();
  };

  const handleTap = (tx: Transaction) => {
    setEditTx(tx);
    setSheetOpen(true);
  };

  const openNew = () => {
    setEditTx(null);
    setSheetOpen(true);
  };

  // Group transactions by date
  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const key = new Date(tx.date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    (acc[key] = acc[key] || []).push(tx);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Spend
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              ${spent.toFixed(2)}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {spent > budget ? (
                <span className="text-destructive font-medium">
                  Over budget by ${(spent - budget).toFixed(2)}
                </span>
              ) : (
                <span>${(budget - spent).toFixed(2)} remaining</span>
              )}
            </p>
          </div>
          <BudgetRing spent={spent} budget={budget} />
        </div>
      </header>

      {/* Transaction List */}
      <main className="flex-1 pb-24">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] px-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Start your ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Tap the + button to log your first expense.
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date}>
              <div className="px-4 pt-4 pb-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {date}
                </p>
              </div>
              <div className="divide-y divide-border/50">
                {txs.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} onTap={handleTap} />
                ))}
              </div>
            </div>
          ))
        )}
      </main>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={openNew}
        className="fixed bottom-8 right-6 h-14 w-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-primary-foreground z-30"
        style={{ maxWidth: "calc(100% - 3rem)" }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Entry Sheet */}
      <EntrySheet
        key={editTx?.id || "new"}
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditTx(null); }}
        onSave={handleSave}
        editTx={editTx}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Index;
