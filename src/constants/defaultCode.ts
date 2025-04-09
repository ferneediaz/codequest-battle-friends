export const defaultInitialCode = {
  javascript: `function solution(nums, target) {
  // Write your solution here
  // nums: number[] - Array of integers
  // target: number - Target sum to find
  // return: number[] - Array of two indices that sum to target
  
  /* SOLUTION - uncomment to see the answer
  const numMap = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    
    numMap.set(nums[i], i);
  }
  
  return [-1, -1]; // No solution found
  */
}`,
  python: `def solution(nums, target):
    # Write your solution here
    # nums: List[int] - Array of integers
    # target: int - Target sum to find
    # return: List[int] - Array of two indices that sum to target
    
    ''' SOLUTION - uncomment to see the answer
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
            
        num_map[num] = i
        
    return [-1, -1]  # No solution found
    '''
    pass`,
  cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your solution here
        // nums: vector<int> - Array of integers
        // target: int - Target sum to find
        // return: vector<int> - Array of two indices that sum to target
        
        /* SOLUTION - uncomment to see the answer
        unordered_map<int, int> num_map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (num_map.find(complement) != num_map.end()) {
                return {num_map[complement], i};
            }
            
            num_map[nums[i]] = i;
        }
        
        return {-1, -1}; // No solution found
        */
        return {};
    }
};`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your solution here
        // nums: int[] - Array of integers
        // target: int - Target sum to find
        // return: int[] - Array of two indices that sum to target
        
        /* SOLUTION - uncomment to see the answer
        HashMap<Integer, Integer> numMap = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (numMap.containsKey(complement)) {
                return new int[] {numMap.get(complement), i};
            }
            
            numMap.put(nums[i], i);
        }
        
        return new int[] {-1, -1}; // No solution found
        */
        return new int[]{};
    }
}`
};

// Solutions for Valid Parentheses problem
export const validParenthesesSolution = {
  javascript: `function solution(s) {
  // Write your solution here
  // s: string - String containing only the characters '(', ')', '{', '}', '[' and ']'
  // return: boolean - Return true if the input string is valid, false otherwise
  
  /* SOLUTION - uncomment to see the answer
  const stack = [];
  const mapping = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  
  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    
    if (char in mapping) {
      const topElement = stack.pop() || '#';
      
      if (mapping[char] !== topElement) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }
  
  return stack.length === 0;
  */
  
  return false;
}`,
  python: `def solution(s):
    # Write your solution here
    # s: str - String containing only the characters '(', ')', '{', '}', '[' and ']'
    # return: bool - Return true if the input string is valid, false otherwise
    
    ''' SOLUTION - uncomment to see the answer
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0
    '''
    
    return False`,
  cpp: `class Solution {
public:
    bool solution(string s) {
        // Write your solution here
        // s: string - String containing only the characters '(', ')', '{', '}', '[' and ']'
        // return: bool - Return true if the input string is valid, false otherwise
        
        /* SOLUTION - uncomment to see the answer
        stack<char> stk;
        map<char, char> mapping = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };
        
        for (char c : s) {
            if (mapping.find(c) != mapping.end()) {
                char top = stk.empty() ? '#' : stk.top();
                
                if (top != mapping[c]) {
                    return false;
                }
                
                stk.pop();
            } else {
                stk.push(c);
            }
        }
        
        return stk.empty();
        */
        
        return false;
    }
};`,
  java: `class Solution {
    public boolean solution(String s) {
        // Write your solution here
        // s: String - String containing only the characters '(', ')', '{', '}', '[' and ']'
        // return: boolean - Return true if the input string is valid, false otherwise
        
        /* SOLUTION - uncomment to see the answer
        Stack<Character> stack = new Stack<>();
        HashMap<Character, Character> mapping = new HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (mapping.containsKey(c)) {
                char topElement = stack.empty() ? '#' : stack.pop();
                
                if (topElement != mapping.get(c)) {
                    return false;
                }
            } else {
                stack.push(c);
            }
        }
        
        return stack.isEmpty();
        */
        
        return false;
    }
}`
};

// Solutions for Reverse String problem
export const reverseStringSolution = {
  javascript: `function solution(s) {
  // Write your solution here
  // s: character[] - Array of characters (will be modified in-place)
  // Do not return anything, modify s in-place instead
  
  /* SOLUTION - uncomment to see the answer
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    // Swap characters
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  */
}`,
  python: `def solution(s):
    # Write your solution here
    # s: List[str] - Array of characters (will be modified in-place)
    # Do not return anything, modify s in-place instead
    
    ''' SOLUTION - uncomment to see the answer
    left, right = 0, len(s) - 1
    
    while left < right:
        # Swap characters
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    '''
    pass`,
  cpp: `class Solution {
public:
    void solution(vector<char>& s) {
        // Write your solution here
        // s: vector<char>& - Array of characters (will be modified in-place)
        // Do not return anything, modify s-in-place instead
        
        /* SOLUTION - uncomment to see the answer
        int left = 0;
        int right = s.size() - 1;
        
        while (left < right) {
            // Swap characters
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
        */
    }
};`,
  java: `class Solution {
    public void solution(char[] s) {
        // Write your solution here
        // s: char[] - Array of characters (will be modified in-place)
        // Do not return anything, modify s-in-place instead
        
        /* SOLUTION - uncomment to see the answer
        int left = 0;
        int right = s.length - 1;
        
        while (left < right) {
            // Swap characters
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;
            left++;
            right--;
        }
        */
    }
}`
};

// Solutions for Mage's Maximum Power problem (Maximum Subarray)
export const magesMaximumPowerSolution = {
  javascript: `function solution(nums) {
  // Write your solution here
  // nums: number[] - Array of integers
  // return: number - Maximum sum of contiguous subarray
  
  /* SOLUTION - uncomment to see the answer
  if (nums.length === 0) return 0;
  
  let maxSoFar = nums[0];
  let maxEndingHere = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // Either take the current element alone or add it to the previous subarray
    maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
    
    // Update the maximum sum found so far
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  
  return maxSoFar;
  */
}`,
  python: `def solution(nums):
    # Write your solution here
    # nums: List[int] - Array of integers
    # return: int - Maximum sum of contiguous subarray
    
    ''' SOLUTION - uncomment to see the answer
    if not nums:
        return 0
        
    max_so_far = nums[0]
    max_ending_here = nums[0]
    
    for i in range(1, len(nums)):
        # Either take the current element alone or add it to the previous subarray
        max_ending_here = max(nums[i], max_ending_here + nums[i])
        
        # Update the maximum sum found so far
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far
    '''
    pass`,
  cpp: `class Solution {
public:
    int solution(vector<int>& nums) {
        // Write your solution here
        // nums: vector<int> - Array of integers
        // return: int - Maximum sum of contiguous subarray
        
        /* SOLUTION - uncomment to see the answer
        if (nums.empty()) return 0;
        
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        
        for (int i = 1; i < nums.size(); i++) {
            // Either take the current element alone or add it to the previous subarray
            maxEndingHere = max(nums[i], maxEndingHere + nums[i]);
            
            // Update the maximum sum found so far
            maxSoFar = max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
        */
        return 0;
    }
};`,
  java: `class Solution {
    public int solution(int[] nums) {
        // Write your solution here
        // nums: int[] - Array of integers
        // return: int - Maximum sum of contiguous subarray
        
        /* SOLUTION - uncomment to see the answer
        if (nums.length == 0) return 0;
        
        int maxSoFar = nums[0];
        int maxEndingHere = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            // Either take the current element alone or add it to the previous subarray
            maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
            
            // Update the maximum sum found so far
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        
        return maxSoFar;
        */
        return 0;
    }
}`
};
