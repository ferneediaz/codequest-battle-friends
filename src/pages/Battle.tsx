import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BattleHealthBar } from "@/components/BattleHealthBar";
import { BattleRoom } from "@/components/battle/BattleRoom";
import { ProblemDescription } from "@/components/battle/ProblemDescription";
import { CodeEditor } from "@/components/battle/CodeEditor";
import { BattleSkills } from "@/components/battle/BattleSkills";
import { useBattleState } from "@/hooks/useBattleState";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { INITIAL_CODE, Language } from "@/types/battle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Battle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId');
  const { toast } = useToast();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const { battleState, useSkill, buyHint } = useBattleState();
  const { code, setCode, handleCodeChange } = useCodeEditor(currentRoom, user?.id);

  const { data: question, isLoading } = useQuery({
    queryKey: ['question', questionId],
    queryFn: async () => {
      if (!questionId) return null;
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
      
      if (error) {
        toast({
          title: "Error loading question",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      if (data) {
        const parsedData = {
          ...data,
          examples: Array.isArray(data.examples) 
            ? data.examples 
            : typeof data.examples === 'string'
              ? JSON.parse(data.examples)
              : []
        };
        
        parsedData.examples = parsedData.examples.map((example: any) => ({
          input: String(example.input || ''),
          output: String(example.output || ''),
          explanation: String(example.explanation || '')
        }));
        
        return parsedData;
      }
      
      return null;
    },
    enabled: !!questionId,
  });

  React.useEffect(() => {
    setCode(INITIAL_CODE[language]);
  }, [language, setCode]);

  if (!questionId || (!isLoading && !question)) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-16">
        <BattleHealthBar />
        <div className="container px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lobby
            </button>
            
            <BattleRoom
              currentRoom={currentRoom}
              setCurrentRoom={setCurrentRoom}
              setCode={setCode}
              initialCode={INITIAL_CODE[language]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {question && (
              <ProblemDescription 
                battleState={battleState}
                useSkill={useSkill}
                buyHint={buyHint}
                question={question}
              />
            )}
            
            <CodeEditor
              code={code}
              language={language}
              onLanguageChange={setLanguage}
              onChange={handleCodeChange}
              currentRoom={currentRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
