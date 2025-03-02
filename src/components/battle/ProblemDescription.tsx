
import React from 'react';
import { MessageCircleQuestion, Star, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProblemDescriptionProps {
  usedHints: string[];
  onBuyHint: () => void;
  hintCost: number;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  usedHints,
  onBuyHint,
  hintCost
}) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
      <div className="relative p-6 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Forest of Arrays</h2>
        <div className="prose prose-invert max-w-none">
          <h3 className="text-lg font-semibold text-primary mb-2">Problem Description</h3>
          <p className="text-gray-300 mb-4">
            Given an array of integers, find the two numbers that add up to the target sum.
            Return their indices in an array.
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
            <Button onClick={onBuyHint} variant="outline" className="gap-2">
              <MessageCircleQuestion className="w-4 h-4" />
              Buy Hint ({hintCost} <Coins className="w-4 h-4 text-yellow-400" />)
            </Button>
          </div>
          <div className="space-y-2">
            {usedHints.map((hint, index) => (
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
