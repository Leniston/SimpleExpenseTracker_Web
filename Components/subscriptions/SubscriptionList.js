import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Repeat, Calendar, DollarSign, Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addMonths, addYears } from "date-fns";

const categoryColors = {
    utilities: "bg-yellow-100 text-yellow-800",
    entertainment: "bg-red-100 text-red-800",
    shopping: "bg-indigo-100 text-indigo-800",
    software: "bg-blue-100 text-blue-800",
    insurance: "bg-teal-100 text-teal-800",
    rent: "bg-rose-100 text-rose-800",
    other: "bg-slate-100 text-slate-800"
};

export default function SubscriptionList({ subscriptions, isLoading, onEdit, onDelete }) {
    if (isLoading) {
        return (
            <Card className="glass-effect border-0 shadow-xl">
                <CardHeader><CardTitle>My Subscriptions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                            <div className="flex gap-2"><Skeleton className="w-8 h-8" /><Skeleton className="w-8 h-8" /></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-effect border-0 shadow-xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Repeat className="w-5 h-5" /> My Subscriptions ({subscriptions.length})</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subscriptions.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No subscriptions added yet</p>
                            <p className="text-sm text-slate-400 mt-1">Add your recurring payments to get started</p>
                        </div>
                    ) : (
                        subscriptions.map((sub) => {
                            let nextBillDate;
                            if (sub.last_billed_date) {
                                if (sub.frequency === 'monthly') nextBillDate = addMonths(new Date(sub.last_billed_date), 1);
                                else nextBillDate = addYears(new Date(sub.last_billed_date), 1);
                            } else {
                                nextBillDate = new Date(sub.start_date);
                            }

                            return (
                                <div key={sub.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColors[sub.category]}`}>
                                            <Tag className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1">
                                            <p className="font-medium text-slate-900">{sub.name}</p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <Badge variant="secondary" className={`${categoryColors[sub.category]} text-xs`}>{sub.category}</Badge>
                                                <Badge variant="outline" className="text-xs capitalize">{sub.frequency}</Badge>
                                                {sub.is_necessary ? <Badge variant="outline" className="text-xs text-green-600">Necessary</Badge> : <Badge variant="outline" className="text-xs text-orange-600">Optional</Badge>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-sm text-slate-500">Amount</p>
                                            <p className="font-semibold text-lg text-red-600">€{sub.amount.toFixed(2)}</p>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-sm text-slate-500">Next Bill</p>
                                            <p className="font-semibold text-slate-700">{format(nextBillDate, 'MMM d, yyyy')}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 ml-auto">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(sub)} className="hover:bg-blue-50"><Edit className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(sub.id)} className="hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            )})
                    )}
                </div>
            </CardContent>
        </Card>
    );
}