# Budget Feature Setup

## Database Setup

Run the `user_settings.sql` file in your Supabase SQL Editor to create the user settings table:

1. Go to Supabase Dashboard → SQL Editor
2. Open `database/user_settings.sql`
3. Copy and paste the entire contents
4. Click "Run"

This will create:
- `user_settings` table with `monthly_budget` field
- RLS policies for security
- Helper function to get or create settings

## Features

✅ **User-configurable budget**: Users can set their own monthly budget
✅ **Default budget**: New users get $600.00 as default
✅ **Edit in Profile**: Users can edit budget from Profile page
✅ **Real-time updates**: Budget changes reflect immediately in Dashboard
✅ **Secure**: RLS ensures users can only access their own settings

## How It Works

1. **First Time**: When a user logs in, default budget of $600 is created
2. **Edit Budget**: User goes to Profile → Monthly Budget → Edit
3. **Save**: Budget is saved to `user_settings` table
4. **Dashboard**: Shows user's custom budget instead of hardcoded $600

## Testing

1. Login to your app
2. Go to Profile page
3. Click "Edit" next to Monthly Budget
4. Enter a new budget (e.g., $800)
5. Click "Save"
6. Go to Dashboard - should show your custom budget

---

**Note**: Make sure to run `database/user_settings.sql` in Supabase SQL Editor first!

