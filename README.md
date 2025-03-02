
# CodeQuest Battles

## About

This application is designed to enhance both Data Structure & Algorithm (DSA) skills and communication abilities through an innovative AI-powered Socratic learning approach. Instead of providing direct solutions, the system engages students in a thoughtful dialogue about their problem-solving process.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account (free tier works perfectly)
- A RapidAPI account (for Judge0 API integration)

## Detailed Setup Guide

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/codequest-battles.git

# Navigate to project directory
cd codequest-battles

# Install dependencies
npm install
```

### 2. RapidAPI Setup

1. Go to [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) and sign up
2. Subscribe to the Judge0 CE API (the free tier is sufficient for testing)
3. Copy your RapidAPI key from your dashboard

### 3. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Once created, go to Project Settings > API to find your:
   - Project URL
   - Project anon/public key

3. Create the necessary database tables and types by running these SQL commands in your Supabase SQL editor:

```sql
-- Create enum for room status
CREATE TYPE room_status AS ENUM ('waiting', 'in_progress', 'completed');

-- Create tables
CREATE TABLE public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    username text,
    avatar_url text,
    full_name text,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE public.questions (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text not null,
    difficulty text not null,
    category text not null,
    constraints text[] default '{}',
    examples jsonb default '[]',
    created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE public.battles (
    id uuid primary key default gen_random_uuid(),
    status room_status not null default 'waiting',
    question_id uuid not null references public.questions(id),
    max_participants integer default 2,
    current_participants integer default 0,
    team_a_score integer default 0,
    team_b_score integer default 0,
    min_rank text not null default 'herald',
    max_rank text not null default 'immortal',
    room_code text,
    document_content text,
    shared_document_id uuid default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE public.battle_participants (
    id uuid primary key default gen_random_uuid(),
    battle_id uuid references public.battles(id),
    user_id uuid references auth.users(id),
    team text not null,
    current_code text,
    joined_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create necessary functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_battle_participants_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE battles 
    SET current_participants = current_participants + 1
    WHERE id = NEW.battle_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE battles 
    SET current_participants = current_participants - 1
    WHERE id = OLD.battle_id;
  END IF;
  RETURN NULL;
END;
$$;

-- Set up triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER update_participants_count
  AFTER INSERT OR DELETE ON battle_participants
  FOR EACH ROW EXECUTE FUNCTION update_battle_participants_count();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_participants ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO public
USING (auth.uid() = id);

CREATE POLICY "Questions are viewable by everyone"
ON public.questions FOR SELECT
TO public
USING (true);

CREATE POLICY "Battles are viewable by everyone"
ON public.battles FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create battles"
ON public.battles FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Battle participants are viewable by everyone"
ON public.battle_participants FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can join battles"
ON public.battle_participants FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own battle participation"
ON public.battle_participants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);
```

4. Set up an Edge Function for code execution:
   - Go to your Supabase Dashboard > Edge Functions
   - Create a new function called `execute-code`
   - Add your RapidAPI key as a secret with name `JUDGE0_RAPIDAPI_KEY`
   - Deploy this code:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'
const JUDGE0_API_KEY = Deno.env.get('JUDGE0_RAPIDAPI_KEY')

interface ExecuteCodeRequest {
  sourceCode: string
  languageId: number
  isSubmission: boolean
}

serve(async (req) => {
  try {
    const { sourceCode, languageId, isSubmission } = await req.json() as ExecuteCodeRequest

    // Create submission
    const submission = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: ''
      })
    })

    const { token } = await submission.json()

    // Wait for result
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Get submission result
    const result = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    })

    return new Response(
      JSON.stringify(await result.json()),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

### 4. Environment Setup

Create a new file called `.env.local` in the project root with these variables:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Replace `your_project_url` and `your_anon_key` with the values from your Supabase project settings.

### 5. Supabase Auth Configuration

In your Supabase project:
1. Go to Authentication > Settings
2. Set your Site URL to `http://localhost:8080` (for development)
3. Add `http://localhost:8080/*` to Additional Redirect URLs
4. Optional: Disable "Confirm email" for easier testing

### 6. Add Sample Question Data

Run this SQL in your Supabase SQL editor to add a sample question:

```sql
INSERT INTO public.questions (title, description, difficulty, category, constraints, examples)
VALUES (
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'easy',
  'arrays',
  ARRAY['2 <= nums.length <= 104', '-109 <= nums[i] <= 109', '-109 <= target <= 109'],
  '[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]","explanation":"Because nums[0] + nums[1] == 9, we return [0, 1]"},{"input":"nums = [3,2,4], target = 6","output":"[1,2]","explanation":"Because nums[1] + nums[2] == 6, we return [1, 2]"}]'::jsonb
);
```

### 7. Run the Project

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Development Tips

1. **Testing Auth Flow**: 
   - Create a test user through Supabase Auth UI or programmatically
   - Use the email/password combination to log in
   - Check the `profiles` table to ensure the trigger created a profile

2. **Adding Questions**:
   - Questions can be added through SQL or the Supabase dashboard
   - Make sure to format the `examples` field as proper JSONB
   - Test the question by creating a new battle

3. **Debugging Edge Functions**:
   - Use the Supabase Dashboard to view Edge Function logs
   - Test the code execution with different languages
   - Monitor the RapidAPI dashboard for API usage

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

3. Update your Supabase authentication settings:
   - Update Site URL to your production URL
   - Add your production URL to Additional Redirect URLs
   - Update any environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

