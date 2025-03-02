
# Development Guide

## Testing Auth Flow
- Create a test user through Supabase Auth UI or programmatically
- Use the email/password combination to log in
- Check the `profiles` table to ensure the trigger created a profile

## Debugging Edge Functions
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
