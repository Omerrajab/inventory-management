"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Customer, LedgerEntry, LedgerEntryType } from "@/types/customer";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, History, CreditCard, Landmark } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    customer: Customer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CustomerLedgerDialog({ customer, open, onOpenChange }: Props) {
    const queryClient = useQueryClient();
    const [isRecordingPayment, setIsRecordingPayment] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        method: "CASH",
        notes: "",
        transactionId: ""
    });

    const { data: ledger, isLoading } = useQuery<LedgerEntry[]>({
        queryKey: ["ledger", customer?._id],
        queryFn: async () => {
            const resp = await apiClient.get(`/customers/${customer?._id}/ledger`);
            return resp.data;
        },
        enabled: !!customer && open,
    });

    const paymentMutation = useMutation({
        mutationFn: (data: any) => apiClient.post("/customers/payments", {
            ...data,
            customerId: customer?._id,
            amount: parseFloat(data.amount)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ledger", customer?._id] });
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            toast.success("Payment recorded successfully");
            setIsRecordingPayment(false);
            setPaymentForm({ amount: "", method: "CASH", notes: "", transactionId: "" });
        },
        onError: () => {
            toast.error("Failed to record payment");
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-center pr-8">
                        <div>
                            <DialogTitle className="text-xl">Customer Ledger: {customer?.name}</DialogTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                                Current Balance: <span className={`font-bold ${customer && customer.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ₹{customer?.balance.toFixed(2)}
                                </span>
                            </div>
                        </div>
                        <Button variant={isRecordingPayment ? "outline" : "default"} onClick={() => setIsRecordingPayment(!isRecordingPayment)}>
                            {isRecordingPayment ? "Cancel" : "Record Payment"}
                        </Button>
                    </div>
                </DialogHeader>

                {isRecordingPayment && (
                    <div className="bg-muted/50 p-4 rounded-lg border space-y-4 my-4">
                        <h3 className="font-semibold flex items-center">
                            <Wallet className="w-4 h-4 mr-2" /> New Payment
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={paymentForm.amount}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Method</Label>
                                <Select value={paymentForm.method} onValueChange={(val) => setPaymentForm({ ...paymentForm, method: val })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="UPI">UPI</SelectItem>
                                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                                        <SelectItem value="CARD">Card</SelectItem>
                                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Txn ID / Ref</Label>
                                <Input
                                    placeholder="Optional"
                                    value={paymentForm.transactionId}
                                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })}
                                />
                            </div>
                            <Button
                                onClick={() => paymentMutation.mutate(paymentForm)}
                                disabled={!paymentForm.amount || parseFloat(paymentForm.amount) <= 0 || paymentMutation.isPending}
                            >
                                {paymentMutation.isPending ? "Submitting..." : "Save Payment"}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <h3 className="font-semibold mb-4 flex items-center">
                        <History className="w-4 h-4 mr-2" /> Transaction History
                    </h3>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit (+)</TableHead>
                                    <TableHead className="text-right">Credit (-)</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">Loading history...</TableCell>
                                    </TableRow>
                                ) : ledger?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">No transactions found.</TableCell>
                                    </TableRow>
                                ) : (
                                    ledger?.map((entry) => (
                                        <TableRow key={entry._id}>
                                            <TableCell className="text-xs whitespace-nowrap">
                                                {format(new Date(entry.createdAt), "dd MMM yyyy, hh:mm a")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={entry.type === LedgerEntryType.SALE ? "secondary" : "default"}>
                                                    {entry.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm max-w-[200px] truncate" title={entry.description}>
                                                {entry.description}
                                            </TableCell>
                                            <TableCell className="text-right text-red-600 font-medium">
                                                {entry.amount > 0 ? `₹${entry.amount.toFixed(2)}` : "-"}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600 font-medium">
                                                {entry.amount < 0 ? `₹${Math.abs(entry.amount).toFixed(2)}` : "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                ₹{entry.balanceAfter.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
