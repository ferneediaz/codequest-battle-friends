
import React from 'react';
import { MessageCircleQuestion, Star, Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BattleRole, BattleState } from '@/types/battle';
import { AlertCircle } from 'lucide-react';

interface ProblemDescriptionProps {
  battleState: BattleState;
  useSkill: (skillId: string) => void;
  buyHint: () => void;
  question: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    examples: Array<{
      input: string;
      output: string;
      explanation: string;
    }>;
    constraints: string[];
  };
  hintCost?: number;
  userRole?: BattleRole;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  battleState,
  useSkill,
  buyHint,
  question,
  hintCost = 100,
  userRole
}) => {
  if (!question) {
    return null;
  }

  return (
    <div className="relative group h-[650px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 h-full overflow-y-auto">
        {userRole === 'explainer' && (
          <div className="bg-accent/10 border border-accent/30 rounded-md p-3 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-accent mb-1">Communication Challenge</h4>
              <p className="text-sm text-gray-300">
                Your teammate cannot see this problem description. 
                You need to explain the problem clearly so they can help solve it.
              </p>
            </div>
          </div>
        )}
      
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{question.title}</h2>
          <span className="px-2 py-1 text-sm rounded bg-primary/20 text-primary">
            {question.difficulty}
          </span>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">
            {question.description}
          </p>
          
          <h4 className="text-md font-semibold text-primary mb-2">Examples:</h4>
          {question.examples?.map((example, index) => (
            <div key={index} className="mb-4">
              <pre className="bg-black/30 p-4 rounded-md">
                <code className="text-sm text-gray-300">
                  Input: {example.input} {"\n"}
                  Output: {example.output} {"\n"}
                  {example.explanation && `Explanation: ${example.explanation}`}
                </code>
              </pre>
            </div>
          ))}

          {question.constraints && question.constraints.length > 0 && (
            <>
              <h4 className="text-md font-semibold text-primary mt-4 mb-2">Constraints:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {question.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </>
          )}
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
