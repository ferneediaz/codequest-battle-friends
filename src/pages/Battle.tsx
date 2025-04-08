
import React, { useState, useEffect } from "react";
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
import { BattleRole, Language, QuestionData } from "@/types/battle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { defaultInitialCode, validParenthesesSolution, reverseStringSolution } from "@/constants/defaultCode";

const Battle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId');
  const { toast: uiToast } = useToast();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const { battleState, useSkill, buyHint } = useBattleState();
  const { code, setCode, handleCodeChange } = useCodeEditor(currentRoom, user?.id);
  const [userRole, setUserRole] = useState<BattleRole>(null);
  const [participants, setParticipants] = useState<{ userId: string, role: BattleRole }[]>([]);

  const { data: question, isLoading } = useQuery<QuestionData>({
    queryKey: ['question', questionId],
    queryFn: async () => {
      if (!questionId) throw new Error('No question ID provided');
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();
      
      if (error) {
        uiToast({
          title: "Error loading question",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Parse test cases and examples
      const parsedTestCases = Array.isArray(data.test_cases) 
        ? data.test_cases.map((tc: any) => ({
            input: tc.input,
            expected: tc.expected
          }))
        : [];

      const parsedExamples = Array.isArray(data.examples)
        ? data.examples.map((ex: any) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation
          }))
        : [];
      
      // Initialize with default code
      let initialCodeObj = defaultInitialCode;
      
      // Check if initial_code is an object and process it
      if (data.initial_code && typeof data.initial_code === 'object' && !Array.isArray(data.initial_code)) {
        const initialCode = data.initial_code as Record<string, any>;
        
        initialCodeObj = {
          javascript: typeof initialCode.javascript === 'string' ? initialCode.javascript : defaultInitialCode.javascript,
          python: typeof initialCode.python === 'string' ? initialCode.python : defaultInitialCode.python,
          cpp: typeof initialCode.cpp === 'string' ? initialCode.cpp : defaultInitialCode.cpp,
          java: typeof initialCode.java === 'string' ? initialCode.java : defaultInitialCode.java,
        };
      } else if (data.title) {
        // Fallback to predefined solutions based on question title
        if (data.title.includes('Valid Parentheses')) {
          initialCodeObj = validParenthesesSolution;
        } else if (data.title.includes('Reverse String')) {
          initialCodeObj = reverseStringSolution;
        }
      }
      
      // Return the transformed data
      const transformedData: QuestionData = {
        id: data.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        initial_code: initialCodeObj,
        test_cases: parsedTestCases,
        examples: parsedExamples,
        constraints: Array.isArray(data.constraints) ? data.constraints : []
      };
      
      return transformedData;
    },
    enabled: !!questionId,
  });

  useEffect(() => {
    if (question && question.initial_code?.[language]) {
      setCode(question.initial_code[language]);
    }
  }, [question, language, setCode]);

  useEffect(() => {
    if (!currentRoom || !user?.id) return;

    const channel = supabase.channel(`battle:${currentRoom}:roles`)
      .on('broadcast', { event: 'role_assigned' }, ({ payload }) => {
        setParticipants(payload.participants);
        
        const currentUserParticipant = payload.participants.find(
          (p: { userId: string }) => p.userId === user.id
        );
        
        if (currentUserParticipant) {
          setUserRole(currentUserParticipant.role);
          
          toast(currentUserParticipant.role === 'explainer' 
            ? "You are the explainer" 
            : "You are the coder", {
            description: currentUserParticipant.role === 'explainer' 
              ? "Explain the problem to your teammate who can't see it!" 
              : "Your teammate will explain the problem to you. Listen carefully!"
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom, user?.id]);

  if (!questionId || (!isLoading && !question)) {
    navigate('/');
    return null;
  }

  const canSeeProblem = !currentRoom || !userRole || userRole === 'explainer';

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
              initialCode={question?.initial_code?.[language] || ""}
              userRole={userRole}
              setUserRole={setUserRole}
              participants={participants}
              setParticipants={setParticipants}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {canSeeProblem ? (
              question && (
                <ProblemDescription 
                  battleState={battleState}
                  useSkill={useSkill}
                  buyHint={buyHint}
                  question={question}
                  userRole={userRole}
                />
              )
            ) : (
              <div className="relative group h-[650px]">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
                <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 h-full flex flex-col items-center justify-center text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">Communication Challenge</h2>
                  <p className="text-lg text-gray-300 mb-6">
                    Your teammate can see the problem, but you can't!
                  </p>
                  <p className="text-gray-400 max-w-md">
                    This is a communication exercise. Your teammate must explain the problem to you clearly
                    so you can help solve it together. Ask questions and collaborate through the code editor.
                  </p>
                </div>
              </div>
            )}
            
            <CodeEditor
              code={code}
              language={language}
              onLanguageChange={setLanguage}
              onChange={handleCodeChange}
              currentRoom={currentRoom}
              question={question}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
