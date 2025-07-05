
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
    '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6',
    '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1'
];

export default function CategoryChart({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <Skeleton className="w-64 h-64 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {
        categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    });

    const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: amount,
        percentage: ((amount / expenseTransactions.reduce((sum, t) => sum + t.amount, 0)) * 100).toFixed(1)
    }));

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="h-96 flex items-center justify-center">
                        <p className="text-slate-500">No expense data available</p>
                    </div>
                ) : (
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, 'Amount']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
