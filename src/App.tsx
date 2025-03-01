import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PartyInvite } from "@/components/PartyInvite";
import { Header } from "@/components/Header";
import { Socrates } from "@/components/Socrates";
import Index from "./pages/Index";
import Battle from "./pages/Battle";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthRequired } from "@/components/AuthRequired";

const MainContent = () => {
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <PartyInvite />
      <Socrates />
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
