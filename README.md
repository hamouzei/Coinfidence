# Coinfidence - Student Expense Tracker

A clean, fast, mobile-first expense tracking application designed for students.

## Features

- 📊 Track expenses by category
- 📱 Mobile-first responsive design
- 🔐 Secure authentication with Supabase
- 📈 Monthly spending insights
- 🎨 Modern, minimal UI

## Setup Instructions

### Prerequisites

- Node.js installed
- A Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Coinfidence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to Project Settings → API
   
   c. Copy your:
      - Project URL
      - Anon/Public Key
   
   d. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   
   Or update `services/supabase.ts` directly with your credentials.

4. **Configure Supabase Authentication**

   a. In Supabase Dashboard, go to Authentication → Settings
   
   b. Enable "Email" provider
   
   c. Configure email verification:
      - Enable "Confirm email"
      - Set Site URL to your app URL (e.g., `http://localhost:5173`)
      - Add redirect URL: `http://localhost:5173/#/verify-email`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
Coinfidence/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API services (Supabase)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Main app component
```

## Development Phases

- ✅ **Phase 1**: UI & UX (Frontend Only) - Complete
- 🔄 **Phase 2**: Supabase Setup & Authentication - In Progress
- ⏳ **Phase 3**: Database & Security (RLS)
- ⏳ **Phase 4**: Connect Frontend to Supabase
- ⏳ **Phase 5**: Dashboard Insights
- ⏳ **Phase 6**: Polish & UX Optimization
- ⏳ **Phase 7**: Testing & Hardening
- ⏳ **Phase 8**: Deployment

## Tech Stack

- **Frontend**: React + Vite
- **Routing**: React Router
- **Backend**: Supabase (BaaS)
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols

## License

MIT
