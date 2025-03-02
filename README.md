
# CodeQuest Battles

A real-time collaborative coding platform for practicing Data Structures & Algorithms with an AI-powered Socratic learning approach.

## Features

- Real-time collaborative code editing with multiple users
- AI-powered Socratic learning that guides rather than gives solutions
- Multiple programming language support (JavaScript, Python, C++)
- Built-in code execution through Judge0 API
- Team-based coding battles with real-time updates
- Authentication system with email and social login
- Real-time presence tracking to see who's online
- Interactive problem-solving environment
- Code highlighting and syntax support
- Real-time chat and collaboration tools

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher) installed - [Download here](https://nodejs.org/)
- npm (v8 or higher) - Comes with Node.js
- Git installed - [Download here](https://git-scm.com/downloads)
- A Supabase account (free tier works fine) - [Sign up here](https://supabase.com/)
- A RapidAPI account (for Judge0 API integration) - [Sign up here](https://rapidapi.com/signup)

## Detailed Setup Instructions

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/codequest-battles.git

# Navigate to project directory
cd codequest-battles

# Install dependencies
npm install
```

### 2. Supabase Setup (Detailed)

1. Create a new Supabase project:
   - Go to [supabase.com](https://supabase.com) and sign in
   - Click "New Project"
   - Choose an organization (create one if needed)
   - Set a project name (e.g., "codequest-battles")
   - Set a strong database password (save it somewhere safe)
   - Choose a region closest to your users
   - Click "Create new project" and wait for creation (~2 minutes)

2. Get your API credentials:
   - In your new project's dashboard, go to Project Settings > API
   - Under "Project URL", copy your unique project URL
   - Under "Project API keys", copy the "anon" public key
   - Never share or commit the service_role key!

3. Update your local configuration:
   - Open `src/integrations/supabase/client.ts`
   - Replace the configuration values:
   ```typescript
   const SUPABASE_URL = "your-project-url";
   const SUPABASE_ANON_KEY = "your-anon-key";
   ```

4. Set up the database schema:
   - In Supabase dashboard, go to SQL Editor
   - Click "New Query"
   - Open `docs/database-schema.sql` from your local project
   - Copy ALL the SQL content
   - Paste it into the SQL Editor
   - Click "Run" to execute the script
   - This will create all necessary tables, functions, and policies

5. Configure Authentication:
   a. Basic Email Auth Setup:
      - Go to Authentication > Providers in Supabase dashboard
      - Enable Email provider
      - For development, turn OFF "Confirm email"
   
   b. (Optional) Google Auth Setup:
      - Go to [Google Cloud Console](https://console.cloud.google.com/)
      - Create a new project or select existing
      - Enable Google OAuth API
      - Configure OAuth consent screen
      - Create credentials (OAuth client ID)
      - Add authorized origins (e.g., http://localhost:8080)
      - Add authorized redirect URI from Supabase dashboard
      - Copy Client ID and Secret
      - In Supabase dashboard, enable Google provider
      - Paste Google Client ID and Secret

### 3. RapidAPI (Judge0) Setup

1. Get your Judge0 API key:
   - Go to [RapidAPI's Judge0 page](https://rapidapi.com/judge0-official/api/judge0-ce)
   - Sign up or log in to RapidAPI
   - Subscribe to a plan (FREE tier is fine for testing)
   - Once subscribed, copy your RapidAPI key from the "Header" section
   - Look for X-RapidAPI-Key in the code examples

2. Configure Edge Function:
   - Install Supabase CLI globally:
   ```bash
   npm install -g supabase
   ```
   
   - Log in to Supabase CLI:
   ```bash
   supabase login
   ```
   
   - Set up Edge Function:
     - Go to Supabase Dashboard > Edge Functions
     - Create a new function called `execute-code`
     - Add your RapidAPI key as a secret:
     ```bash
     supabase secrets set JUDGE0_RAPIDAPI_KEY=your-rapidapi-key
     ```
     - Copy the code from `docs/edge-functions/execute-code.ts`
     - Deploy it to your project through the dashboard

3. Edge Function Configuration:
   - In Supabase dashboard, go to Settings > API
   - Under "Project URL", note your Edge Function URL
   - The endpoint will be: `{project_url}/functions/v1/execute-code`
   - Make sure CORS is enabled for your domain

### 4. Local Development

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
   - Open http://localhost:8080 in your browser
   - You should see the login page
   - Create an account or use Google sign-in

### 5. Testing Real-time Features

To test collaborative features:
1. Open two different browsers or incognito windows
2. Log in with different accounts in each window
3. Create a new battle room in one window
4. Copy the room code
5. Join the same room in the other window using the code
6. Try these features:
   - Type code in one editor - should appear in real-time in other
   - Run code using the execute button
   - Submit solutions
   - Use chat features
   - Test presence indicators

## Real-time Architecture

The real-time functionality is built using Supabase's real-time features:
1. Tables (`battles` and `battle_participants`) have REPLICA IDENTITY FULL
2. Tables are added to supabase_realtime publication
3. Client subscribes to changes using Supabase channels
4. Updates are broadcasted to all participants in real-time

## Troubleshooting

### 1. Real-time Issues
If real-time features aren't working:
- Check browser console for WebSocket errors
- Verify tables have REPLICA IDENTITY FULL:
  ```sql
  ALTER TABLE battles REPLICA IDENTITY FULL;
  ALTER TABLE battle_participants REPLICA IDENTITY FULL;
  ```
- Verify tables are in realtime publication:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE battles, battle_participants;
  ```
- Test WebSocket connection in browser console:
  ```javascript
  const channel = supabase.channel('test');
  channel.subscribe(console.log);
  ```

### 2. Authentication Issues
If login/signup isn't working:
- Check if email confirmation is disabled (for development)
- Verify Supabase URL and anon key are correct
- For Google auth:
  - Verify redirect URIs in Google Console
  - Check if origin is allowed in Google Console
  - Verify Google client ID and secret in Supabase
- Look for CORS errors in browser console

### 3. Code Execution Issues
If code execution fails:
- Verify RapidAPI key is set correctly in Edge Function
- Check Edge Function logs in Supabase dashboard
- Verify Judge0 API quota hasn't been exceeded
- Test Edge Function directly:
  ```bash
  curl -i --location --request POST 'https://<project>.supabase.co/functions/v1/execute-code' \
  --header 'Authorization: Bearer <anon-key>' \
  --data '{"code":"console.log('"'"'hello'"'"')"}'
  ```

### 4. Database Issues
- Check SQL query errors in Supabase dashboard
- Verify RLS policies are correctly set
- Test queries directly in SQL editor
- Look for foreign key constraint errors

## Advanced Configuration

### 1. Environment Variables
The project uses these environment variables:
- VITE_SUPABASE_URL - Your Supabase project URL
- VITE_SUPABASE_ANON_KEY - Your public anon key
- JUDGE0_RAPIDAPI_KEY - Your RapidAPI key for Judge0

### 2. Custom Domain Setup
To use a custom domain:
1. Update authentication redirect URLs in Supabase
2. Update Google OAuth authorized domains
3. Update CORS settings in Edge Functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com) - For real-time, auth, and database features
- [Judge0](https://judge0.com) - For code execution API
- [Shadcn/ui](https://ui.shadcn.com) - For beautiful UI components
- [CodeMirror](https://codemirror.net/) - For code editor functionality
- [TanStack Query](https://tanstack.com/query) - For data fetching
- [Tailwind CSS](https://tailwindcss.com) - For styling
