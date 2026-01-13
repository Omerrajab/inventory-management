"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Building2,
    Tags,
    Plus,
    Trash2,
    ChevronRight,
    Image as ImageIcon,
    Save
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"company" | "categories">("company");
    const queryClient = useQueryClient();

    // Company Settings Query
    const { data: settings, isLoading: isSettingsLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: async () => {
            const resp = await apiClient.get("/settings");
            return resp.data;
        }
    });

    // Categories Query
    const { data: categories, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const resp = await apiClient.get("/settings/categories");
            return resp.data;
        }
    });

    const updateSettingsMutation = useMutation({
        mutationFn: async (vars: any) => apiClient.patch("/settings", vars),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Settings updated successfully");
        }
    });

    const createCategoryMutation = useMutation({
        mutationFn: async (vars: any) => apiClient.post("/settings/categories", vars),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created");
        }
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: string) => apiClient.delete(`/settings/categories/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted");
        }
    });

    if (isSettingsLoading || isCategoriesLoading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your company profile and application data.</p>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                <Button
                    variant={activeTab === "company" ? "default" : "ghost"}
                    onClick={() => setActiveTab("company")}
                    size="sm"
                >
                    <Building2 className="w-4 h-4 mr-2" /> Company Profile
                </Button>
                <Button
                    variant={activeTab === "categories" ? "default" : "ghost"}
                    onClick={() => setActiveTab("categories")}
                    size="sm"
                >
                    <Tags className="w-4 h-4 mr-2" /> Categories
                </Button>
            </div>

            {activeTab === "company" ? (
                <CompanyForm settings={settings} onSave={(data: any) => updateSettingsMutation.mutate(data)} />
            ) : (
                <CategoryManagement
                    categories={categories}
                    onCreate={(data: any) => createCategoryMutation.mutate(data)}
                    onDelete={(id: string) => deleteCategoryMutation.mutate(id)}
                />
            )}
        </div>
    );
}

function CompanyForm({ settings, onSave }: any) {
    const [formData, setFormData] = useState(settings || {});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>This information will appear on your invoices and reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                placeholder="ANTIGRAVITY INVENTORY"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>GSTIN</Label>
                            <Input
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                placeholder="27AAAAA0000A1Z5"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Plot No. 123, Tech Park..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email Address</Label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="billing@company.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <div className="flex gap-2">
                            <Input
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://..."
                            />
                            <div className="w-10 h-10 border rounded flex items-center justify-center bg-slate-50 overflow-hidden">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function CategoryManagement({ categories, onCreate, onDelete }: any) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [parentId, setParentId] = useState<string>("null");

    const mainCategories = categories?.filter((c: any) => !c.parentId);

    const handleCreate = () => {
        if (!newName) return;
        onCreate({ name: newName, parentId: parentId === "null" ? null : parentId });
        setNewName("");
        setIsAddOpen(false);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Inventory Categories</CardTitle>
                        <CardDescription>Organize your products with categories and sub-categories.</CardDescription>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" /> Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>New Category</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Category Name</Label>
                                    <Input
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="e.g. Electronics"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Parent Category (Optional)</Label>
                                    <Select value={parentId} onValueChange={setParentId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="None (Main Category)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="null">None (Main Category)</SelectItem>
                                            {mainCategories?.map((cat: any) => (
                                                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreate}>Create</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {mainCategories?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                No categories created yet.
                            </div>
                        )}
                        {mainCategories?.map((cat: any) => (
                            <div key={cat._id} className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                                    <div className="flex items-center font-semibold">
                                        <Tags className="w-4 h-4 mr-2 text-primary" />
                                        {cat.name}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(cat._id)}>
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                </div>
                                {/* Subcategories */}
                                <div className="ml-8 space-y-2">
                                    {categories?.filter((sub: any) => sub.parentId?._id === cat._id).map((sub: any) => (
                                        <div key={sub._id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-100 text-sm">
                                            <div className="flex items-center">
                                                <ChevronRight className="w-3 h-3 mr-2 text-muted-foreground" />
                                                {sub.name}
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(sub._id)}>
                                                <Trash2 className="w-3 h-3 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
