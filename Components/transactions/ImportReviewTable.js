
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
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

export default function ImportReviewTable({ initialTransactions, onConfirm, onCancel, isImporting }) {
    const [transactions, setTransactions] = useState(initialTransactions);

    const handleFieldChange = (id, field, value) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
        );
    };

    return (
        <div className="space-y-4">
            <div className="max-h-[50vh] overflow-y-auto border rounded-lg">
                <Table>
                    <TableHeader className="sticky top-0 bg-slate-50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Necessary</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell>{format(new Date(t.date), 'MMM d, yyyy')}</TableCell>
                                <TableCell>
                                    <Input
                                        value={t.name}
                                        onChange={(e) => handleFieldChange(t.id, 'name', e.target.value)}
                                        className="w-full"
                                    />
                                </TableCell>
                                <TableCell className={`${t.type === 'income' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                    {t.type === 'income' ? '+' : '-'}€{t.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={t.category}
                                        onValueChange={(value) => handleFieldChange(t.id, 'category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(t.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    {t.type === 'expense' ? (
                                        <div className="flex items-center justify-center">
                                            <Switch
                                                checked={t.is_necessary}
                                                onCheckedChange={(checked) => handleFieldChange(t.id, 'is_necessary', checked)}
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onCancel} disabled={isImporting}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                </Button>
                <Button onClick={() => onConfirm(transactions)} disabled={isImporting}>
                    {isImporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Confirm Import ({transactions.length})
                </Button>
            </div>
        </div>
    );
}
