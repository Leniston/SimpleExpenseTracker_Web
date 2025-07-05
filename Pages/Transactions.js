
import React, { useState, useEffect } from "react";
import { Transaction, Balance } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import TransactionFilters from "../components/transactions/TransactionFilters";
import ImportDialog from "../components/transactions/ImportDialog";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        type: 'all',
        category: 'all',
        necessity: 'all',
        dateRange: 'all'
    });
    const [isImporting, setIsImporting] = useState(false); // New state for import dialog

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [transactionRecords, balanceRecords] = await Promise.all([
                Transaction.list('-created_date'),
                Balance.list('-updated_date', 1)
            ]);

            setTransactions(transactionRecords);
            setBalance(balanceRecords[0]?.current_balance || 0);
        } catch (error) {
            console.error('Error loading data:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (transactionData) => {
        try {
            if (editingTransaction) {
                await Transaction.update(editingTransaction.id, transactionData);
            } else {
                await Transaction.create(transactionData);
            }

            // Update balance
            const newBalance = editingTransaction
                ? balance - (editingTransaction.type === 'income' ? editingTransaction.amount : -editingTransaction.amount) +
                (transactionData.type === 'income' ? transactionData.amount : -transactionData.amount)
                : balance + (transactionData.type === 'income' ? transactionData.amount : -transactionData.amount);

            await updateBalance(newBalance);

            setShowForm(false);
            setEditingTransaction(null);
            loadData();
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const updateBalance = async (newBalance) => {
        try {
            const balanceRecords = await Balance.list('-updated_date', 1);
            if (balanceRecords.length > 0) {
                await Balance.update(balanceRecords[0].id, {
                    current_balance: newBalance,
                    last_updated: new Date().toISOString()
                });
            } else {
                await Balance.create({
                    current_balance: newBalance,
                    last_updated: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('Error updating balance:', error);
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleDelete = async (transaction) => {
        try {
            await Transaction.delete(transaction.id);

            // Update balance
            const newBalance = balance - (transaction.type === 'income' ? transaction.amount : -transaction.amount);
            await updateBalance(newBalance);

            loadData();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const typeMatch = filters.type === 'all' || transaction.type === filters.type;
        const categoryMatch = filters.category === 'all' || transaction.category === filters.category;
        const necessityMatch = filters.necessity === 'all' ||
            (filters.necessity === 'necessary' && transaction.is_necessary) ||
            (filters.necessity === 'unnecessary' && !transaction.is_necessary);

        let dateMatch = true;
        if (filters.dateRange !== 'all') {
            const transactionDate = new Date(transaction.date);
            const now = new Date();

            switch (filters.dateRange) {
                case 'this_month':
                    dateMatch = transactionDate.getMonth() === now.getMonth() &&
                        transactionDate.getFullYear() === now.getFullYear();
                    break;
                case 'last_month':
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    dateMatch = transactionDate.getMonth() === lastMonth.getMonth() &&
                        transactionDate.getFullYear() === lastMonth.getFullYear();
                    break;
                case 'this_year':
                    dateMatch = transactionDate.getFullYear() === now.getFullYear();
                    break;
            }
        }

        return typeMatch && categoryMatch && necessityMatch && dateMatch;
    });

    return (
        <>
            <div className="min-h-screen p-4 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Link to={createPageUrl("Dashboard")}>
                                <Button variant="outline" size="icon" className="hover:bg-white/50">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                                    Transactions
                                </h1>
                                <p className="text-slate-600 mt-1">
                                    Manage your income and expenses
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsImporting(true)}
                                className="hover:bg-white/50"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Import CSV
                            </Button>
                            <Button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Transaction
                            </Button>
                        </div>
                    </div>

                    {/* Balance Display */}
                    <Card className="glass-effect border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-sm text-slate-500 mb-2">Current Balance</p>
                                <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    €{Math.abs(balance).toFixed(2)}
                                </p>
                                {balance < 0 && <p className="text-sm text-red-500 mt-1">Overdrawn</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction Form */}
                    {showForm && (
                        <TransactionForm
                            transaction={editingTransaction}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingTransaction(null);
                            }}
                        />
                    )}

                    {/* Filters */}
                    <TransactionFilters
                        filters={filters}
                        onFilterChange={setFilters}
                    />

                    {/* Transaction List */}
                    <TransactionList
                        transactions={filteredTransactions}
                        isLoading={isLoading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
            <ImportDialog
                isOpen={isImporting}
                onClose={() => setIsImporting(false)}
                onImportSuccess={() => {
                    setIsImporting(false);
                    loadData(); // Reload data after successful import
                }}
                updateBalance={updateBalance}
            />
        </>
    );
}
