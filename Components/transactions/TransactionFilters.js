import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function TransactionFilters({ filters, onFilterChange }) {
    return (
        <Card className="glass-effect border-0 shadow-lg">
            <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                    <Filter className="w-5 h-5 text-slate-500" />
                    <h3 className="font-medium text-slate-900">Filter Transactions</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Select value={filters.type} onValueChange={(value) => onFilterChange({...filters, type: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Select value={filters.category} onValueChange={(value) => onFilterChange({...filters, category: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="investment">Investment</SelectItem>
                                <SelectItem value="food">Food & Dining</SelectItem>
                                <SelectItem value="transport">Transport</SelectItem>
                                <SelectItem value="utilities">Utilities</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="shopping">Shopping</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Select value={filters.necessity} onValueChange={(value) => onFilterChange({...filters, necessity: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Necessity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="necessary">Necessary</SelectItem>
                                <SelectItem value="unnecessary">Optional</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Select value={filters.dateRange} onValueChange={(value) => onFilterChange({...filters, dateRange: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                                <SelectItem value="this_year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}