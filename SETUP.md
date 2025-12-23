# AI Smart Complaint Analyzer Setup

## Required Configuration

This application uses OpenAI's GPT-3.5 Turbo to analyze complaints. You need to configure your OpenAI API key in the Supabase Edge Function.

### Setting up OpenAI API Key

1. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. Set the environment variable in your Supabase project:
   - Go to your Supabase Dashboard
   - Navigate to Project Settings > Edge Functions
   - Add a secret named `OPENAI_API_KEY` with your OpenAI API key

## How It Works

1. **User submits a complaint** - Users can describe their issue in a text form
2. **AI analyzes the complaint** - The edge function sends the complaint to OpenAI GPT-3.5 Turbo
3. **Categorization & Prioritization** - AI automatically:
   - Categorizes the complaint (Technical, Billing, Service, Product, Shipping, Account, Other)
   - Assigns urgency level (Low, Medium, High, Critical)
   - Calculates priority score (1-10 scale)
4. **Results displayed** - The analyzed complaint is displayed with visual priority indicators

## Features

- Real-time complaint submission
- AI-powered automatic categorization
- Urgency detection based on emotional tone and impact
- Priority scoring with visual indicators
- Real-time updates when new complaints are added
- Clean, modern UI with responsive design

## Database Schema

The app uses a single `complaints` table with:
- complaint_text: The user's complaint
- category: AI-detected category
- urgency: AI-detected urgency level
- priority_score: Numerical priority (1-10)
- status: Current status (New, In Progress, Resolved)
- user_email: Optional contact email
- created_at: Submission timestamp

## Privacy & Security

- Row Level Security (RLS) is enabled
- Anyone can submit and view complaints
- Only authenticated users can update complaint status
