# Development Guide

## Testing Auth Flow
- Create a test user through Supabase Auth UI or programmatically
- Use the email/password combination to log in
- Check the `profiles` table to ensure the trigger created a profile

## Debugging Edge Functions
- Use the Supabase Dashboard to view Edge Function logs
- Test the code execution with different languages
- Monitor the RapidAPI dashboard for API usage

## Real-time Collaboration Setup

The application uses Supabase's real-time features for collaborative coding. Here's how it works:

1. Real-time updates are enabled for:
   - battles table (room status)
   - battle_participants table (code synchronization)

2. Code synchronization flow:
   - When a user types, their code is saved to battle_participants
   - Other users in the same room receive updates via Supabase channels
   - Updates are broadcasted only to users in the same battle room

3. Testing real-time features:
   - Open two different browsers or incognito windows
   - Log in with different accounts
   - Join the same battle room using the room code
   - Changes in one editor should appear in real-time in the other

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
