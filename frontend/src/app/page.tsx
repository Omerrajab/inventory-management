"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventorySocket } from "@/hooks/useInventorySocket";

export default function Home() {
  useInventorySocket();

  const { data: products } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const resp = await apiClient.get("/inventory/products", { params: { limit: 1000 } });
      return resp.data.data;
    },
  });

  const { data: sales } = useQuery<any[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const resp = await apiClient.get("/sales", { params: { limit: 1000 } });
      return resp.data.data;
    },
  });

  const { data: customers } = useQuery<any[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const resp = await apiClient.get("/customers", { params: { limit: 1000 } });
      return resp.data.data;
    },
  });

  const lowStockCount = products?.filter(p => p.quantity <= p.reorderPoint).length || 0;
  const totalRevenue = sales?.reduce((acc, sale) => acc + sale.totalAmount, 0) || 0;

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,

      icon: TrendingUp,
      description: "Total sales value",
      color: "text-red-600",
      bg: "bg-gradient-to-br from-red-50 to-white border-red-100"
    },
    {
      title: "Total Sales",
      value: sales?.length || 0,
      icon: ShoppingCart,
      description: "Number of transactions",
      color: "text-purple-600",
      bg: "bg-gradient-to-br from-purple-50 to-white border-purple-100"
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: Package,
      description: "Unique SKUs in stock",
      color: "text-cyan-600",
      bg: "bg-gradient-to-br from-cyan-50 to-white border-cyan-100"
    },
    {
      title: "Total Customers",
      value: customers?.length || 0,
      icon: Users,
      description: "Registered clients",
      color: "text-teal-600",
      bg: "bg-gradient-to-br from-teal-50 to-white border-teal-100"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business performance.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.bg}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {lowStockCount > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <CardTitle className="text-lg">Critical Stock Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 dark:text-red-400">
              There are {lowStockCount} products that have reached or dropped below their reorder point.
              Please restock soon to avoid shortages.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales?.slice(0, 5).map((sale) => (
                <div key={sale._id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{sale.invoiceNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {sale.customerId?.name || "Walk-in"} • {new Date(sale.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-bold">₹{sale.totalAmount.toFixed(2)}</div>

                </div>
              ))}
              {(!sales || sales.length === 0) && (
                <div className="text-center py-4 text-sm text-muted-foreground">No recent sales</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for top products - would need a specialized query */}
            <div className="text-center py-8 text-sm text-muted-foreground">
              Analytics data will appear here as you process more sales.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
