# Supabase Configuration

The application is already configured to use a Supabase project. The necessary Supabase URL and anon key are included in the codebase, so you don't need to set up any environment variables for this.

## Real-time Configuration

Real-time updates are required for collaborative coding. The necessary SQL commands are included in the database setup, but here's what they do:

1. Enable full replica identity for real-time tables:
   ```sql
   ALTER TABLE battles REPLICA IDENTITY FULL;
   ALTER TABLE battle_participants REPLICA IDENTITY FULL;
   ```

2. Add tables to the real-time publication:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE battles, battle_participants;
   ```

These commands are already included in the initial setup SQL. You don't need to run them separately if you've run the complete setup script.

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
