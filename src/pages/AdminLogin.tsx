import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText, LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getFriendlyLoginError = (message: string) => {
    const normalized = message.toLowerCase();

    if (normalized.includes("invalid api key") || normalized.includes("apikey")) {
      return "Supabase API key invalid hai. VITE_SUPABASE_PUBLISHABLE_KEY ko current project (zkmmectdbfooeuwyfszi) ke anon key se replace karo.";
    }

    if (normalized.includes("invalid login credentials")) {
      return "Email/password galat hai ya account exist nahi karta. Agar DB reset kiya hai, pehle Supabase Auth me user verify karo.";
    }

    if (normalized.includes("email not confirmed")) {
      return "Email confirm nahi hua hai. Supabase Auth me user verify/confirm karke dubara login karo.";
    }

    if (normalized.includes("failed to fetch") || normalized.includes("network")) {
      return "Supabase se connection fail hua. VITE_SUPABASE_URL aur key ko verify karo.";
    }

    return message;
  };

  useEffect(() => {
    let isMounted = true;

    const checkExistingAdminSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMounted) return;

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData && isMounted) {
        navigate("/admin", { replace: true });
      }
    };

    checkExistingAdminSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      toast({ title: "Login failed", description: "Email aur password required hai.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (error) {
      toast({ title: "Login failed", description: getFriendlyLoginError(error.message), variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Session error", variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) {
      toast({ title: "Admin check failed", description: roleError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (roleData) {
      navigate("/admin");
    } else {
      await supabase.auth.signOut();
      toast({ title: "Access denied", description: "You are not an admin.", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-glass-border">
          <CardHeader className="text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display glow-text">Admin Login</CardTitle>
            <CardDescription>Sign in to manage research papers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-secondary/50 border-glass-border"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-secondary/50 border-glass-border"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Loading..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
