
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PartyInvite } from "@/components/PartyInvite";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Battle from "./pages/Battle";
import NotFound from "./pages/NotFound";

const MainContent = () => {
  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-16">
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
        <MainContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
