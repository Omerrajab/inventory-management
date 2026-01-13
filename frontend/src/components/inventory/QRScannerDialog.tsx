"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface QRScannerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onScan: (sku: string) => void;
}

export function QRScannerDialog({ open, onOpenChange, onScan }: QRScannerDialogProps) {
    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        if (open) {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    onScan(decodedText);
                    onOpenChange(false);
                    if (scanner) scanner.clear();
                },
                (error) => {
                    // console.warn(error);
                }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [open, onOpenChange, onScan]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Scan QR / Barcode</DialogTitle>
                </DialogHeader>
                <div id="qr-reader" className="w-full"></div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                    Point your camera at a QR code or barcode to identify a product.
                </p>
            </DialogContent>
        </Dialog>
    );
}
