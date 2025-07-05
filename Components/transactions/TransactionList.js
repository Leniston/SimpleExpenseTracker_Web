import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Edit,
    Trash2,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

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

export default function TransactionList({ transactions, isLoading, onEdit, onDelete }) {
    // Calculate totals for filtered transactions
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netTotal = totalIncome - totalExpenses;

    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-32 mb-1" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                                <div className="flex gap-2">
                                    <Skeleton className="w-8 h-8" />
                                    <Skeleton className="w-8 h-8" />
                                </div>
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
                    <DollarSign className="w-5 h-5" />
                    All Transactions ({transactions.length})
                </CardTitle>
            </CardHeader>

            {transactions.length > 0 && (
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-white/30 rounded-lg">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-slate-600">Total Income</span>
                            </div>
                            <p className="text-xl font-bold text-green-600">
                                €{totalIncome.toFixed(2)}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <TrendingDown className="w-4 h-4 text-red-500" />
                                <span className="text-sm font-medium text-slate-600">Total Expenses</span>
                            </div>
                            <p className="text-xl font-bold text-red-600">
                                €{totalExpenses.toFixed(2)}
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600">Net Total</span>
                            </div>
                            <p className={`text-xl font-bold ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netTotal >= 0 ? '+' : ''}€{netTotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            )}

            <CardContent className="pt-0">
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No transactions found</p>
                            <p className="text-sm text-slate-400 mt-1">Try adjusting your filters or add a new transaction</p>
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
                                        {transaction.type === 'expense' && (
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${transaction.is_necessary ? 'text-green-600' : 'text-orange-600'}`}
                                            >
                                                {transaction.is_necessary ? 'Necessary' : 'Optional'}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                                    </p>
                                    {transaction.notes && (
                                        <p className="text-xs text-slate-400 mt-1">{transaction.notes}</p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className={`font-semibold text-lg ${
                                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'income' ? '+' : '-'}€{transaction.amount.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(transaction)}
                                        className="hover:bg-blue-50"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(transaction)}
                                        className="hover:bg-red-50 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}