# CodeQuest Battles

## About

This application is designed to enhance both Data Structure & Algorithm (DSA) skills and communication abilities through an innovative AI-powered Socratic learning approach. Instead of providing direct solutions, the system engages students in a thoughtful dialogue about their problem-solving process.

## Key Features

### 1. Socratic AI Assistant
- Asks targeted questions to guide understanding
- Never provides direct solutions
- Focuses on the immediate step you're stuck on
- Helps students analyze their own code and thinking process

### 2. Interactive Learning Environment
- Fantasy-themed battles and quests make learning engaging
- Real-time communication with AI mentor
- Safe space to explore different approaches
- Encourages self-discovery and deeper understanding
- Transforms traditional DSA practice into an enjoyable adventure

### 3. Collaborative Features
- Party system for group learning (form your band of adventurers!)
- Real-time collaboration capabilities
- Learn from peer interactions and discussions
- Only one person can submit a final solution, encouraging:
  - Active discussion of different approaches
  - Explanation and defense of solving strategies
  - Understanding of alternative solutions
  - Development of communication skills through code review
  - Consensus building within the group

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account (free tier works perfectly)

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

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Once created, go to Project Settings > API to find your:
   - Project URL
   - Project API Keys (you'll need the anon/public key)

3. Set up the database schema by running these SQL commands in the Supabase SQL editor:

```sql
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

-- Create enum for battle status
CREATE TYPE room_status AS ENUM ('waiting', 'in_progress', 'completed');

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

-- Enable RLS
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

4. Set up Edge Functions:

Create a new Edge Function called `execute-code` in your Supabase dashboard and add this code:

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

5. Add the following secrets to your Edge Function:
   - `JUDGE0_RAPIDAPI_KEY`: Get this from RapidAPI after subscribing to Judge0

### 3. Environment Setup

Create a new file called `.env.local` in the project root and add:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Replace `your_project_url` and `your_anon_key` with the values from your Supabase project settings.

### 4. Auth Configuration

In your Supabase project:
1. Go to Authentication > Settings
2. Set your Site URL to `http://localhost:8080` (for development)
3. Add `http://localhost:8080/*` to Additional Redirect URLs
4. Disable "Confirm email" for easier testing (optional)

### 5. Run the Project

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your preferred hosting service (Vercel, Netlify, etc.)

3. Update your Supabase authentication settings with your production URL

## Contributing

Want to contribute? Great! You can:
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## Learn More

Visit [Lovable](https://lovable.dev) to learn more about creating interactive learning experiences.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Groq API for AI interactions

## Project Setup

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
