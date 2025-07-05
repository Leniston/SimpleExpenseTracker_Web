import React, { useState, useEffect } from "react";
import { Transaction } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, PieChart, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CategoryChart from "../components/reports/CategoryChart";
import NecessityChart from "../components/reports/NecessityChart";
import MonthlyTrends from "../components/reports/MonthlyTrends";
import ReportSummary from "../components/reports/ReportSummary";

export default function Reports() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        setIsLoading(true);
        try {
            const data = await Transaction.list('-created_date');
            setTransactions(data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to={createPageUrl("Dashboard")}>
                        <Button variant="outline" size="icon" className="hover:bg-white/50">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                            Financial Reports
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Analyze your spending patterns and financial health
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <ReportSummary transactions={transactions} isLoading={isLoading} />

                {/* Charts and Analysis */}
                <Tabs defaultValue="categories" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
                        <TabsTrigger value="categories" className="flex items-center gap-2">
                            <PieChart className="w-4 h-4" />
                            Categories
                        </TabsTrigger>
                        <TabsTrigger value="necessity" className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Necessity
                        </TabsTrigger>
                        <TabsTrigger value="trends" className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Trends
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="categories" className="space-y-6">
                        <CategoryChart transactions={transactions} isLoading={isLoading} />
                    </TabsContent>

                    <TabsContent value="necessity" className="space-y-6">
                        <NecessityChart transactions={transactions} isLoading={isLoading} />
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6">
                        <MonthlyTrends transactions={transactions} isLoading={isLoading} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}