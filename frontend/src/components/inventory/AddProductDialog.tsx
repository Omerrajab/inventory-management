"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    sku: z.string().min(2, "SKU must be at least 2 characters"),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    purchasePrice: z.coerce.number().min(0, "Purchase price must be positive"),
    price: z.coerce.number().min(0, "Selling price must be positive"),
    quantity: z.coerce.number().min(0, "Quantity must be positive"),
    reorderPoint: z.coerce.number().min(0, "Reorder point must be positive"),
    unit: z.string().optional(),
    hsnCode: z.string().optional(),
    gstRate: z.coerce.number().min(0).default(18),
});



type FormValues = z.infer<typeof formSchema>;

export function AddProductDialog() {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            sku: "",
            description: "",
            categoryId: "",
            purchasePrice: 0,
            price: 0,
            quantity: 0,
            reorderPoint: 5,
            unit: "pcs",
            hsnCode: "",
            gstRate: 18,
        },
    });


    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const resp = await apiClient.get("/settings/categories");
            return resp.data;
        }
    });


    const mutation = useMutation({
        mutationFn: (values: z.infer<typeof formSchema>) => {
            return apiClient.post("/inventory/products", values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setOpen(false);
            form.reset();
        },
    });

    function onSubmit(values: FormValues) {
        mutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Wireless Mouse" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU</FormLabel>
                                        <FormControl>
                                            <Input placeholder="W-MOUSE-001" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((cat: any) => (
                                                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="purchasePrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Purchase Rate (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...(field as any)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling Price (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...(field as any)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Initial Stock</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...(field as any)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reorderPoint"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reorder Point</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...(field as any)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="pcs" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hsnCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>HSN</FormLabel>
                                        <FormControl>
                                            <Input placeholder="8471" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gstRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GST %</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...(field as any)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={mutation.isPending}>
                            {mutation.isPending ? "Adding..." : "Add Product"}
                        </Button>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
