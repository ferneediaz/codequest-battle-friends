import { useState } from "react";
import { Send, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { generateSocraticQuestion, getStoredApiKey, setStoredApiKey } from "@/functions/socratic-questions";

export const Socrates = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredApiKey() || "");
  const [isSettingKey, setIsSettingKey] = useState(!getStoredApiKey());

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('hf_')) {
      toast({
        title: "Error",
        description: "HuggingFace API keys should start with 'hf_'",
        variant: "destructive",
      });
      return;
    }

    setStoredApiKey(apiKey.trim());
    setIsSettingKey(false);
    toast({
      title: "Success",
      description: "API key has been saved",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput("");
    setIsThinking(true);

    try {
      const question = await generateSocraticQuestion(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: question }]);
    } catch (error) {
      console.error('Error:', error);
      if (!getStoredApiKey()) {
        setIsSettingKey(true);
      }
      toast({
        title: "Error",
        description: "Failed to generate a response. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full p-3 h-12 w-12 bg-primary shadow-lg hover:bg-primary/90"
      >
        <Brain className="h-6 w-6" />
      </Button>

      <div
        className={cn(
          "absolute bottom-16 right-0 w-96 bg-background border border-border rounded-lg shadow-lg transition-all duration-200 ease-in-out overflow-hidden",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <div className="p-4 border-b border-border bg-primary/5">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Socrates - Two Sum Problem Helper</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Share your thoughts or struggles, and I'll help guide you through the Two Sum problem
          </p>
        </div>

        {isSettingKey ? (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Enter your HuggingFace API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="hf_..."
              />
            </div>
            <Button onClick={handleSetApiKey} className="w-full">
              Save API Key
            </Button>
          </div>
        ) : (
          <>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm p-4">
                  <p className="mb-2">I'll help you solve the Two Sum problem using guiding questions.</p>
                  <p className="text-xs">Try saying things like:</p>
                  <ul className="text-xs list-disc list-inside mt-1 space-y-1">
                    <li>"I'm not sure where to start"</li>
                    <li>"How can I make this solution more efficient?"</li>
                    <li>"I'm stuck on handling edge cases"</li>
                  </ul>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2 max-w-[80%]",
                    message.role === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>●</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share your thoughts or questions..."
                  className="flex-1 bg-muted px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isThinking}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
