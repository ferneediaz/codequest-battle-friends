
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

export const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  cpp: 54,         // C++
  java: 62,
};

export interface TestCase {
  input: any;
  expected: any;
}

export interface QuestionData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  initial_code: Record<Language, string>;
  test_cases: TestCase[];
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
}
