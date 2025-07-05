import React, { useState, useEffect } from "react";
import { Subscription, Transaction, Balance } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, addMonths, addYears, isBefore } from "date-fns";
import SubscriptionForm from "../components/subscriptions/SubscriptionForm";
import SubscriptionList from "../components/subscriptions/SubscriptionList";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [isBilling, setIsBilling] = useState(false);
    const [billingResult, setBillingResult] = useState(null);

    useEffect(() => {
        loadSubscriptions();
    }, []);

    const loadSubscriptions = async () => {
        setIsLoading(true);
        try {
            const data = await Subscription.list('-created_date');
            setSubscriptions(data);
        } catch (error) {
            console.error('Error loading subscriptions:', error);
        }
        setIsLoading(false);
    };

    const handleSubmit = async (subscriptionData) => {
        try {
            if (editingSubscription) {
                await Subscription.update(editingSubscription.id, subscriptionData);
            } else {
                await Subscription.create({
                    ...subscriptionData,
                    last_billed_date: subscriptionData.start_date, // Set initial last_billed_date
                });
            }
            setShowForm(false);
            setEditingSubscription(null);
            loadSubscriptions();
        } catch (error) {
            console.error('Error saving subscription:', error);
        }
    };

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
        setShowForm(true);
    };

    const handleDelete = async (subscriptionId) => {
        try {
            await Subscription.delete(subscriptionId);
            loadSubscriptions();
        } catch (error) {
            console.error('Error deleting subscription:', error);
        }
    };

    const handleBillDueSubscriptions = async () => {
        setIsBilling(true);
        setBillingResult(null);
        let newTransactions = [];
        let updatedSubscriptions = [];
        let totalBilledAmount = 0;

        const today = new Date();

        for (const sub of subscriptions) {
            let nextBillingDate = new Date(sub.last_billed_date || sub.start_date);
            if (sub.frequency === 'monthly') {
                nextBillingDate = addMonths(nextBillingDate, 1);
            } else if (sub.frequency === 'yearly') {
                nextBillingDate = addYears(nextBillingDate, 1);
            }

            if (isBefore(nextBillingDate, today) || format(nextBillingDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
                const transactionDate = format(nextBillingDate, 'yyyy-MM-dd');
                newTransactions.push({
                    type: 'expense',
                    amount: sub.amount,
                    name: sub.name,
                    category: sub.category,
                    date: transactionDate,
                    is_necessary: sub.is_necessary,
                    notes: `Recurring payment for ${sub.name}`,
                });

                updatedSubscriptions.push(
                    Subscription.update(sub.id, { last_billed_date: transactionDate })
                );
                totalBilledAmount += sub.amount;
            }
        }

        if (newTransactions.length > 0) {
            try {
                await Transaction.bulkCreate(newTransactions);
                await Promise.all(updatedSubscriptions);

                const balanceRecords = await Balance.list('-updated_date', 1);
                const currentBalance = balanceRecords[0]?.current_balance || 0;
                const newBalance = currentBalance - totalBilledAmount;

                if (balanceRecords.length > 0) {
                    await Balance.update(balanceRecords[0].id, { current_balance: newBalance, last_updated: new Date().toISOString() });
                } else {
                    await Balance.create({ current_balance: newBalance, last_updated: new Date().toISOString() });
                }

                setBillingResult({ success: true, count: newTransactions.length, amount: totalBilledAmount });
                loadSubscriptions();
            } catch (error) {
                console.error("Error billing subscriptions:", error);
                setBillingResult({ success: false, message: "An error occurred during billing." });
            }
        } else {
            setBillingResult({ success: true, count: 0, amount: 0 });
        }

        setIsBilling(false);
    };

    return (
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
                                Subscriptions
                            </h1>
                            <p className="text-slate-600 mt-1">
                                Manage your recurring payments
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={handleBillDueSubscriptions}
                            disabled={isBilling}
                            variant="outline"
                            className="hover:bg-white/50"
                        >
                            {isBilling ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Bill Due Subscriptions
                        </Button>
                        <Button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Subscription
                        </Button>
                    </div>
                </div>

                {billingResult && (
                    <Alert variant={billingResult.success ? "default" : "destructive"} className="bg-white/80">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {billingResult.success ?
                                (billingResult.count > 0 ? `Successfully billed ${billingResult.count} subscriptions for a total of €${billingResult.amount.toFixed(2)}.` : "No subscriptions were due for billing.") :
                                billingResult.message
                            }
                        </AlertDescription>
                    </Alert>
                )}

                {showForm && (
                    <SubscriptionForm
                        subscription={editingSubscription}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingSubscription(null);
                        }}
                    />
                )}

                <SubscriptionList
                    subscriptions={subscriptions}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}