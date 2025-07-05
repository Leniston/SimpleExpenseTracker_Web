import React, { useState, useEffect } from "react";
import { Transaction, Balance } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    TrendingUp,
    TrendingDown,
    Plus,
    Wallet,
    ArrowUpCircle,
    ArrowDownCircle,
    DollarSign,
    Calendar
} from "lucide-react";
import { format } from "date-fns";

import BalanceCard from "../components/dashboard/BalanceCard";
import QuickStats from "../components/dashboard/QuickStats";
import RecentTransactions from "../components/dashboard/RecentTransactions";

export default function Dashboard() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [balanceRecords, transactionRecords] = await Promise.all([
                Balance.list('-updated_date', 1),
                Transaction.list('-created_date', 10)
            ]);

            setBalance(balanceRecords[0]?.current_balance || 0);
            setTransactions(transactionRecords);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setIsLoading(false);
    };

    const thisMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const now = new Date();
        return transactionDate.getMonth() === now.getMonth() &&
            transactionDate.getFullYear() === now.getFullYear();
    });

    const thisMonthIncome = thisMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthExpenses = thisMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const necessaryExpenses = thisMonthTransactions
        .filter(t => t.type === 'expense' && t.is_necessary)
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                            Financial Dashboard
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Welcome back! Here's your financial overview.
                        </p>
                    </div>
                    <Link to={createPageUrl("Transactions")}>
                        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Transaction
                        </Button>
                    </Link>
                </div>

                {/* Balance Card */}
                <BalanceCard balance={balance} isLoading={isLoading} />

                {/* Quick Stats */}
                <QuickStats
                    thisMonthIncome={thisMonthIncome}
                    thisMonthExpenses={thisMonthExpenses}
                    necessaryExpenses={necessaryExpenses}
                    isLoading={isLoading}
                />

                {/* Recent Transactions */}
                <RecentTransactions
                    transactions={transactions}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}