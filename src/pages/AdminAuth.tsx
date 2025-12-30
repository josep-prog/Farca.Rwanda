import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already admin logged in
  if (!authLoading && user && isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error(error.message || "Login failed");
      setLoading(false);
      return;
    }

    // Check admin status
    setTimeout(() => {
      if (isAdmin) {
        toast.success("Welcome Admin!");
        navigate("/admin");
      } else {
        toast.error("You don't have admin access. Please contact the system administrator.");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary/20 mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">BuildMart Admin</h1>
          <p className="text-slate-400">Secure Admin Portal</p>
        </div>

        {/* Alert Box */}
        <div className="mb-6 p-4 rounded-lg bg-blue-900/20 border border-blue-800/50 flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-200">
            This portal is only accessible to authorized administrators.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-8 space-y-6">
          <div>
            <Label htmlFor="email" className="text-slate-300 mb-2 block text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@buildmart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || authLoading}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-slate-300 mb-2 block text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || authLoading}
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              required
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? "Authenticating..." : "Sign In as Admin"}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Not an admin?{" "}
          <a href="/auth" className="text-primary hover:underline font-medium">
            Go to user login
          </a>
        </p>
      </div>
    </div>
  );
}
