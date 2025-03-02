
# CodeQuest Battles

A real-time collaborative coding platform for practicing Data Structures & Algorithms with an AI-powered Socratic learning approach.

## Features

- Real-time collaborative code editing
- AI-powered Socratic learning
- Multiple programming language support
- Built-in code execution
- Team-based coding battles
- Authentication system
- Real-time presence tracking

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm (v8 or higher)
- A Supabase account (free tier works fine)
- A RapidAPI account (for Judge0 API integration)

## Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/codequest-battles.git

# Navigate to project directory
cd codequest-battles

# Install dependencies
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Once created, go to Project Settings > API and copy:
   - Project URL
   - Project anon/public key

3. Update Supabase configuration in `src/integrations/supabase/client.ts`:
```typescript
const SUPABASE_URL = "your-project-url";
const SUPABASE_ANON_KEY = "your-anon-key";
```

4. Set up the database schema:
   - Go to the SQL editor in your Supabase dashboard
   - Copy the complete database setup SQL from `docs/database-schema.sql`
   - Run the SQL script to create all necessary tables and configurations

5. Configure Authentication:
   - In Supabase dashboard, go to Authentication > Providers
   - Enable Email and Google authentication (or other providers as needed)
   - For development, consider disabling email confirmation

### 3. Edge Function Setup

1. Install Supabase CLI globally:
```bash
npm install -g supabase
```

2. Set up Edge Function:
   - Go to Supabase Dashboard > Edge Functions
   - Create a new function called `execute-code`
   - Get a RapidAPI key for Judge0 API from [RapidAPI](https://rapidapi.com)
   - Add your RapidAPI key as a secret:
```bash
supabase secrets set JUDGE0_RAPIDAPI_KEY=your-api-key
```
   - Deploy the code from `docs/edge-functions/execute-code.ts`

### 4. Development

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:8080`

### 5. Testing Real-time Features

To test the collaborative features:
1. Open two different browsers or incognito windows
2. Log in with different accounts
3. Join the same battle room using the room code
4. Changes in one editor should appear in real-time in the other

## Documentation

For more detailed information, check out:
- [Getting Started](docs/getting-started.md)
- [Supabase Setup](docs/supabase-setup.md)
- [Adding Questions](docs/adding-questions.md)
- [Development Guide](docs/development.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Troubleshooting

Common issues and solutions:
1. Real-time not working:
   - Verify that tables have REPLICA IDENTITY FULL
   - Check if tables are added to supabase_realtime publication
   - Ensure WebSocket connection is established

2. Authentication issues:
   - Verify Supabase URL and anon key are correct
   - Check if authentication providers are properly configured
   - Review browser console for any errors

3. Code execution not working:
   - Verify RapidAPI key is correctly set in Edge Function secrets
   - Check Edge Function logs for any errors
   - Ensure Judge0 API quota hasn't been exceeded

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for real-time and authentication features
- [Judge0](https://judge0.com) for code execution API
- [Shadcn/ui](https://ui.shadcn.com) for UI components
