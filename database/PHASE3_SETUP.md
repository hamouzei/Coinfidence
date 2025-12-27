# Phase 3 - Database & Security Setup Guide

This guide will help you set up the database schema, RLS policies, and indexes in Supabase.

## Step 1: Open Supabase SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **kkpcebezvgkttthvudnf**
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Create Database Schema

1. Copy the entire contents of `database/schema.sql`
2. Paste it into the SQL Editor
3. Click **Run** (or press Ctrl+Enter)
4. You should see: "Success. No rows returned"

This will create:
- ✅ `expenses` table with all required columns
- ✅ `categories` table (optional, for future use)
- ✅ All necessary indexes
- ✅ RLS policies for data security
- ✅ Auto-update trigger for `updated_at` timestamp

## Step 3: Seed Default Categories (Optional)

If you want to use the `categories` table instead of enum:

1. Copy the contents of `database/seed_categories.sql`
2. Paste into SQL Editor
3. Click **Run**

## Step 4: Verify Setup

Run these verification queries in SQL Editor:

### Check Tables Exist
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('expenses', 'categories');
```

Should return 2 rows: `expenses` and `categories`

### Check RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('expenses', 'categories');
```

Should show `rowsecurity = true` for both tables

### Check Policies Exist
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

## Step 5: Test RLS (Optional but Recommended)

### Test 1: Create a Test Expense (as authenticated user)
```sql
-- This should work when you're logged in
INSERT INTO expenses (user_id, amount, category, date, note)
VALUES (auth.uid(), 25.50, 'Food & Dining', CURRENT_DATE, 'Test expense');
```

### Test 2: Try to Access Another User's Data
```sql
-- This should return 0 rows (RLS blocking)
SELECT * FROM expenses WHERE user_id != auth.uid();
```

## Database Schema Overview

### Expenses Table
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `amount` | DECIMAL(10,2) | Expense amount (must be > 0) |
| `category` | TEXT | One of 7 predefined categories |
| `date` | DATE | Expense date |
| `note` | TEXT | Optional note |
| `created_at` | TIMESTAMP | Auto-set on insert |
| `updated_at` | TIMESTAMP | Auto-updated on update |

### Categories Table (Optional)
| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Category name (unique) |
| `icon` | TEXT | Material Symbols icon name |
| `color` | TEXT | Color theme |
| `is_default` | BOOLEAN | Whether it's a default category |

## Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Policies** ensure users can only access their own data
✅ **Foreign key constraints** ensure data integrity
✅ **Check constraints** validate amount > 0 and valid categories
✅ **Indexes** optimize query performance

## Next Steps

Once the database is set up:
- ✅ Phase 3 is complete!
- Proceed to **Phase 4**: Connect Frontend to Supabase
- Replace mock data with real Supabase queries

## Troubleshooting

### "relation already exists" error
- Tables already exist, that's okay
- The `IF NOT EXISTS` clauses prevent errors

### "permission denied" error
- Make sure you're running as the database owner
- Check you're in the correct project

### RLS policies not working
- Verify RLS is enabled: `ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;`
- Check policies exist with verification queries above
- Ensure user is authenticated when testing

---

**Ready to proceed?** Once you've run the schema.sql file, Phase 3 is complete!

