"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Customer } from "@/types/customer";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CustomerLedgerDialog } from "@/components/customers/CustomerLedgerDialog";
import { Plus, User, Phone, Mail, MapPin, History, ArrowUpDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTablePagination } from "@/components/shared/DataTablePagination";

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
].sort();

export default function CustomersPage() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [isLedgerOpen, setIsLedgerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        gstin: "",
        state: "Maharashtra",
    });

    // Search & Pagination State
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["customers", debouncedSearch, page, limit, sortBy, sortOrder],
        queryFn: async () => {
            const res = await apiClient.get("/customers", {
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

    const customers = response?.data || [];
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

    const createMutation = useMutation({
        mutationFn: (data: any) => apiClient.post("/customers", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] });
            setIsOpen(false);
            setNewCustomer({ name: "", phone: "", email: "", address: "", gstin: "", state: "Maharashtra" });
        },
    });

    if (error) return <div className="p-8 text-red-500">Error loading customers</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground">Manage your client directory and balances.</p>
                </div>
                <Button onClick={() => setIsOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{response?.total || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search customers, email or phone..."
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
                            <TableHead><SortButton field="name" label="Name" /></TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>GSTIN</TableHead>
                            <TableHead><SortButton field="balance" label="Balance" /></TableHead>
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
                        ) : customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No customers found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer: Customer) => (
                                <TableRow key={customer._id}>
                                    <TableCell className="font-medium">{customer.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {customer.phone || "-"}
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="w-3 h-3" /> {customer.email || "-"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm truncate max-w-[200px]">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" /> {customer.state || "-"}
                                            </div>
                                            <div className="text-muted-foreground ml-4">{customer.address || "-"}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-mono">{customer.gstin || "URD"}</div>
                                    </TableCell>

                                    <TableCell>
                                        <span className={customer.balance > 0 ? "text-red-600" : "text-green-600"}>
                                            ₹{customer.balance.toFixed(2)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setIsLedgerOpen(true);
                                            }}
                                        >
                                            <History className="w-4 h-4 mr-1" /> Ledger
                                        </Button>
                                        <Button variant="ghost" size="sm">Edit</Button>
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

            <CustomerLedgerDialog
                customer={selectedCustomer}
                open={isLedgerOpen}
                onOpenChange={setIsLedgerOpen}
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="gstin">GSTIN (Optional)</Label>
                                <Input
                                    id="gstin"
                                    value={newCustomer.gstin}
                                    onChange={(e) => setNewCustomer({ ...newCustomer, gstin: e.target.value })}
                                    placeholder="e.g. 27AAAAA0000A1Z5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Select
                                    value={newCustomer.state}
                                    onValueChange={(val) => setNewCustomer({ ...newCustomer, state: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INDIAN_STATES.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={newCustomer.address}
                                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button
                            onClick={() => createMutation.mutate(newCustomer)}
                            disabled={!newCustomer.name || createMutation.isPending}
                        >
                            {createMutation.isPending ? "Adding..." : "Add Customer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
