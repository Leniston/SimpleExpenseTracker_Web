import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickStats({ thisMonthIncome, thisMonthExpenses, necessaryExpenses, isLoading }) {
    // Provide default values to prevent undefined errors
    const safeThisMonthIncome = thisMonthIncome || 0;
    const safeThisMonthExpenses = thisMonthExpenses || 0;
    const safeNecessaryExpenses = necessaryExpenses || 0;

    const stats = [
        {
            title: "This Month Income",
            value: `€${safeThisMonthIncome.toFixed(2)}`,
            icon: ArrowUpCircle,
            color: "text-green-500",
            bgColor: "bg-green-50",
            change: "+12%"
        },
        {
            title: "This Month Expenses",
            value: `€${safeThisMonthExpenses.toFixed(2)}`,
            icon: ArrowDownCircle,
            color: "text-red-500",
            bgColor: "bg-red-50",
            change: "-8%"
        },
        {
            title: "Necessary Expenses",
            value: `€${safeNecessaryExpenses.toFixed(2)}`,
            icon: AlertCircle,
            color: "text-amber-500",
            bgColor: "bg-amber-50",
            change: `${safeThisMonthExpenses > 0 ? ((safeNecessaryExpenses / safeThisMonthExpenses) * 100).toFixed(0) : 0}%`
        },
        {
            title: "Net This Month",
            value: `€${(safeThisMonthIncome - safeThisMonthExpenses).toFixed(2)}`,
            icon: DollarSign,
            color: safeThisMonthIncome - safeThisMonthExpenses >= 0 ? "text-green-500" : "text-red-500",
            bgColor: safeThisMonthIncome - safeThisMonthExpenses >= 0 ? "bg-green-50" : "bg-red-50",
            change: "Monthly"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="glass-effect border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                                    <p className={`text-2xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">{stat.change}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}