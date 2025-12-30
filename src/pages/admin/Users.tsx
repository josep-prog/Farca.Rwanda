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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Search, Shield, User } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

interface UserRole {
  user_id: string;
  role: "admin" | "user";
}

interface UserWithRole {
  profile: UserProfile;
  role: "admin" | "user";
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
        const userRole = (roles || []).find((r) => r.user_id === profile.id);
        return {
          profile: profile as UserProfile,
          role: userRole?.role || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = (user: UserWithRole) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenDialog(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingUserId(selectedUser.profile.id);

      // Check if role record exists
      const { data: existingRole, error: checkError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", selectedUser.profile.id)
        .maybeSingle();

      if (checkError && checkError.code !== "PGRST116") throw checkError;

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role: newRole })
          .eq("user_id", selectedUser.profile.id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert([{ user_id: selectedUser.profile.id, role: newRole }]);

        if (error) throw error;
      }

      toast.success(
        `User role updated to ${newRole === "admin" ? "Admin" : "User"}`
      );
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteRole = async (userId: string) => {
    if (!confirm("Are you sure you want to remove admin privileges from this user?")) return;

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("User role removed");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to remove user role");
      console.error(error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.profile.email.toLowerCase().includes(search.toLowerCase()) ||
      u.profile.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Users & Roles Management">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((userWithRole) => (
                    <tr
                      key={userWithRole.profile.id}
                      className="hover:bg-slate-700/30 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {userWithRole.profile.full_name || "Unknown"}
                          </p>
                          {userWithRole.profile.phone && (
                            <p className="text-slate-400 text-sm">
                              {userWithRole.profile.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {userWithRole.profile.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            userWithRole.role === "admin"
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {userWithRole.role === "admin" ? (
                            <Shield className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          {userWithRole.role === "admin" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(userWithRole.profile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleChangeRole(userWithRole)}
                          className="text-blue-400 hover:bg-slate-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {userWithRole.role === "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteRole(userWithRole.profile.id)
                            }
                            className="text-red-400 hover:bg-slate-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      {loading ? "Loading..." : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>
              Change Role - {selectedUser?.profile.full_name || selectedUser?.profile.email}
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label className="text-slate-400 text-xs uppercase">
                  Email
                </Label>
                <p className="text-white">{selectedUser.profile.email}</p>
              </div>

              <div>
                <Label className="text-slate-300 mb-2 block">New Role</Label>
                <Select value={newRole} onValueChange={(value: any) => setNewRole(value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="user" className="text-white">
                      User
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-slate-400 text-sm">
                Current role:{" "}
                <span className="text-white font-medium capitalize">
                  {selectedUser.role}
                </span>
              </p>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateRole}
                  disabled={updatingUserId === selectedUser.profile.id}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updatingUserId === selectedUser.profile.id
                    ? "Updating..."
                    : "Update Role"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
