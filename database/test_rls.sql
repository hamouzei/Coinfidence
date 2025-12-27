-- ============================================
-- RLS Testing Queries
-- Run these after setting up the database
-- ============================================
-- NOTE: These queries work when run from the frontend app (authenticated user)
-- In SQL Editor, auth.uid() returns null, so use the manual tests below instead

-- ============================================
-- MANUAL TESTING (Run in SQL Editor)
-- ============================================

-- Step 1: Get a real user ID from auth.users
-- Replace 'your-email@example.com' with an actual user email from your app
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 2: Insert test expense with a real user_id
-- Replace 'USER_ID_HERE' with an actual UUID from Step 1
/*
INSERT INTO expenses (user_id, amount, category, date, note)
VALUES (
  'USER_ID_HERE'::uuid,  -- Replace with actual user ID
  15.99,
  'Food & Dining',
  CURRENT_DATE,
  'Test expense from SQL Editor'
)
RETURNING *;
*/

-- Step 3: Verify RLS is working - Try to bypass RLS (should fail)
-- This should return 0 rows because RLS blocks it
/*
SELECT * FROM expenses 
WHERE user_id != (SELECT id FROM auth.users LIMIT 1);
*/

-- Step 4: Check all expenses (RLS should filter by user)
-- This will only show expenses for the authenticated user
-- In SQL Editor, this shows all (because we're admin), but in app it will filter
SELECT 
  user_id,
  COUNT(*) as expense_count,
  SUM(amount) as total_amount,
  MIN(date) as earliest_expense,
  MAX(date) as latest_expense
FROM expenses
GROUP BY user_id
ORDER BY expense_count DESC;

-- Step 5: Verify RLS policies exist
SELECT 
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'expenses'
ORDER BY cmd;

-- Step 6: Verify RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'expenses';

-- ============================================
-- TESTING FROM FRONTEND APP (Recommended)
-- ============================================
-- These queries work when called from your React app where user is authenticated
-- The RLS policies will automatically filter data based on auth.uid()

-- In your app, after a user logs in, you can test:
-- 1. Insert expense: Should work (RLS allows INSERT with matching user_id)
-- 2. Select expenses: Should only show that user's expenses
-- 3. Update expense: Should only work for that user's expenses
-- 4. Delete expense: Should only work for that user's expenses

-- ============================================
-- CLEANUP (Optional)
-- ============================================
-- Delete test expenses if needed
/*
DELETE FROM expenses 
WHERE note LIKE '%Test expense%' 
  AND created_at > NOW() - INTERVAL '1 hour';
*/

