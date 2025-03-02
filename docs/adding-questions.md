
# Adding Questions to CodeQuest Battles

## Question Structure

Each question in CodeQuest Battles requires the following information:
- Title: A clear, concise name for the problem
- Description: Detailed problem statement
- Difficulty: 'easy', 'medium', or 'hard'
- Category: The problem-solving category (e.g., 'arrays', 'strings', 'dynamic-programming')
- Constraints: Array of constraints for the problem
- Examples: JSON array of input/output examples with explanations

## Adding Questions via SQL

You can add questions through the Supabase SQL editor. Here's an example:

```sql
INSERT INTO public.questions (
    title,
    description,
    difficulty,
    category,
    constraints,
    examples
) VALUES (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    'easy',
    'arrays',
    ARRAY[
        '2 <= nums.length <= 104',
        '-109 <= nums[i] <= 109',
        '-109 <= target <= 109'
    ],
    '[
        {
            "input": "nums = [2,7,11,15], target = 9",
            "output": "[0,1]",
            "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]"
        },
        {
            "input": "nums = [3,2,4], target = 6",
            "output": "[1,2]",
            "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]"
        }
    ]'::jsonb
);

-- Add more sample questions
INSERT INTO public.questions (
    title,
    description,
    difficulty,
    category,
    constraints,
    examples
) VALUES (
    'Valid Parentheses',
    'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    'easy',
    'stack',
    ARRAY[
        '1 <= s.length <= 104',
        's consists of parentheses only ''()[]{}'''
    ],
    '[
        {
            "input": "s = \"()\"",
            "output": "true",
            "explanation": "The parentheses match and are closed in the correct order"
        },
        {
            "input": "s = \"([)]\"",
            "output": "false",
            "explanation": "The brackets are not closed in the correct order"
        }
    ]'::jsonb
);
```

## Question Categories

Common categories include:
- arrays
- strings
- linked-lists
- trees
- graphs
- dynamic-programming
- stack
- queue
- recursion
- sorting
- binary-search
- greedy
- backtracking

## Difficulty Levels

- easy: Suitable for beginners, typically solved with straightforward approaches
- medium: Requires more complex problem-solving and knowledge of data structures
- hard: Challenges that require advanced algorithms and optimizations

## Example Format

The examples field should be a valid JSON array containing objects with:
- input: String representation of the input
- output: String representation of the expected output
- explanation: Clear explanation of how the output is derived from the input
