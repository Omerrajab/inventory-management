"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Sale } from "@/types/sale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { Download, Plus, Receipt, TrendingUp, Package, Search, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTablePagination } from "@/components/shared/DataTablePagination";

export default function SalesPage() {
    // Search & Pagination State
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["sales", debouncedSearch, page, limit, sortBy, sortOrder],
        queryFn: async () => {
            const res = await apiClient.get("/sales", {
                params: {
                    page,
                    limit,
                    search: debouncedSearch,
                    sortBy,
                    sortOrder
                }
            });
            return res.data;
        },
    });

    const sales = response?.data || [];
    const stats = response?.stats || { totalRevenue: 0, todayRevenue: 0, avgOrderValue: 0 };
    const totalPages = response?.totalPages || 1;

    const toggleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const SortButton = ({ field, label }: { field: string, label: string }) => (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            onClick={() => toggleSort(field)}
        >
            <span>{label}</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );

    const downloadInvoice = async (saleId: string, invoiceNo: string) => {
        try {
            const res = await apiClient.get(`/sales/${saleId}/invoice`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Failed to download invoice");
        }
    };

    if (error) return <div className="p-8 text-red-500">Error loading sales</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
                    <p className="text-muted-foreground">Monitor transactions and invoice history.</p>
                </div>
                <Link href="/sales/new">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Sale
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{stats.totalRevenue.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{stats.todayRevenue.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₹{stats.avgOrderValue.toFixed(2)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search invoices or customers..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><SortButton field="invoiceNumber" label="Invoice #" /></TableHead>
                            <TableHead><SortButton field="createdAt" label="Date" /></TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead><SortButton field="totalAmount" label="Total" /></TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No sales records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale: Sale) => (
                                <TableRow key={sale._id}>
                                    <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                                    <TableCell>{format(new Date(sale.createdAt), "MMM d, h:mm a")}</TableCell>
                                    <TableCell>{(sale as any).customerId?.name || "Walking Customer"}</TableCell>
                                    <TableCell className="font-bold">₹{sale.totalAmount.toFixed(2)}</TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={sale.paymentStatus === 'PAID' ? 'secondary' : 'destructive'}
                                            className={sale.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-none' : ''}
                                        >
                                            {sale.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" onClick={() => downloadInvoice(sale._id, sale.invoiceNumber)}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <DataTablePagination
                    page={page}
                    totalPages={totalPages}
                    limit={limit}
                    total={response?.total || 0}
                    onPageChange={setPage}
                    onLimitChange={(l) => {
                        setLimit(l);
                        setPage(1);
                    }}
                />
            </div>
        </div>
    );
}
