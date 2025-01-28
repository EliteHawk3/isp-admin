// src/components/dashboard/MonthlyPayments.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "./ChartCard";
// Sample Monthly Payments Data
const paymentData: PaymentData[] = [
  { month: "Jan", cost: 300, payments: 520, profit: 220 },
  { month: "Feb", cost: 280, payments: 480, profit: 200 },
  { month: "Mar", cost: 310, payments: 500, profit: 190 },
  { month: "Apr", cost: 270, payments: 490, profit: 220 },
  { month: "May", cost: 350, payments: 580, profit: 230 },
];

// Monthly Payments Interface
interface PaymentData {
  month: string; // Month Name (e.g., "Jan")
  cost: number; // Monthly cost
  payments: number; // Monthly payments received
  profit: number; // Monthly profit
  currency?: string; // Optional currency type (e.g., "USD")
  total?: number; // Optional cumulative total
}

// Monthly Payments Component
const MonthlyPayments: React.FC = () => {
  return (
    <ChartCard
      title="Monthly Costs, Payments & Profit"
      infoTooltip="Visualizes monthly financial trends."
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={paymentData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cost" fill="#F59E0B" name="Cost" />
          <Bar dataKey="payments" fill="#10B981" name="Payments" />
          <Bar dataKey="profit" fill="#3B82F6" name="Profit" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default MonthlyPayments;
