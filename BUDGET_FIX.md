# Budget Not Saving - Fix Guide

## Issue
Budget resets to $600 every time you log in.

## Root Cause
The `user_settings` table might not exist in your Supabase database yet.

## Solution

### Step 1: Run the SQL Migration

1. Go to your Supabase Dashboard: https://app.supabase.com/project/kkpcebezvgkttthvudnf/sql
2. Click **"New Query"**
3. Open `database/user_settings.sql` in your project
4. Copy **ALL** the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or Ctrl+Enter)
7. Should see: "Success. No rows returned"

### Step 2: Verify Table Exists

Run this query in SQL Editor:
```sql
SELECT * FROM user_settings LIMIT 1;
```

If you get an error, the table doesn't exist - go back to Step 1.

### Step 3: Test in Your App

1. **Logout** from your app
2. **Login** again
3. Go to **Profile** page
4. Edit your budget (e.g., change to $800)
5. Click **Save**
6. **Logout** and **Login** again
7. Check Profile - budget should still be $800 ✅

## Debugging

### Check Browser Console

Open browser console (F12) and look for:
- `✅ Loaded user settings:` - Settings loaded successfully
- `✅ Created default settings:` - Default settings created
- `❌ Error loading user settings:` - Something went wrong
- `user_settings table does not exist` - Table not created yet

### Check Supabase Dashboard

1. Go to **Table Editor** → `user_settings`
2. You should see your user's budget record
3. If table doesn't exist, run the SQL migration

## What Was Fixed

1. ✅ Better error handling in `userSettingsService.ts`
2. ✅ Improved logging to help debug issues
3. ✅ Graceful fallback if table doesn't exist
4. ✅ Fixed loading order in `App.tsx` (settings load before expenses)

## Still Not Working?

1. **Check RLS policies**: Make sure RLS is enabled and policies exist
2. **Check user authentication**: Make sure you're logged in
3. **Check browser console**: Look for specific error messages
4. **Verify table exists**: Run `SELECT * FROM user_settings;` in SQL Editor

---

**After running the SQL migration, the budget should persist correctly!** 🎉

