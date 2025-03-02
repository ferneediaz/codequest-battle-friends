import React from 'react';
import { MessageCircleQuestion, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BattleState } from '@/types/battle';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface ProblemDescriptionProps {
  battleState: BattleState;
  useSkill: (skillId: string) => void;
  buyHint: () => void;
  hintCost?: number;
}

async function fetchQuestion() {
  // For now, we'll fetch a random question
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  battleState,
  useSkill,
  buyHint,
  hintCost = 100
}) => {
  const { data: question, isLoading } = useQuery({
    queryKey: ['question'],
    queryFn: fetchQuestion,
  });

  if (isLoading) {
    return (
      <div className="relative group animate-pulse">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
        <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="h-8 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="h-24 w-full bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{question?.title}</h2>
          <span className="px-2 py-1 text-sm rounded bg-primary/20 text-primary">
            {question?.difficulty}
          </span>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            {question?.description}
          </p>
          
          <h4 className="text-md font-semibold text-primary mb-2">Example:</h4>
          <pre className="bg-black/30 p-4 rounded-md">
            <code className="text-sm text-gray-300">
              Input: nums = [2, 7, 11, 15], target = 9{"\n"}
              Output: [0, 1]{"\n"}
              Explanation: nums[0] + nums[1] = 2 + 7 = 9
            </code>
          </pre>

          <h4 className="text-md font-semibold text-primary mt-4 mb-2">Constraints:</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>2 ≤ nums.length ≤ 104</li>
            <li>-109 ≤ nums[i] ≤ 109</li>
            <li>Only one valid solution exists</li>
          </ul>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Hints</h3>
            <Button onClick={buyHint} variant="outline" className="gap-2">
              <MessageCircleQuestion className="w-4 h-4" />
              Buy Hint ({hintCost} <Coins className="w-4 h-4 text-yellow-400" />)
            </Button>
          </div>
          <div className="space-y-2">
            {battleState.usedHints.map((hint, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-md text-gray-300">
                <Star className="w-4 h-4 text-yellow-400 inline-block mr-2" />
                {hint}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
