
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { User, Users, Trophy, Settings, Bell, MessageSquare, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export function AppSidebar() {
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();
  const isBattlePage = location.pathname === "/battle";

  if (isBattlePage) {
    return null;
  }

  return (
    <div className="relative">
      {/* Sidebar */}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-3">
              <SidebarGroupLabel className="text-base font-semibold">Menu</SidebarGroupLabel>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleSidebar}
              >
                {open ? <Menu className="h-4 w-4 rotate-90" /> : <Menu className="h-4 w-4" />}
                <span className="sr-only">{open ? 'Close' : 'Open'} Sidebar</span>
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#profile" className="flex items-center gap-3">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#party" className="flex items-center gap-3">
                      <Users className="h-4 w-4" />
                      <span>Party</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#leaderboard" className="flex items-center gap-3">
                      <Trophy className="h-4 w-4" />
                      <span>Leaderboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#messages" className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4" />
                      <span>Messages</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#notifications" className="flex items-center gap-3">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#settings" className="flex items-center gap-3">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
