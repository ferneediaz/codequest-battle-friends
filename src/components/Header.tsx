
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">
            CodeQuest
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-white/80">
                  {user.email}
                </span>
                <Button onClick={signOut} variant="ghost" className="text-white">
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" className="text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
