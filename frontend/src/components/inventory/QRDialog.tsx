"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/inventory";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRDialogProps {
    product: Product;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function QRDialog({ product, open, onOpenChange }: QRDialogProps) {
    const downloadQR = () => {
        if (!product.qrCode) return;
        const link = document.createElement("a");
        link.href = product.qrCode;
        link.download = `QR_${product.sku}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>QR Code: {product.name}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-6 space-y-4">
                    {product.qrCode ? (
                        <>
                            <div className="p-4 bg-white rounded-lg border shadow-sm">
                                <img src={product.qrCode} alt="QR Code" className="w-48 h-48" />
                            </div>
                            <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                                {product.sku}
                            </p>
                            <div className="flex gap-2 w-full">
                                <Button variant="outline" className="flex-1" onClick={() => navigator.clipboard.writeText(product.sku)}>
                                    <Copy className="w-4 h-4 mr-2" /> Copy SKU
                                </Button>
                                <Button className="flex-1" onClick={downloadQR}>
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p className="text-destructive">QR Code not generated</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
