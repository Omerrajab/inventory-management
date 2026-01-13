"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Receipt,
    Calendar,
    Download,
    Filter
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState<"pl" | "gst">("pl");
    const [period, setPeriod] = useState<"monthly" | "quarterly" | "yearly">("monthly");

    // Profit & Loss Query
    const { data: plData, isLoading: plLoading } = useQuery({
        queryKey: ["reports", "pl", period],
        queryFn: async () => {
            const resp = await apiClient.get(`/reports/profit-loss?period=${period}`);
            return resp.data;
        },
        enabled: activeTab === "pl"
    });

    // GST Query
    const now = new Date();
    const [month, setMonth] = useState((now.getMonth() + 1).toString());
    const [year, setYear] = useState(now.getFullYear().toString());

    const { data: gstData, isLoading: gstLoading } = useQuery({
        queryKey: ["reports", "gst", month, year],
        queryFn: async () => {
            const resp = await apiClient.get(`/reports/gst?month=${month}&year=${year}`);
            return resp.data;
        },
        enabled: activeTab === "gst"
    });

    const chartData = plData ? [
        { name: 'Revenue', value: plData.revenue || 0, color: '#a56eff' },
        { name: 'COGS', value: plData.costOfGoodsSold || 0, color: '#fa4d56' },
        { name: 'Gross Profit', value: plData.grossProfit || 0, color: '#009d9a' }
    ] : [];


    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Monitor your business performance and tax compliance.</p>
                </div>
                <div className="flex bg-muted p-1 rounded-lg">
                    <Button
                        variant={activeTab === "pl" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("pl")}
                    >
                        Profit & Loss
                    </Button>
                    <Button
                        variant={activeTab === "gst" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("gst")}
                    >
                        GST Report
                    </Button>
                </div>
            </div>

            {activeTab === "pl" ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {(["monthly", "quarterly", "yearly"] as const).map((p) => (
                                <Button
                                    key={p}
                                    variant={period === p ? "outline" : "ghost"}
                                    size="sm"
                                    onClick={() => setPeriod(p)}
                                    className="capitalize"
                                >
                                    {p}
                                </Button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" /> Export PDF
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{plData?.revenue?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground">Excluding taxes</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{plData?.grossProfit?.toLocaleString() || 0}</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {plData?.margin || 0}% Margin
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">COGS</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-rose-600">₹{plData?.costOfGoodsSold?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground">Cost of goods sold</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Tax Collected</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-indigo-600">₹{plData?.taxCollected?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground">Net GST liability</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Performance Overview</CardTitle>
                                <CardDescription>Revenue vs Costs for the selected period</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />

                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Summary Details</CardTitle>
                                <CardDescription>Key metrics for {plData?.period} period</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">Start Date</span>
                                        <span className="font-medium">{plData?.start}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">End Date</span>
                                        <span className="font-medium">{plData?.end}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">Total Transactions</span>
                                        <span className="font-medium">{plData?.transactionCount}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-muted-foreground">Average Order Value</span>
                                        <span className="font-medium">₹{plData ? Math.round(plData.revenue / (plData.transactionCount || 1)).toLocaleString() : 0}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Period:</span>
                                <select
                                    className="bg-background border rounded px-2 py-1 text-sm outline-none focus:ring-2 ring-indigo-500"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className="bg-background border rounded px-2 py-1 text-sm outline-none focus:ring-2 ring-indigo-500"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                >
                                    {[2024, 2025, 2026].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" /> GSTR-1 Excel
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2 text-center">
                                <CardTitle className="text-sm font-medium">B2B Invoices</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold">{gstData?.summary.b2bCount}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2 text-center">
                                <CardTitle className="text-sm font-medium">B2C Invoices</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold">{gstData?.summary.b2cCount}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2 text-center">
                                <CardTitle className="text-sm font-medium">Taxable Value</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold">₹{gstData?.summary.totalTaxableValue.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2 text-center">
                                <CardTitle className="text-sm font-medium">Total GST</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold text-indigo-600">₹{gstData?.summary.totalTax.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Inward/Outward Supply Details</CardTitle>
                            <CardDescription>Transaction-wise GST breakdown for {gstData?.month}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>GSTIN</TableHead>
                                        <TableHead>Taxable</TableHead>
                                        <TableHead>CGST</TableHead>
                                        <TableHead>SGST</TableHead>
                                        <TableHead>IGST</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {gstData?.details.map((row: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-xs">{row.date}</TableCell>
                                            <TableCell className="font-medium">{row.invoiceNumber}</TableCell>
                                            <TableCell>{row.customer}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{row.gstin}</TableCell>
                                            <TableCell>₹{row.taxableValue.toLocaleString()}</TableCell>
                                            <TableCell>₹{row.cgst.toLocaleString()}</TableCell>
                                            <TableCell>₹{row.sgst.toLocaleString()}</TableCell>
                                            <TableCell>₹{row.igst.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-bold">₹{row.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {gstData?.details.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                                No transactions found for this period.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
