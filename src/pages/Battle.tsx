import React, { useState } from "react";
import { ArrowLeft, Check, Coins, Wand, Star, MessageCircleQuestion, Zap, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const INITIAL_CODE = {
  javascript: `// JavaScript Solution
function solution(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  python: `# Python Solution
def solution(nums, target):
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`,
  cpp: `// C++ Solution
#include <vector>
#include <unordered_map>

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`
};

const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  cpp: 54,         // C++
};

const TEST_CASES = [
  {
    input: {
      nums: [2, 7, 11, 15],
      target: 9
    },
    expected: [0, 1]
  },
  {
    input: {
      nums: [3, 2, 4],
      target: 6
    },
    expected: [1, 2]
  }
];

type Language = "javascript" | "python" | "cpp";

type Token = {
  text: string;
  type?: 'comment' | 'keyword' | 'type' | 'function' | 'string' | 'number';
};

interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  isOnCooldown: boolean;
}

interface BattleState {
  mana: number;
  maxMana: number;
  gold: number;
  skills: Skill[];
  hints: string[];
  usedHints: string[];
}

const INITIAL_BATTLE_STATE: BattleState = {
  mana: 100,
  maxMana: 100,
  gold: 500,
  skills: [
    {
      id: "debug",
      name: "Debug Insight",
      description: "Highlights potential bugs in your code",
      manaCost: 30,
      cooldown: 30,
      isOnCooldown: false,
    },
    {
      id: "optimize",
      name: "Code Optimizer",
      description: "Suggests optimizations for your solution",
      manaCost: 50,
      cooldown: 60,
      isOnCooldown: false,
    },
    {
      id: "timeFreeze",
      name: "Time Freeze",
      description: "Pauses the battle timer for 30 seconds",
      manaCost: 70,
      cooldown: 120,
      isOnCooldown: false,
    },
  ],
  hints: [
    "Consider using a hash map to optimize lookup times",
    "Try using two pointers to solve this more efficiently",
    "Think about edge cases with duplicate numbers",
  ],
  usedHints: [],
};

const HINT_COST = 100; // Gold cost for revealing a hint

const Battle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setOpen } = useSidebar();
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(INITIAL_CODE[language]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [battleState, setBattleState] = useState<BattleState>(INITIAL_BATTLE_STATE);

  React.useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(INITIAL_CODE[newLang]);
  };

  const createTestWrapper = (lang: Language, code: string, testCase: typeof TEST_CASES[0]) => {
    switch (lang) {
      case 'javascript':
        return `
${code}
const nums = ${JSON.stringify(testCase.input.nums)};
const target = ${testCase.input.target};
console.log(JSON.stringify(solution(nums, target)));`;
      case 'python':
        return `
${code}
nums = ${JSON.stringify(testCase.input.nums)}
target = ${testCase.input.target}
print(solution(nums, target))`;
      case 'cpp':
        return `
#include <iostream>
#include <string>
${code}
int main() {
    Solution s;
    vector<int> nums = ${JSON.stringify(testCase.input.nums).replace('[', '{').replace(']', '}')};
    int target = ${testCase.input.target};
    vector<int> result = s.solution(nums, target);
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`;
    }
  };

  const submitToJudge0 = async (sourceCode: string, languageId: number) => {
    try {
      const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key': 'YOUR-RAPIDAPI-KEY', // Replace with your RapidAPI key
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: languageId,
          stdin: '',
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        if (submitResponse.status === 403) {
          throw new Error('Judge0 API subscription required. Please check your API key.');
        } else if (submitResponse.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else {
          throw new Error(errorData.message || 'Failed to submit code.');
        }
      }

      const { token } = await submitResponse.json();
      if (!token) {
        throw new Error('No submission token received.');
      }

      let result;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': 'YOUR-RAPIDAPI-KEY', // Replace with your RapidAPI key
          },
        });

        if (!resultResponse.ok) {
          const errorData = await resultResponse.json();
          throw new Error(errorData.message || 'Failed to get submission results.');
        }

        result = await resultResponse.json();
        attempts++;

        if (attempts >= maxAttempts) {
          throw new Error('Execution timed out. Please try again.');
        }
      } while (result.status?.description === 'Processing');

      return result;
    } catch (error: any) {
      console.error('Error submitting to Judge0:', error);
      throw error;
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const testCase = TEST_CASES[0];
      const wrappedCode = createTestWrapper(language, code, testCase);
      const result = await submitToJudge0(wrappedCode, LANGUAGE_IDS[language]);

      if (result.status.id === 3) {
        const output = result.stdout?.trim();
        const expectedOutput = JSON.stringify(testCase.expected);
        
        if (output === expectedOutput) {
          toast({
            title: "Test Passed! ✅",
            description: "Your solution passed the sample test case.",
          });
        } else {
          toast({
            title: "Test Failed ❌",
            description: `Expected ${expectedOutput}, but got ${output}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: result.stderr || result.compile_output || "An error occurred while running your code.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to run the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let allPassed = true;
      
      for (const testCase of TEST_CASES) {
        const wrappedCode = createTestWrapper(language, code, testCase);
        const result = await submitToJudge0(wrappedCode, LANGUAGE_IDS[language]);

        if (result.status.id !== 3 || 
            result.stdout?.trim() !== JSON.stringify(testCase.expected)) {
          allPassed = false;
          break;
        }
      }

      if (allPassed) {
        toast({
          title: "All Tests Passed! 🎉",
          description: "Congratulations! Your solution passed all test cases.",
        });
      } else {
        toast({
          title: "Some Tests Failed",
          description: "Your solution didn't pass all test cases. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit the code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tokenizeLine = (line: string): Token[] => {
    const tokens: Token[] = [];
    let currentToken = '';

    const addToken = (type?: Token['type']) => {
      if (currentToken) {
        tokens.push({ text: currentToken, type });
        currentToken = '';
      }
    };

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if ((char === '/' && line[i + 1] === '/') || char === '#') {
        addToken();
        tokens.push({ text: line.slice(i), type: 'comment' });
        break;
      }

      if (char === '"') {
        addToken();
        let stringContent = char;
        i++;
        while (i < line.length && line[i] !== '"') {
          stringContent += line[i];
          i++;
        }
        if (i < line.length) stringContent += line[i];
        tokens.push({ text: stringContent, type: 'string' });
        continue;
      }

      if (/\w/.test(char)) {
        currentToken += char;
      } else {
        if (currentToken) {
          if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
            addToken('keyword');
          } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
            addToken('type');
          } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
            addToken('function');
          } else if (/^\d+$/.test(currentToken)) {
            addToken('number');
          } else {
            addToken();
          }
        }
        tokens.push({ text: char });
        currentToken = '';
      }
    }

    if (currentToken) {
      if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
        addToken('keyword');
      } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
        addToken('type');
      } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
        addToken('function');
      } else if (/^\d+$/.test(currentToken)) {
        addToken('number');
      } else {
        addToken();
      }
    }

    return tokens;
  };

  const getTokenColor = (type?: Token['type']): string => {
    switch (type) {
      case 'comment': return '#6A9955';
      case 'keyword': return '#C586C0';
      case 'type': return '#4EC9B0';
      case 'function': return '#DCDCAA';
      case 'string': return '#CE9178';
      case 'number': return '#B5CEA8';
      default: return '#D4D4D4';
    }
  };

  const useSkill = (skill: Skill) => {
    if (skill.isOnCooldown) {
      toast({
        title: "Skill on Cooldown",
        description: "This skill is still recharging...",
        variant: "destructive",
      });
      return;
    }

    if (battleState.mana < skill.manaCost) {
      toast({
        title: "Not Enough Mana",
        description: "You need more mana to use this skill!",
        variant: "destructive",
      });
      return;
    }

    switch (skill.id) {
      case "debug":
        toast({
          title: "Debug Insight Activated",
          description: "Looking for potential bugs in your code...",
        });
        break;
      case "optimize":
        toast({
          title: "Code Optimizer Activated",
          description: "Analyzing your code for optimization opportunities...",
        });
        break;
      case "timeFreeze":
        toast({
          title: "Time Freeze Activated",
          description: "Battle timer paused for 30 seconds!",
        });
        break;
    }

    setBattleState(prev => ({
      ...prev,
      mana: prev.mana - skill.manaCost,
      skills: prev.skills.map(s => 
        s.id === skill.id 
          ? { ...s, isOnCooldown: true }
          : s
      ),
    }));

    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        skills: prev.skills.map(s =>
          s.id === skill.id
            ? { ...s, isOnCooldown: false }
            : s
        ),
      }));
    }, skill.cooldown * 1000);
  };

  const buyHint = () => {
    if (battleState.hints.length === battleState.usedHints.length) {
      toast({
        title: "No More Hints",
        description: "You've already unlocked all available hints!",
        variant: "destructive",
      });
      return;
    }

    if (battleState.gold < HINT_COST) {
      toast({
        title: "Not Enough Gold",
        description: `You need ${HINT_COST} gold to unlock a hint!`,
        variant: "destructive",
      });
      return;
    }

    const unusedHints = battleState.hints.filter(
      hint => !battleState.usedHints.includes(hint)
    );
    const newHint = unusedHints[0];

    setBattleState(prev => ({
      ...prev,
      gold: prev.gold - HINT_COST,
      usedHints: [...prev.usedHints, newHint],
    }));

    toast({
      title: "Hint Unlocked!",
      description: newHint,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const { selectionStart, selectionEnd } = e.currentTarget;
      const currentValue = e.currentTarget.value;
      
      const newValue = 
        currentValue.substring(0, selectionStart) + 
        "  " + 
        currentValue.substring(selectionEnd);
      
      setCode(newValue);
      
      requestAnimationFrame(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lobby
          </button>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400">{battleState.mana}/{battleState.maxMana}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400">{battleState.gold}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <h3 className="text-lg font-semibold text-primary mb-4">Battle Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <TooltipProvider>
                    {battleState.skills.map((skill) => (
                      <Tooltip key={skill.id}>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => useSkill(skill)}
                            className="relative h-10 w-full flex items-center justify-between gap-2 px-3"
                            variant={skill.isOnCooldown ? "secondary" : "default"}
                            disabled={skill.isOnCooldown || battleState.mana < skill.manaCost}
                          >
                            <div className="flex items-center gap-2">
                              <Wand className="w-4 h-4 shrink-0" />
                              <span className="font-medium">{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-blue-400">{skill.manaCost} MP</span>
                              <Info className="w-4 h-4 opacity-50" />
                            </div>
                            {skill.isOnCooldown && (
                              <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                Recharging...
                              </div>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]">
                          <p>{skill.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">Hints</h3>
                  <Button onClick={buyHint} variant="outline" className="gap-2">
                    <MessageCircleQuestion className="w-4 h-4" />
                    Buy Hint ({HINT_COST} <Coins className="w-4 h-4 text-yellow-400" />)
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

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30"></div>
            <div className="relative h-full bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                  <Select value={language} onValueChange={(value: Language) => handleLanguageChange(value)}>
                    <SelectTrigger className="w-[140px] bg-black/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border border-white/10">
                      <SelectItem value="javascript" className="text-white hover:bg-gray-800">JavaScript</SelectItem>
                      <SelectItem value="python" className="text-white hover:bg-gray-800">Python</SelectItem>
                      <SelectItem value="cpp" className="text-white hover:bg-gray-800">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    className="px-4 py-2 bg-muted hover:bg-muted/90 text-muted-foreground rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                  >
                    <svg className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    {isRunning ? 'Running...' : 'Run'}
                  </button>
                  <button 
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={isRunning || isSubmitting}
                  >
                    <Check className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
              <div className="relative w-full h-[500px]">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="absolute inset-0 w-full h-full bg-[#1E1E1E] font-mono p-4 text-[#D4D4D4] text-sm leading-6 resize-none outline-none"
                  style={{ 
                    tabSize: 2,
                    color: 'transparent',
                    caretColor: '#D4D4D4',
                    WebkitTextFillColor: 'transparent',
                    background: '#1E1E1E'
                  }}
                />
                <pre
                  className="absolute inset-0 w-full h-full pointer-events-none font-mono p-4 text-sm leading-6 overflow-auto"
                  aria-hidden="true"
                >
                  <code>
                    {code.split('\n').map((line, i) => (
                      <div key={i} className="min-h-[1.5em]">
                        {tokenizeLine(line).map((token, j) => (
                          <span key={j} style={{ color: getTokenColor(token.type) }}>
                            {token.text}
                          </span>
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
