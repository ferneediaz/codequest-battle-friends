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
