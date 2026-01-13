"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export const useInventorySocket = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket: Socket = io(SOCKET_URL);

        socket.on("connect", () => {
            console.log("Connected to Inventory WebSocket");
        });

        socket.on("stockUpdated", (data: { productId: string; newQuantity: number }) => {
            console.log("Stock Update Received:", data);
            queryClient.invalidateQueries({ queryKey: ["products"] });
        });

        socket.on("newNotification", () => {
            console.log("New Notification Received");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
            toast("Low Stock Alert", {
                description: "One or more products reached their reorder point.",
            });
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from Inventory WebSocket");
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);
};

