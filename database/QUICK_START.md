# Quick Start - Phase 3 Database Setup

## 🚀 Fast Setup (5 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com/project/kkpcebezvgkttthvudnf/sql
2. Click **"New Query"**

### Step 2: Run Schema
1. Open `database/schema.sql` in your project
2. Copy **ALL** the contents
3. Paste into Supabase SQL Editor
4. Click **"Run"** (or Ctrl+Enter)
5. ✅ Should see: "Success. No rows returned"

### Step 3: Verify (Optional)
Run this in SQL Editor:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'expenses';
```
Should return: `expenses`

## ✅ Done!

Your database is now set up with:
- ✅ `expenses` table
- ✅ RLS policies (users can only see their own data)
- ✅ Indexes for performance
- ✅ Auto-update triggers

**Next:** Proceed to Phase 4 to connect the frontend!

---

## 📋 Full Details

See `database/PHASE3_SETUP.md` for complete documentation.

