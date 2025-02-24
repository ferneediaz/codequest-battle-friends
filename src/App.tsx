
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { PartyInvite } from "@/components/PartyInvite";
import Index from "./pages/Index";
import Battle from "./pages/Battle";
import NotFound from "./pages/NotFound";

const MainContent = () => {
  const { open } = useSidebar();
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1">
        {!open && <SidebarTrigger />}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/battle" element={<Battle />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PartyInvite />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <MainContent />
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
