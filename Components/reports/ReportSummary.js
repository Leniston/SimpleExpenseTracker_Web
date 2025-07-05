
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportSummary({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="glass-effect border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const necessaryExpenses = transactions.filter(t => t.type === 'expense' && t.is_necessary).reduce((sum, t) => sum + t.amount, 0);
    const unnecessaryExpenses = transactions.filter(t => t.type === 'expense' && !t.is_necessary).reduce((sum, t) => sum + t.amount, 0);

    const stats = [
        {
            title: "Total Income",
            value: `€${totalIncome.toFixed(2)}`,
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-50"
        },
        {
            title: "Total Expenses",
            value: `€${totalExpenses.toFixed(2)}`,
            icon: TrendingDown,
            color: "text-red-500",
            bgColor: "bg-red-50"
        },
        {
            title: "Necessary Spending",
            value: `€${necessaryExpenses.toFixed(2)}`,
            icon: AlertTriangle,
            color: "text-amber-500",
            bgColor: "bg-amber-50"
        },
        {
            title: "Optional Spending",
            value: `€${unnecessaryExpenses.toFixed(2)}`,
            icon: Target,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
