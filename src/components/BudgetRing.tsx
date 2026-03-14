interface BudgetRingProps {
  spent: number;
  budget: number;
}

const BudgetRing = ({ spent, budget }: BudgetRingProps) => {
  const ratio = Math.min(spent / budget, 1);
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ratio * circumference;
  const isOver = spent > budget;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth="8"
      />
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke={isOver ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
        strokeWidth="8"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
      />
      <text
        x="40"
        y="42"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-foreground"
        fontSize="12"
        fontWeight="600"
      >
        {Math.round(ratio * 100)}%
      </text>
    </svg>
  );
};

export default BudgetRing;
