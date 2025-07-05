
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Save } from "lucide-react";
import { format } from "date-fns";

const incomeCategories = [
    { value: "salary", label: "Salary" },
    { value: "freelance", label: "Freelance" },
    { value: "investment", label: "Investment" },
    { value: "gift", label: "Gift" },
    { value: "other_income", label: "Other Income" }
];

const expenseCategories = [
    { value: "food", label: "Food & Dining" },
    { value: "transport", label: "Transport" },
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "rent", label: "Rent" },
    { value: "insurance", label: "Insurance" },
    { value: "other_expense", label: "Other Expense" }
];

export default function TransactionForm({ transaction, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        type: transaction?.type || "expense",
        amount: transaction?.amount || "",
        name: transaction?.name || "",
        category: transaction?.category || "",
        date: transaction?.date || format(new Date(), 'yyyy-MM-dd'),
        is_necessary: transaction?.is_necessary ?? true,
        is_subscription: transaction?.is_subscription ?? false, // Added for subscriptions feature
        notes: transaction?.notes || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Reset category when type changes
            ...(field === 'type' && { category: '' })
        }));
    };

    const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {transaction ? 'Edit Transaction' : 'Add New Transaction'}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="type">Transaction Type</Label>
                            <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (€)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(e) => handleChange('amount', e.target.value)}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Transaction Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter transaction name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                required
                            />
                        </div>

                        {formData.type === 'expense' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="necessity">Is this necessary?</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="necessity"
                                            checked={formData.is_necessary}
                                            onCheckedChange={(checked) => handleChange('is_necessary', checked)}
                                        />
                                        <Label htmlFor="necessity" className="text-sm">
                                            {formData.is_necessary ? 'Necessary' : 'Optional'}
                                        </Label>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subscription">Is this a subscription?</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="subscription"
                                            checked={formData.is_subscription}
                                            onCheckedChange={(checked) => handleChange('is_subscription', checked)}
                                        />
                                        <Label htmlFor="subscription" className="text-sm">
                                            {formData.is_subscription ? 'Subscription' : 'One-time'}
                                        </Label>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Add any additional notes..."
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {transaction ? 'Update' : 'Save'} Transaction
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
