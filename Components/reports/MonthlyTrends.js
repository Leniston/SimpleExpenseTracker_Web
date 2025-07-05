
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function MonthlyTrends({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        <Skeleton className="w-full h-64" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const monthlyData = {};

    transactions.forEach(transaction => {
        const monthKey = format(new Date(transaction.date), 'yyyy-MM');
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0, month: format(new Date(transaction.date), 'MMM yyyy') };
        }

        if (transaction.type === 'income') {
            monthlyData[monthKey].income += transaction.amount;
        } else {
            monthlyData[monthKey].expenses += transaction.amount;
        }
    });

    const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader>
                <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <div className="h-96 flex items-center justify-center">
                        <p className="text-slate-500">No data available for trends</p>
                    </div>
                ) : (
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`€${value.toFixed(2)}`, '']} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Income" />
                                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} name="Expenses" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
