
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, Calendar, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categoryColors = {
    salary: "bg-green-100 text-green-800",
    freelance: "bg-blue-100 text-blue-800",
    investment: "bg-purple-100 text-purple-800",
    gift: "bg-pink-100 text-pink-800",
    other_income: "bg-gray-100 text-gray-800",
    food: "bg-orange-100 text-orange-800",
    transport: "bg-cyan-100 text-cyan-800",
    utilities: "bg-yellow-100 text-yellow-800",
    entertainment: "bg-red-100 text-red-800",
    shopping: "bg-indigo-100 text-indigo-800",
    healthcare: "bg-emerald-100 text-emerald-800",
    education: "bg-violet-100 text-violet-800",
    rent: "bg-rose-100 text-rose-800",
    insurance: "bg-teal-100 text-teal-800",
    other_expense: "bg-slate-100 text-slate-800"
};

export default function RecentTransactions({ transactions, isLoading }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Transactions
                </CardTitle>
                <Link to={createPageUrl("Transactions")}>
                    <Button variant="outline" size="sm" className="gap-2">
                        View All
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-500">No transactions yet</p>
                            <p className="text-sm text-slate-400 mt-1">Add your first transaction to get started</p>
                        </div>
                    ) : (
                        transactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                    {transaction.type === 'income' ? (
                                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-medium text-slate-900">{transaction.name}</p>
                                        <Badge
                                            variant="secondary"
                                            className={`${categoryColors[transaction.category]} text-xs`}
                                        >
                                            {transaction.category.replace(/_/g, ' ')}
                                        </Badge>
                                        {!transaction.is_necessary && transaction.type === 'expense' && (
                                            <Badge variant="outline" className="text-xs">
                                                Optional
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className={`font-semibold ${
                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
