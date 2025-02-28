
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
}

interface QuestionSelectDialogProps {
  open: boolean;
  onClose: () => void;
  onQuestionSelect: (questionId: string) => void;
}

const QuestionSelectDialog = ({ open, onClose, onQuestionSelect }: QuestionSelectDialogProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch questions when dialog opens
  useState(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('difficulty', { ascending: true });

        if (error) throw error;
        setQuestions(data || []);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Question</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-4">
            {questions.map((question) => (
              <div
                key={question.id}
                className="group relative cursor-pointer"
                onClick={() => onQuestionSelect(question.id)}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 group-hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="text-sm text-gray-400">{question.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{question.title}</h3>
                  <p className="text-sm text-gray-400">{question.description}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSelectDialog;
