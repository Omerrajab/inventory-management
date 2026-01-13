"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    BarChart3,
    Settings,
    Brain
} from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, href: "/" },
        { label: "Inventory", icon: Package, href: "/inventory" },
        { label: "Sales", icon: ShoppingCart, href: "/sales" },
        { label: "AI Insights", icon: Brain, href: "/ai" },
        { label: "Customers", icon: Users, href: "/customers" },
        { label: "Reports", icon: BarChart3, href: "/reports" },
        { label: "Settings", icon: Settings, href: "/settings" },

    ];


    return (
        <div className="w-64 border-r bg-muted/30 h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight text-primary">ShopGuard AI</h1>
                <p className="text-[10px] uppercase text-muted-foreground font-semibold mt-1">Inventory & Billing</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                            pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t text-[10px] text-center text-muted-foreground">
                v1.0.0-beta
            </div>
        </div>
    );
}
