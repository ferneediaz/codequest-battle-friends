
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_CODE = {
  javascript: `function solution() {\n  // Write your code here\n}`,
  python: `def solution():\n    # Write your code here\n    pass`,
  cpp: `#include <vector>\n\nclass Solution {\npublic:\n    vector<int> solution() {\n        // Write your code here\n    }\n};`,
};

type Language = "javascript" | "python" | "cpp";

const Battle = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(INITIAL_CODE[language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(INITIAL_CODE[newLang]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lobby
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Panel */}
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
            </div>
          </div>

          {/* Code Editor Panel */}
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
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button 
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors flex items-center gap-2"
                  onClick={() => console.log("Running code...")}
                >
                  <Check className="w-4 h-4" />
                  Run Code
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] bg-transparent text-gray-300 font-mono p-4 focus:outline-none"
                spellCheck="false"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
