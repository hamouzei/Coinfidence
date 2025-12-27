# Coinfidence - Student Expense Tracker

A clean, fast, mobile-first expense tracking application designed for students.

## Features

- 📊 Track expenses by category
- 📱 Mobile-first responsive design
- 🔐 Secure authentication with Supabase
- 📈 Monthly spending insights
- 🎨 Modern, minimal UI

## Setup

### Prerequisites

- Node.js installed
- Supabase account (free tier works)

### Installation

1. Clone and install dependencies:

   ```bash
   git clone <your-repo-url>
   cd Coinfidence
   npm install
   ```

2. Create a `.env` file with your Supabase credentials:

   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. Configure Supabase:

   - Enable "Email" provider in Authentication → Settings
   - Set Site URL to `http://localhost:5173`
   - Add redirect URL: `http://localhost:5173/#/verify-email`

4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React + Vite
- React Router
- Supabase (BaaS)
- Tailwind CSS
- Material Symbols

## License

MIT
