import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PartyInvite } from "@/components/PartyInvite";
import { Header } from "@/components/Header";
import { Socrates } from "@/components/Socrates";
import Index from "./pages/Index";
import Battle from "./pages/Battle";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthRequired } from "@/components/AuthRequired";
import BattleRoyale from "./pages/BattleRoyale";

const MainContent = () => {
  const location = useLocation();
  const isBattleRoyalePage = location.pathname === "/battle-royale";

  return (
    <div className="min-h-screen w-full">
      <Header />
      <main className="pt-16">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <AuthRequired>
              <Index />
            </AuthRequired>
          } />
          <Route path="/battle" element={
            <AuthRequired>
              <Battle />
            </AuthRequired>
          } />
          <Route path="/battle-royale" element={<BattleRoyale />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isBattleRoyalePage && (
        <>
          <PartyInvite />
          <Socrates />
        </>
      )}
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
