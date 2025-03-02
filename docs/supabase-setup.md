
# Supabase Configuration

The application is already configured to use a Supabase project. The necessary Supabase URL and anon key are included in the codebase, so you don't need to set up any environment variables for this.

## Using Your Own Supabase Instance

If you want to use your own Supabase instance instead:

1. Create a new Supabase project at https://supabase.com
2. Once created, go to Project Settings > API
3. Update the Supabase configuration in `src/integrations/supabase/client.ts` with your project's URL and anon key
4. Run the database schema setup SQL commands found in `docs/database-schema.sql`

## Edge Function Setup

1. Go to your Supabase Dashboard > Edge Functions
2. Create a new function called `execute-code`
3. Add your RapidAPI key as a secret with name `JUDGE0_RAPIDAPI_KEY`
4. Deploy the code found in `docs/edge-functions/execute-code.ts`
