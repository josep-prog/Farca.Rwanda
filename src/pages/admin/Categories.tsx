import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    icon: "",
    color: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon || "",
        color: category.color || "",
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        icon: "",
        color: "",
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        icon: formData.icon || null,
        color: formData.color || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);

        if (error) throw error;
        toast.success("Category created successfully");
      }

      setOpenDialog(false);
      fetchCategories();
    } catch (error: any) {
      if (error.code === "23505") {
        toast.error("Category name or slug already exists");
      } else {
        toast.error(
          editingCategory
            ? "Failed to update category"
            : "Failed to create category"
        );
      }
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Categories Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-white">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-slate-300">Category Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Tiles"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="e.g., tiles"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Icon (optional)</Label>
                  <Input
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="e.g., grid-3x3"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Color (optional)</Label>
                  <Input
                    type="color"
                    value={formData.color || "#3b82f6"}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="bg-slate-700 border-slate-600 text-white h-10"
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {editingCategory ? "Update" : "Create"} Category
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="bg-slate-800 border-slate-700 p-6 hover:bg-slate-700/50 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {category.name}
                    </h3>
                    <p className="text-slate-400 text-sm">/{category.slug}</p>
                  </div>
                  {category.color && (
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-slate-600"
                      style={{ backgroundColor: category.color }}
                    ></div>
                  )}
                </div>

                {category.icon && (
                  <p className="text-slate-400 text-sm mb-4">
                    Icon: <span className="text-white">{category.icon}</span>
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(category)}
                    className="flex-1 text-blue-400 hover:bg-slate-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="flex-1 text-red-400 hover:bg-slate-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-slate-400">
              {loading ? "Loading..." : "No categories found"}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
