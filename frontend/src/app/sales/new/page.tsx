"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Product } from "@/types/inventory";
import { Customer } from "@/types/customer";
import { PaymentMethod, PaymentStatus, SaleItem } from "@/types/sale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Search,
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    User,
    Scan,
    CheckCircle2,
    CreditCard
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QRScannerDialog } from "@/components/inventory/QRScannerDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewSalePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>("null");
    const [cartItems, setCartItems] = useState<SaleItem[]>([]);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [notes, setNotes] = useState("");

    const { data: products } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const resp = await apiClient.get("/inventory/products");
            return resp.data;
        },
    });

    const { data: customers } = useQuery<Customer[]>({
        queryKey: ["customers"],
        queryFn: async () => {
            const resp = await apiClient.get("/customers");
            return resp.data;
        },
    });

    const addToCart = (product: Product) => {
        const existing = cartItems.find((item) => item.productId === product._id);
        if (existing) {
            if (existing.quantity >= product.quantity) {
                toast.error("Insufficient stock");
                return;
            }
            setCartItems(
                cartItems.map((item) => {
                    if (item.productId === product._id) {
                        const newQty = item.quantity + 1;
                        const baseTotal = newQty * item.price;
                        const gstAmt = (baseTotal * (item.gstRate || 18)) / 100;
                        return {
                            ...item,
                            quantity: newQty,
                            gstAmount: gstAmt,
                            subtotal: baseTotal + gstAmt
                        };
                    }
                    return item;
                })
            );
        } else {
            if (product.quantity < 1) {
                toast.error("Out of stock");
                return;
            }
            const basePrice = product.price;
            const gstRate = product.gstRate || 18;
            const gstAmount = (basePrice * gstRate) / 100;
            setCartItems([
                ...cartItems,
                {
                    productId: product._id,
                    name: product.name,
                    quantity: 1,
                    price: basePrice,
                    gstRate: gstRate,
                    gstAmount: gstAmount,
                    subtotal: basePrice + gstAmount,
                },
            ]);
        }

    };

    const removeFromCart = (productId: string) => {
        setCartItems(cartItems.filter((item) => item.productId !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCartItems(
            cartItems.map((item) => {
                if (item.productId === productId) {
                    const product = products?.find(p => p._id === productId);
                    const newQty = item.quantity + delta;
                    if (newQty < 1) return item;
                    if (product && newQty > product.quantity) {
                        toast.error("Insufficient stock");
                        return item;
                    }
                    const baseTotal = newQty * item.price;
                    const gstAmt = (baseTotal * (item.gstRate || 18)) / 100;
                    return {
                        ...item,
                        quantity: newQty,
                        gstAmount: gstAmt,
                        subtotal: baseTotal + gstAmt
                    };

                }
                return item;
            })
        );
    };

    const onScanSuccess = (sku: string) => {
        const product = products?.find((p) => p.sku === sku);
        if (product) {
            addToCart(product);
            toast.success(`Added ${product.name}`);
        } else {
            toast.error("Product not found");
        }
    };

    const calculateTotalGst = () => {
        return cartItems.reduce((acc, item) => acc + (item.gstAmount || 0), 0);
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    const totalTax = calculateTotalGst();
    const subtotal = totalAmount - totalTax;


    const downloadInvoice = async (saleId: string, invoiceNo: string) => {
        try {
            const response = await apiClient.get(`/sales/${saleId}/invoice`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceNo}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download invoice", error);
        }
    };

    const saleMutation = useMutation({
        mutationFn: (data: any) => apiClient.post("/sales", data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Sale completed successfully");

            const sale = response.data;
            if (sale?._id && sale?.invoiceNumber) {
                downloadInvoice(sale._id, sale.invoiceNumber);
            }

            router.push("/sales");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to complete sale");
        }
    });


    const handleCheckout = () => {
        if (cartItems.length === 0) return;

        const payload = {
            customerId: selectedCustomerId === "null" ? undefined : selectedCustomerId,
            items: cartItems,
            totalAmount,
            paymentMethod,
            paymentStatus: PaymentStatus.PAID,
            notes,
        };

        saleMutation.mutate(payload);
    };

    return (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">New Sale</h1>
                    <Button variant="outline" onClick={() => setIsScannerOpen(true)}>
                        <Scan className="w-4 h-4 mr-2" /> Scan Product
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Select Items</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search products..." className="pl-8" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {products?.filter(p => p.quantity > 0).map((product) => (
                                <div
                                    key={product._id}
                                    className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors space-y-1"
                                    onClick={() => addToCart(product)}
                                >
                                    <div className="font-semibold truncate">{product.name}</div>
                                    <div className="text-sm text-muted-foreground font-mono">{product.sku}</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold">₹{product.price.toFixed(2)}</span>
                                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                                            Stock: {product.quantity}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        + {product.gstRate || 18}% GST
                                    </div>

                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Cart ({cartItems.length} items)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>₹{item.price.toFixed(2)}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.productId, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">₹{item.subtotal.toFixed(2)}</TableCell>

                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFromCart(item.productId)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {cartItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            Cart is empty. Select products to start.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="sticky top-8">
                    <CardHeader>
                        <CardTitle className="text-lg">Checkout Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label className="flex items-center">
                                <User className="w-4 h-4 mr-2" /> Customer
                            </Label>
                            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Walking Customer</SelectItem>
                                    {customers?.map((customer) => (
                                        <SelectItem key={customer._id} value={customer._id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center">
                                <CreditCard className="w-4 h-4 mr-2" /> Payment Method
                            </Label>
                            <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                                    <SelectItem value={PaymentMethod.CARD}>Card</SelectItem>
                                    <SelectItem value={PaymentMethod.TRANSFER}>Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Packing info, special request..." />
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>GST (CGST + SGST/IGST)</span>
                                <span>₹{totalTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2 border-t">
                                <span>Grand Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>


                        <Button
                            className="w-full h-12 text-lg"
                            size="lg"
                            disabled={cartItems.length === 0 || saleMutation.isPending}
                            onClick={handleCheckout}
                        >
                            {saleMutation.isPending ? "Processing..." : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Complete Sale
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <QRScannerDialog
                open={isScannerOpen}
                onOpenChange={setIsScannerOpen}
                onScan={onScanSuccess}
            />
        </div>
    );
}
