
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function BalanceCard({ balance, isLoading }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardContent className="p-8">
                    <div className="text-center space-y-4">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-12 w-48 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-effect border-0 shadow-xl overflow-hidden">
            <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full transform translate-x-16 -translate-y-16" />

                <div className="text-center relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Current Balance</p>
                            <p className="text-xs text-slate-400">Available funds</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        {balance >= 0 ? (
                            <TrendingUp className="w-8 h-8 text-green-500" />
                        ) : (
                            <TrendingDown className="w-8 h-8 text-red-500" />
                        )}
                        <p className={`text-5xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{Math.abs(balance).toFixed(2)}
                        </p>
                    </div>

                    {balance < 0 && (
                        <div className="mt-4 px-4 py-2 bg-red-50 border border-red-200 rounded-full inline-block">
                            <p className="text-red-600 text-sm font-medium">Account Overdrawn</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
