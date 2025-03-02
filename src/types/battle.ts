export type Language = "javascript" | "python" | "cpp";

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

export const INITIAL_CODE = {
  javascript: `// JavaScript Solution
function solution(nums, target) {
  const map = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (complement in map) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
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

export const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  cpp: 54,         // C++
};

export const TEST_CASES = [
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

export interface Token {
  text: string;
  type?: 'comment' | 'keyword' | 'type' | 'function' | 'string' | 'number';
}
