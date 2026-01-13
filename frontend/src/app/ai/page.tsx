"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from "recharts";
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Warehouse, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AiInsightsPage() {
    const { data: forecast, isLoading: isForecastLoading } = useQuery({
        queryKey: ["ai-forecast"],
        queryFn: async () => {
            const resp = await apiClient.get("/ai/forecast");
            return resp.data;
        },
    });

    const { data: optimizations, isLoading: isOptLoading } = useQuery({
        queryKey: ["stock-optimization"],
        queryFn: async () => {
            const resp = await apiClient.get("/ai/stock-optimization");
            return resp.data;
        },
    });

    if (isForecastLoading || isOptLoading) return <div className="p-8">Analyzing business data...</div>;


    const timelineData = forecast?.timeline || [];
    const insights = forecast?.insights || {};

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
                    <p className="text-muted-foreground">Predictive analytics and demand forecasting.</p>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
                    <Brain className="w-4 h-4 mr-2" /> Powered by SMA Engine
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Predicted Weekly Revenue</CardTitle>
                        <Zap className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-700">₹{insights.predictedWeeklyDemand?.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on 7-day moving average</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Sales Growth Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-700">
                            {insights.growthRate > 0 ? "+" : ""}{insights.growthRate}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Comparing last 7 days vs previous</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
                        <Target className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-700">{insights.confidence}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {insights.confidence === 'Low' ? 'Collect 7+ more days of sales' : 'Adequate data points'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Sales Forecast (30 Days)</CardTitle>
                    <CardDescription>Comparison between actual sales and predicted trend.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineData}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a56eff" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#a56eff" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#009d9a" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#009d9a" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return date.getDate().toString();
                                }}
                            />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip
                                formatter={(value: any) => [`₹${parseFloat(value).toFixed(2)}`, ""]}
                            />
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#a56eff"
                                fillOpacity={1}
                                fill="url(#colorActual)"
                                name="Actual Sales"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="forecast"
                                stroke="#009d9a"
                                fillOpacity={1}
                                fill="url(#colorForecast)"
                                name="AI Forecast"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                            <Legend />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Warehouse className="w-5 h-5 mr-2 text-blue-600" />
                            Stock Optimization & Reordering
                        </CardTitle>
                        <CardDescription>Automated smart reorder points based on sales velocity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {optimizations?.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">Stock levels are optimal for all products.</p>
                            ) : (
                                optimizations?.map((opt: any) => (
                                    <div key={opt.productId} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                        <div>
                                            <div className="font-semibold text-sm">{opt.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Stock: {opt.currentStock} | Velocity: {opt.dailyVelocity}/day
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {opt.recommendedReorder > 0 ? (
                                                <div className="flex flex-col items-end">
                                                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                                                        Order {opt.recommendedReorder} units
                                                    </Badge>
                                                    <span className="text-[10px] text-muted-foreground mt-1">
                                                        Run out in {opt.daysRemaining} days
                                                    </span>
                                                </div>
                                            ) : (
                                                <Badge variant="outline" className="text-amber-600 border-amber-200">
                                                    Low Stock: {opt.daysRemaining} days left
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {insights.growthRate < -10 && (
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg flex items-start gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-amber-800 text-lg">Growth Warning: Revenue Downtrend</h4>
                            <p className="text-amber-700 mt-1">
                                Revenue has plummeted by {Math.abs(insights.growthRate)}% over the last 7 days compared to the previous week.
                            </p>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-amber-800 font-medium">
                                    <ArrowRight className="w-4 h-4 mr-2" /> Check for seasonal trends in Pune region.
                                </div>
                                <div className="flex items-center text-sm text-amber-800 font-medium">
                                    <ArrowRight className="w-4 h-4 mr-2" /> Review stock levels of your top-selling items.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

