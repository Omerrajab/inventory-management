"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { MovementType, Product } from "@/types/inventory";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    type: z.nativeEnum(MovementType),
    reason: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateStockDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpdateStockDialog({ product, open, onOpenChange }: UpdateStockDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 1,
            type: MovementType.IN,
            reason: "",
        } as FormValues,
    });

    const mutation = useMutation({
        mutationFn: (values: FormValues) => {
            return apiClient.post(`/inventory/products/${product._id}/stock`, values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onOpenChange(false);
            form.reset();
        },
    });

    function onSubmit(values: FormValues) {
        mutation.mutate(values);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Stock: {product.name}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Movement Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={MovementType.IN}>Stock In (+)</SelectItem>
                                            <SelectItem value={MovementType.OUT}>Stock Out (-)</SelectItem>
                                            <SelectItem value={MovementType.ADJUSTMENT}>Adjustment (Set to)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reason (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Restock, Sale, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="mt-6">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Updating..." : "Update Stock"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
