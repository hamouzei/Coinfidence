# Testing Row Level Security (RLS)

## ⚠️ Important Note

**RLS testing in SQL Editor is limited** because `auth.uid()` returns `null` when running queries as the database owner. RLS is designed to work with authenticated users from your application.

## ✅ Recommended: Test from Your App

The best way to test RLS is from your **React application** where users are authenticated:

1. **Sign up/Login** in your app
2. **Add an expense** - Should work ✅
3. **View expenses** - Should only show your expenses ✅
4. **Try to access another user's data** - Should be blocked by RLS ✅

## 🔧 Manual Testing in SQL Editor

If you want to test in SQL Editor, you need to use actual user IDs:

### Step 1: Get a User ID
```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

### Step 2: Insert Test Expense
Replace `'USER_ID_HERE'` with an actual UUID from Step 1:
```sql
INSERT INTO expenses (user_id, amount, category, date, note)
VALUES (
  'USER_ID_HERE'::uuid,  -- Replace with actual user ID
  15.99,
  'Food & Dining',
  CURRENT_DATE,
  'Test expense'
)
RETURNING *;
```

### Step 3: Verify RLS Policies Exist
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

### Step 4: Verify RLS is Enabled
```sql
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'expenses';
```

Should show `rls_enabled = true`

## 🧪 Testing RLS from Frontend

Once you connect your frontend (Phase 4), test RLS by:

1. **Create two test accounts** (User A and User B)
2. **User A adds expenses** - Should work
3. **User B logs in** - Should NOT see User A's expenses
4. **User B tries to update User A's expense** - Should fail
5. **User B adds their own expense** - Should work

## ✅ RLS is Working If:

- ✅ Users can only see their own expenses
- ✅ Users can only insert expenses with their own user_id
- ✅ Users cannot update/delete other users' expenses
- ✅ Queries automatically filter by `auth.uid()`

## 🐛 Troubleshooting

### RLS not working?
1. Check RLS is enabled: `SELECT rowsecurity FROM pg_tables WHERE tablename = 'expenses';`
2. Check policies exist: `SELECT * FROM pg_policies WHERE tablename = 'expenses';`
3. Verify user is authenticated: `SELECT auth.uid();` (should return UUID, not null)
4. Check user_id matches: `SELECT user_id FROM expenses WHERE id = 'expense_id';`

### Can see all expenses in SQL Editor?
- **This is normal!** SQL Editor runs as database owner (bypasses RLS)
- RLS only applies to queries from your application
- Test from your React app to see RLS in action

---

**Next Step**: Proceed to Phase 4 to connect your frontend and test RLS properly!

