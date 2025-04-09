
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
