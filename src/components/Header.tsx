
import { User, Users, Trophy, Settings, Bell, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="font-semibold text-white">CodeQuest</div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="#profile" className="hover:bg-white/10">
              <User className="h-4 w-4" />
              <span className="sr-only">Profile</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#party" className="hover:bg-white/10">
              <Users className="h-4 w-4" />
              <span className="sr-only">Party</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#leaderboard" className="hover:bg-white/10">
              <Trophy className="h-4 w-4" />
              <span className="sr-only">Leaderboard</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#messages" className="hover:bg-white/10">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Messages</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#notifications" className="hover:bg-white/10">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="#settings" className="hover:bg-white/10">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
