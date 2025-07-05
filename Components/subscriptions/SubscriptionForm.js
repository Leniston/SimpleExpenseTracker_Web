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

const expenseCategories = [
    { value: "utilities", label: "Utilities" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "software", label: "Software" },
    { value: "insurance", label: "Insurance" },
    { value: "rent", label: "Rent" },
    { value: "other", label: "Other" }
];

export default function SubscriptionForm({ subscription, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: subscription?.name || "",
        amount: subscription?.amount || "",
        category: subscription?.category || "other",
        frequency: subscription?.frequency || "monthly",
        start_date: subscription?.start_date || format(new Date(), 'yyyy-MM-dd'),
        is_necessary: subscription?.is_necessary ?? true,
        notes: subscription?.notes || ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                    {subscription ? 'Edit Subscription' : 'Add New Subscription'}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onCancel}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Subscription Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="e.g., Netflix, Gym Membership"
                                required
                            />
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
                            <Label htmlFor="category">Category</Label>
                            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {expenseCategories.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Billing Frequency</Label>
                            <Select value={formData.frequency} onValueChange={(value) => handleChange('frequency', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="start_date">First Bill Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => handleChange('start_date', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="necessity">Is this necessary?</Label>
                            <div className="flex items-center space-x-2 pt-2">
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
                            {subscription ? 'Update' : 'Save'} Subscription
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}