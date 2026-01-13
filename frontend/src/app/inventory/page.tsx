"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Product } from "@/types/inventory";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Package, AlertTriangle, MoreVertical, ArrowUpCircle, QrCode, Scan, ArrowUpDown, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProductDialog } from "@/components/inventory/AddProductDialog";
import { UpdateStockDialog } from "@/components/inventory/UpdateStockDialog";
import { QRDialog } from "@/components/inventory/QRDialog";
import { QRScannerDialog } from "@/components/inventory/QRScannerDialog";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { useInventorySocket } from "@/hooks/useInventorySocket";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTablePagination } from "@/components/shared/DataTablePagination";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export default function InventoryPage() {
    useInventorySocket();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isQROpen, setIsQROpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // Search & Pagination State
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["products", debouncedSearch, page, limit, sortBy, sortOrder],
        queryFn: async () => {
            const res = await apiClient.get("/inventory/products", {
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

    const products = response?.data || [];
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

    const onScanSuccess = (sku: string) => {
        const product = products?.find((p: any) => p.sku === sku);
        if (product) {
            setSelectedProduct(product);
            setIsUpdateOpen(true);
        } else {
            alert("Product not found");
        }
    };


    if (error) return <div className="p-8 text-red-500">Error loading inventory</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage your products and stock levels.</p>
                </div>
                <div className="flex items-center gap-4">
                    <NotificationCenter />
                    <div className="h-8 w-[1px] bg-border mx-2" />
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsScannerOpen(true)}>
                            <Scan className="w-4 h-4" /> Scan
                        </Button>
                        <AddProductDialog />
                    </div>
                </div>
            </div>


            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{response?.total || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {products?.filter((p: any) => p.quantity <= p.reorderPoint).length || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products or SKU..."
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
                            <TableHead><SortButton field="sku" label="SKU" /></TableHead>
                            <TableHead><SortButton field="name" label="Name" /></TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead><SortButton field="quantity" label="Stock Level" /></TableHead>
                            <TableHead><SortButton field="price" label="Price" /></TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product: Product) => (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">{product.sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category?.name || "-"}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {product.quantity} {product.unit}
                                            {product.quantity <= product.reorderPoint && (
                                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>₹{product.price.toFixed(2)}</TableCell>

                                    <TableCell>
                                        {product.quantity > product.reorderPoint ? (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-none">In Stock</Badge>
                                        ) : product.quantity > 0 ? (
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-none">Low Stock</Badge>
                                        ) : (
                                            <Badge variant="destructive">Out of Stock</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsUpdateOpen(true);
                                                }}>
                                                    <ArrowUpCircle className="w-4 h-4 mr-2" />
                                                    Update Stock
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedProduct(product);
                                                    setIsQROpen(true);
                                                }}>
                                                    <QrCode className="w-4 h-4 mr-2" />
                                                    View QR Code
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Edit Product</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

            {selectedProduct && (
                <UpdateStockDialog
                    product={selectedProduct}
                    open={isUpdateOpen}
                    onOpenChange={setIsUpdateOpen}
                />
            )}

            {selectedProduct && (
                <QRDialog
                    product={selectedProduct}
                    open={isQROpen}
                    onOpenChange={setIsQROpen}
                />
            )}

            <QRScannerDialog
                open={isScannerOpen}
                onOpenChange={setIsScannerOpen}
                onScan={onScanSuccess}
            />
        </div>
    );
}
