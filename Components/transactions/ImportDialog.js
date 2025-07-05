import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { Transaction } from "@/entities/all";
import { Loader2, Upload, FileCheck2, AlertCircle, CheckCircle, ClipboardPaste } from "lucide-react";
import ImportReviewTable from "./ImportReviewTable";

const EXTRACTION_SCHEMA = {
    type: "object",
    properties: {
        transactions: {
            type: "array",
            description: "A list of financial transactions extracted from the CSV.",
            items: {
                type: "object",
                properties: {
                    date: {
                        type: "string",
                        format: "date",
                        description: "Transaction date. Convert from DD/MM/YYYY in the CSV to YYYY-MM-DD format."
                    },
                    name: {
                        type: "string",
                        description: "Transaction description from the 'Description' column."
                    },
                    type: {
                        type: "string",
                        enum: ["income", "expense"],
                        description: "Set to 'income' if 'Money In (€)' has a value, otherwise set to 'expense'."
                    },
                    amount: {
                        type: "number",
                        description: "The transaction amount as a positive number. Parse the value from 'Money In (€)' or 'Money Out (€)' column, ignoring currency symbols and converting to a number."
                    }
                },
                required: ["date", "name", "type", "amount"]
            }
        },
        final_balance: {
            type: "number",
            description: "The final balance from the last row's 'Balance (€)' column. Parse it as a number, ignoring currency symbols."
        }
    }
};

export default function ImportDialog({ isOpen, onClose, onImportSuccess, updateBalance }) {
    const [step, setStep] = useState('upload'); // 'upload', 'review', 'importing', 'done'
    const [file, setFile] = useState(null);
    const [pastedData, setPastedData] = useState('');
    const [error, setError] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "text/csv") {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("Please select a valid CSV file.");
        }
    };

    const handleProcessFile = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            const { file_url } = await UploadFile({ file });
            const result = await ExtractDataFromUploadedFile({
                file_url,
                json_schema: EXTRACTION_SCHEMA
            });

            if (result.status === "success" && result.output?.transactions) {
                setExtractedData({
                    transactions: result.output.transactions.map((t, index) => ({
                        ...t,
                        id: `temp-${index}`,
                        category: t.type === 'income' ? 'other_income' : 'other_expense',
                        is_necessary: true,
                    })),
                    final_balance: result.output.final_balance
                });
                setStep('review');
            } else {
                throw new Error(result.details || "Could not extract data from the file. Please check the format.");
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcessPastedData = async () => {
        if (!pastedData.trim()) {
            setError("Please paste your bank statement data first.");
            return;
        }
        setIsProcessing(true);
        setError(null);
        try {
            const result = await InvokeLLM({
                prompt: `Please extract transaction data from this bank statement. The data may be in CSV format or similar tabular format. Extract each transaction with date, description, amount, and whether it's income or expense.

Bank statement data:
${pastedData}

Please analyze this data and extract individual transactions. Look for patterns like:
- Date columns (DD/MM/YYYY format)
- Description/transaction details
- Money in/out amounts
- Balance information

Return the data in the specified JSON format.`,
                response_json_schema: EXTRACTION_SCHEMA
            });

            if (result?.transactions && Array.isArray(result.transactions)) {
                setExtractedData({
                    transactions: result.transactions.map((t, index) => ({
                        ...t,
                        id: `temp-${index}`,
                        category: t.type === 'income' ? 'other_income' : 'other_expense',
                        is_necessary: true,
                    })),
                    final_balance: result.final_balance
                });
                setStep('review');
            } else {
                throw new Error("Could not extract valid transaction data. Please check the format and try again.");
            }
        } catch (err) {
            setError(err.message || "Failed to process the pasted data. Please check the format.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmImport = async (reviewedTransactions) => {
        setIsProcessing(true);
        setStep('importing');
        setError(null);
        try {
            const transactionsToCreate = reviewedTransactions.map(({ id, ...rest }) => rest);
            await Transaction.bulkCreate(transactionsToCreate);
            if (extractedData.final_balance !== null && extractedData.final_balance !== undefined) {
                await updateBalance(extractedData.final_balance);
            }
            setStep('done');
        } catch (err) {
            setError("Failed to import transactions. Please try again.");
            setStep('review'); // Go back to review step on error
        } finally {
            setIsProcessing(false);
        }
    };

    const resetState = () => {
        setStep('upload');
        setFile(null);
        setPastedData('');
        setError(null);
        setExtractedData(null);
        setIsProcessing(false);
    };

    const handleClose = () => {
        if (step === 'done') {
            onImportSuccess();
        }
        onClose();
        // Delay reset to allow closing animation
        setTimeout(resetState, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" /> Import Transactions
                    </DialogTitle>
                    <DialogDescription>
                        Upload a CSV file or paste your bank statement data to automatically add transactions.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {step === 'upload' && (
                    <Tabs defaultValue="file" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="file" className="flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                Upload CSV File
                            </TabsTrigger>
                            <TabsTrigger value="paste" className="flex items-center gap-2">
                                <ClipboardPaste className="w-4 h-4" />
                                Paste Raw Data
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="file" className="space-y-4">
                            <div className="py-4 space-y-4">
                                <Label htmlFor="csv-file">Bank Statement (CSV file)</Label>
                                <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
                                <Button onClick={handleProcessFile} disabled={!file || isProcessing} className="w-full">
                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCheck2 className="mr-2 h-4 w-4" />}
                                    Process File
                                </Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="paste" className="space-y-4">
                            <div className="py-4 space-y-4">
                                <Label htmlFor="paste-data">Paste Bank Statement Data</Label>
                                <Textarea
                                    id="paste-data"
                                    placeholder="Paste your bank statement data here. You can copy directly from your bank's website, Excel, or any tabular format..."
                                    value={pastedData}
                                    onChange={(e) => setPastedData(e.target.value)}
                                    rows={8}
                                    className="font-mono text-sm"
                                />
                                <Button onClick={handleProcessPastedData} disabled={!pastedData.trim() || isProcessing} className="w-full">
                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ClipboardPaste className="mr-2 h-4 w-4" />}
                                    Process Pasted Data
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {step === 'review' && extractedData && (
                    <ImportReviewTable
                        initialTransactions={extractedData.transactions}
                        onConfirm={handleConfirmImport}
                        onCancel={() => setStep('upload')}
                        isImporting={isProcessing}
                    />
                )}

                {step === 'importing' && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                        <p className="text-lg font-medium text-slate-700">Importing transactions...</p>
                        <p className="text-sm text-slate-500">Please wait, this may take a moment.</p>
                    </div>
                )}

                {step === 'done' && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500" />
                        <p className="text-lg font-medium text-slate-700">Import Successful!</p>
                        <p className="text-sm text-slate-500">{extractedData.transactions.length} transactions have been added.</p>
                        <Button onClick={handleClose}>Close</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}