# Expenses Not Persisting - Fix Guide

## Issue
Expenses disappear after logout/login. Only budget persists.

## Root Causes
1. **Expenses table doesn't exist** - Most likely!
2. **RLS policies not set up** - Blocking queries
3. **Silent errors** - Errors being caught but not shown

## Solution

### Step 1: Verify Expenses Table Exists

1. Go to Supabase Dashboard → **Table Editor**
2. Look for `expenses` table
3. If it doesn't exist → **Go to Step 2**
4. If it exists → **Go to Step 3**

### Step 2: Create Expenses Table

1. Go to Supabase SQL Editor: https://app.supabase.com/project/kkpcebezvgkttthvudnf/sql
2. Click **"New Query"**
3. Open `database/schema.sql` in your project
4. Copy **ALL** the contents
5. Paste into SQL Editor
6. Click **"Run"**
7. Should see: "Success. No rows returned"

### Step 3: Verify RLS Policies

Run this in SQL Editor:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'expenses';
```

Should show 4 policies:
- Users can view their own expenses (SELECT)
- Users can insert their own expenses (INSERT)
- Users can update their own expenses (UPDATE)
- Users can delete their own expenses (DELETE)

### Step 4: Test in Browser

1. **Open browser console** (F12)
2. **Login** to your app
3. Look for these messages:
   - `🔄 Loading expenses...` - Started loading
   - `✅ Loaded X expenses:` - Successfully loaded
   - `❌ Error loading expenses:` - Something went wrong

4. **Add an expense**
5. Look for:
   - `💾 Adding expense:` - Started saving
   - `✅ Expense added successfully:` - Saved to database

6. **Logout and login again**
7. Expenses should still be there ✅

## Debugging

### Check Browser Console

**When Loading:**
- `🔄 Loading expenses...` - Loading started
- `✅ Loaded X expenses:` - Success (X = number of expenses)
- `❌ Error loading expenses:` - Error occurred

**When Adding:**
- `💾 Adding expense:` - Saving started
- `✅ Expense added successfully:` - Saved to database
- `❌ Error adding expense:` - Error occurred

### Check Supabase Dashboard

1. Go to **Table Editor** → `expenses`
2. You should see your expenses
3. If table is empty but you added expenses → Check console for errors
4. If table doesn't exist → Run `database/schema.sql`

### Common Errors

**"relation 'expenses' does not exist"**
- **Fix**: Run `database/schema.sql` in Supabase SQL Editor

**"new row violates row-level security policy"**
- **Fix**: Check RLS policies exist (Step 3 above)

**"permission denied for table expenses"**
- **Fix**: Verify RLS is enabled and policies exist

## What Was Fixed

1. ✅ Added detailed logging to track expense loading
2. ✅ Better error messages for common issues
3. ✅ Checks if expenses table exists
4. ✅ Logs expense count when loaded

## Still Not Working?

1. **Check console logs** - Look for error messages
2. **Verify table exists** - Go to Table Editor
3. **Check RLS policies** - Run verification query
4. **Test in SQL Editor** - Try: `SELECT * FROM expenses WHERE user_id = 'your-user-id';`

---

**After running `database/schema.sql`, expenses should persist correctly!** 🎉

