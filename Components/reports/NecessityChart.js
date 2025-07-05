
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function NecessityChart({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader>
                    <CardTitle>Necessary vs Optional Spending</CardTitle>
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
    const necessaryTotal = expenseTransactions.filter(t => t.is_necessary).reduce((sum, t) => sum + t.amount, 0);
    const optionalTotal = expenseTransactions.filter(t => !t.is_necessary).reduce((sum, t) => sum + t.amount, 0);

    const chartData = [
        {
            name: 'Necessary',
            value: necessaryTotal,
            percentage: ((necessaryTotal / (necessaryTotal + optionalTotal)) * 100).toFixed(1)
        },
        {
            name: 'Optional',
            value: optionalTotal,
            percentage: ((optionalTotal / (necessaryTotal + optionalTotal)) * 100).toFixed(1)
        }
    ];

    const COLORS = ['#10b981', '#f59e0b'];

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
                <CardTitle>Necessary vs Optional Spending</CardTitle>
            </CardHeader>
            <CardContent>
                {expenseTransactions.length === 0 ? (
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
                                    outerRadius={120}
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
