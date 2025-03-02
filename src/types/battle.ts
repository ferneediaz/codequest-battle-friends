import { java } from "@codemirror/lang-java";

export type Language = "javascript" | "python" | "cpp" | "java";

export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  cooldown: number;
  isOnCooldown: boolean;
}

export interface BattleState {
  mana: number;
  maxMana: number;
  gold: number;
  skills: Skill[];
  hints: string[];
  usedHints: string[];
}

export const INITIAL_BATTLE_STATE: BattleState = {
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

// Helper function to pad a code block to a total number of lines.
function padToTotalLines(code: string, totalLines: number): string {
  const currentLineCount = code.split("\n").length;
  const emptyLinesNeeded = totalLines - currentLineCount;
  return code + (emptyLinesNeeded > 0 ? "\n".repeat(emptyLinesNeeded) : "");
}

const totalLines = 40;

// Define base code for each language.
const baseJavascriptCode = `// JavaScript Solution
function isValid(s) {
    // Your solution here
    // Return true if the brackets are valid, false otherwise
}`;

const basePythonCode = `# Python Solution
def is_valid(s):
    # Your solution here
    # Return True if the brackets are valid, False otherwise
    pass`;

const baseCppCode = `// C++ Solution
class Solution {
public:
    bool isValid(string s) {
        // Your solution here
        // Return true if the brackets are valid, false otherwise
    }
};`;

// (Optional) Define base Java code if needed.
const baseJavaCode = `// Java Solution
public class Solution {
    public boolean isValid(String s) {
        // Your solution here
        // Return true if the brackets are valid, false otherwise
        return false;
    }
}`;

// Pad each block to 31 lines.
export const INITIAL_CODE = {
  javascript: padToTotalLines(baseJavascriptCode, totalLines),
  python: padToTotalLines(basePythonCode, totalLines),
  cpp: padToTotalLines(baseCppCode, totalLines),
  java: padToTotalLines(baseJavaCode, totalLines),
};

export const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  cpp: 54,         // C++
  java: 62,
};

export const TEST_CASES = [
  {
    input: "{}[]",
    expected: true
  },
  {
    input: "([)]",
    expected: false
  },
  {
    input: "{[()]}",
    expected: true
  },
  {
    input: "(]",
    expected: false
  }
];

export interface Token {
  text: string;
  type?: 'comment' | 'keyword' | 'type' | 'function' | 'string' | 'number';
}