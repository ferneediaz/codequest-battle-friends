
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function Auth() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  async function signInWithGoogle() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error signing in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGithub() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error signing in with GitHub",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030712]">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Welcome to CodeQuest
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to start your coding adventure
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-100"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="mr-2 h-4 w-4"
            />
            Sign in with Google
          </Button>
          <Button
            onClick={signInWithGithub}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
