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
import { Language, QuestionData } from "@/types/battle";
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
        toast({
          title: "Error loading question",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      const defaultInitialCode = {
        javascript: `function solution(nums, target) {
  // Write your solution here
  // nums: number[] - Array of integers
  // target: number - Target sum to find
  // return: number[] - Array of two indices that sum to target
}`,
        python: `def solution(nums, target):
    # Write your solution here
    # nums: List[int] - Array of integers
    # target: int - Target sum to find
    # return: List[int] - Array of two indices that sum to target
    pass`,
        cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        // nums: vector<int> - Array of integers
        // target: int - Target sum to find
        // return: vector<int> - Array of two indices that sum to target
    }
};`,
        java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        // nums: int[] - Array of integers
        // target: int - Target sum to find
        // return: int[] - Array of two indices that sum to target
        return new int[]{};
    }
}`
      };
      
      const transformedData: QuestionData = {
        id: data.id,
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        initial_code: data.initial_code || {
          javascript: defaultInitialCode.javascript,
          python: defaultInitialCode.python,
          cpp: defaultInitialCode.cpp,
          java: defaultInitialCode.java
        },
        test_cases: (data.test_cases || []).map((tc: any) => ({
          input: tc.input,
          expected: tc.expected
        })),
        examples: (data.examples || []).map((ex: any) => ({
          input: ex.input,
          output: ex.output,
          explanation: ex.explanation
        })),
        constraints: data.constraints || []
      };
      
      return transformedData;
    },
    enabled: !!questionId,
  });

  useEffect(() => {
    if (question?.initial_code?.[language]) {
      setCode(question.initial_code[language]);
    }
  }, [question, language, setCode]);

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
              initialCode={question?.initial_code?.[language] || ""}
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
              question={question}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
