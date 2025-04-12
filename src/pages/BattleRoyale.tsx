import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// RPG-themed battle categories
const BATTLE_CATEGORIES = [
  "Forest of Arrays",
  "Hashmap Dungeons",
  "Binary Search Castle",
  "Linked List Gardens",
  "Tree of Wisdom",
  "Graph Adventures",
  "Dynamic Programming Peaks",
  "Stack & Queue Tavern",
  "Recursion Temple",
  "Sorting Sanctuary",
] as const;

// Sample algorithm snippets for background
const algorithmSnippets = [
  `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
}`,
  `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = [], right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
  `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  `function fibonacci(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,
  `function bfs(graph, start) {
  const queue = [start];
  const visited = new Set([start]);
  while (queue.length > 0) {
    const vertex = queue.shift();
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}`,
  `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}`,
  `function dijkstra(graph, start) {
  const distances = {};
  const visited = new Set();
  const previous = {};
  const nodes = Object.keys(graph);
  
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  
  while (nodes.length) {
    nodes.sort((a, b) => distances[a] - distances[b]);
    const closest = nodes.shift();
    visited.add(closest);
    
    for (const neighbor in graph[closest]) {
      const distance = distances[closest] + graph[closest][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = closest;
      }
    }
  }
  
  return { distances, previous };
}`,
  `function threeSum(nums) {
  const result = [];
  nums.sort((a, b) => a - b);
  
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;
    
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      }
    }
  }
  
  return result;
}`,
  `function kmp(text, pattern) {
  if (pattern.length === 0) return 0;
  
  // Compute longest prefix suffix values
  const lps = [0];
  let prefixIndex = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[prefixIndex]) {
      prefixIndex++;
      lps[i] = prefixIndex;
      i++;
    } else if (prefixIndex === 0) {
      lps[i] = 0;
      i++;
    } else {
      prefixIndex = lps[prefixIndex - 1];
    }
  }
  
  // Find pattern in text
  i = 0;
  let j = 0;
  const matches = [];
  
  while (i < text.length) {
    if (pattern[j] === text[i]) {
      i++;
      j++;
    }
    
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }
  
  return matches;
}`,
  `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`,
  `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  
  return result;
}`,
  `function longestPalindrome(s) {
  if (!s || s.length < 1) return "";
  
  let start = 0;
  let maxLength = 1;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const currentLength = right - left + 1;
      if (currentLength > maxLength) {
        maxLength = currentLength;
        start = left;
      }
      left--;
      right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i); // Odd length
    expandAroundCenter(i, i + 1); // Even length
  }
  
  return s.substring(start, start + maxLength);
}`
];

// RPG-themed emoji mapping
const categoryEmojis: Record<string, string> = {
  "Forest of Arrays": "🌲",
  "Hashmap Dungeons": "🗝️",
  "Binary Search Castle": "🏰",
  "Linked List Gardens": "⛓️",
  "Tree of Wisdom": "🌳",
  "Graph Adventures": "🗺️",
  "Dynamic Programming Peaks": "⛰️",
  "Stack & Queue Tavern": "🍺",
  "Recursion Temple": "🏯",
  "Sorting Sanctuary": "⚔️",
};

const BattleRoyale = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Code snippets in background */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {algorithmSnippets.map((snippet, i) => (
          <div 
            key={i}
            className="absolute text-xs font-mono whitespace-pre"
            style={{
              top: `${(i * 9) % 100}%`,
              left: `${(i * 15) % 100}%`,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
              animation: `float-code ${Math.random() * 60 + 60}s linear infinite`,
              animationDelay: `${i * 3}s`,
              maxWidth: '300px',
              color: i % 3 === 0 ? '#a5b4fc' : i % 3 === 1 ? '#93c5fd' : '#bae6fd',
            }}
          >
            {snippet}
          </div>
        ))}
      </div>

      {/* Fantasy-themed floating elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
            }}
          />
        ))}
      </div>
      
      {/* Magical aura effects */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Logo with magical glow */}
          <div className="flex justify-center mb-8">
            <img 
              src="/secondspacelogo-white.svg" 
              alt="Second Space" 
              className="h-20 mb-6 animate-glow" 
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.4))', 
                maxWidth: '100%' 
              }}
            />
          </div>

          {/* Epic title with fantasy styling */}
          <div className="text-center mb-12 opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 0.6s forwards' }}>
            <div className="mb-2">
              <span className="inline-block px-4 py-1 bg-indigo-900/40 rounded-full text-xs font-semibold text-indigo-300 border border-indigo-700/50">
                LEGENDARY EVENT
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Algorithm Battle Royale
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Enter the mystical realm where code warriors battle for glory and eternal fame!
            </p>
          </div>

          {/* Ancient scroll/parchment-like card */}
          <div className="mb-16 opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 0.6s 0.2s forwards' }}>
            <Card className="p-8 bg-slate-900/60 backdrop-blur-sm border-slate-700/30 shadow-xl overflow-hidden relative">
              {/* Scroll decoration */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              
              <div className="flex flex-col md:flex-row gap-8 relative z-10">
                {/* Left side: Quest/Instructions */}
                <div className="flex-1">
                  <Badge className="mb-3 bg-indigo-600 hover:bg-indigo-700 animate-pulse">ROYAL DECREE</Badge>
                  <h2 className="text-3xl font-bold mb-6 text-white font-medieval">The Ancient Rules</h2>
                  <div className="space-y-4 text-slate-300">
                    <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-lg flex-shrink-0 shadow-inner shadow-indigo-500/20">
                        I
                      </div>
                      <p>Brave warriors face a new algorithmic trial each round.</p>
                    </div>
                    <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-lg flex-shrink-0 shadow-inner shadow-indigo-500/20">
                        II
                      </div>
                      <p>Those with the fewest correct answers are banished from the realm.</p>
                    </div>
                    <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-lg flex-shrink-0 shadow-inner shadow-indigo-500/20">
                        III
                      </div>
                      <p>The most skilled warrior shall choose the next battleground.</p>
                    </div>
                    <div className="flex items-start gap-3 hover:translate-x-1 transition-transform duration-300">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-lg flex-shrink-0 shadow-inner shadow-indigo-500/20">
                        IV
                      </div>
                      <p>The last coder standing claims the legendary prize!</p>
                    </div>
                  </div>
                </div>
                
                {/* Right side: Legendary Realms */}
                <div className="flex-1 border-l border-indigo-700/30 pl-8">
                  <h2 className="text-3xl font-bold mb-6 text-white font-medieval">Mythical Realms</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {BATTLE_CATEGORIES.slice(0, 8).map((category, index) => (
                      <div key={index} className="rounded-lg bg-gradient-to-br from-slate-800 to-indigo-950 p-4 border border-indigo-700/30 hover:scale-105 transition-transform duration-300 hover:border-indigo-600/50 hover:shadow-lg hover:shadow-indigo-900/10">
                        <span className="text-2xl">{categoryEmojis[category] || '🧙'}</span>
                        <h3 className="font-medium text-white mt-2 text-sm">{category}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Epic call-to-action */}
          <div className="text-center opacity-0 animate-fadeIn" style={{ animation: 'fadeIn 0.8s 0.4s forwards' }}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-12 py-6 text-lg rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group border border-indigo-500/20"
            >
              <span className="relative z-10 font-medieval">Join the Epic Quest</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
            <p className="mt-4 text-slate-400">
              The ancient tournament begins soon — prepare your spells and algorithms!
            </p>
          </div>

          {/* Royal seal */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-full bg-slate-800/30 backdrop-blur-sm text-blue-300 text-sm border border-indigo-700/20 hover:border-indigo-600/40 transition-all duration-300">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.4 0 2.8 1.1 2.8 2.5V11c.6 0 1.2.6 1.2 1.3v3.5c0 .6-.6 1.2-1.3 1.2H9.2c-.6 0-1.2-.6-1.2-1.3v-3.5c0-.6.6-1.2 1.2-1.2v-1.5C9.2 8.1 10.6 7 12 7zm0 1.2c-.8 0-1.5.5-1.5 1.3V11h3v-1.5c0-.8-.7-1.3-1.5-1.3z" />
              </svg>
              <span>Second Space Royal Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fantasy animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) translateX(0); }
            50% { transform: translateY(-200px) translateX(200px); }
            100% { transform: translateY(-400px) translateX(0); opacity: 0; }
          }
          @keyframes float-code {
            0% { transform: translateY(0) translateX(0) rotate(${Math.random() * 10 - 5}deg); }
            100% { transform: translateY(-2000px) translateX(${Math.random() * 1000 - 500}px) rotate(${Math.random() * 20 - 10}deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.4)); }
            50% { filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.7)); }
            100% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.4)); }
          }
          .animate-glow {
            animation: glow 3s ease-in-out infinite;
          }
          .animate-pulse {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
          .bg-grid-pattern {
            background-image: linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          .font-medieval {
            font-family: 'Cinzel', serif, system-ui;
          }
        `}
      </style>
    </div>
  );
};

export default BattleRoyale; 