-- ============================================
-- Coinfidence Database Schema
-- Phase 3: Database & Security (RLS)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EXPENSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL CHECK (category IN (
    'Food & Dining',
    'Transport',
    'Rent',
    'Internet',
    'Textbooks',
    'Entertainment',
    'Other'
  )),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE expenses IS 'User expense records with category and date';

-- ============================================
-- CATEGORIES TABLE (Optional, for future extensibility)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  is_default BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE categories IS 'Expense categories with icons and colors';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Index on user_id for fast user queries
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);

-- Index on date for date filtering and sorting
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);

-- Index on category for category aggregation
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- Composite index for common queries (user + date)
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date DESC);

-- Composite index for category aggregation (user + category)
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON expenses(user_id, category);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table (if using)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR EXPENSES
-- ============================================

-- Policy: Users can SELECT only their own expenses
CREATE POLICY "Users can view their own expenses"
  ON expenses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT only their own expenses
CREATE POLICY "Users can insert their own expenses"
  ON expenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE only their own expenses
CREATE POLICY "Users can update their own expenses"
  ON expenses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE only their own expenses
CREATE POLICY "Users can delete their own expenses"
  ON expenses
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES FOR CATEGORIES (if using)
-- ============================================

-- Policy: All authenticated users can view default categories
CREATE POLICY "Anyone can view default categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (is_default = true);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables exist
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('expenses', 'categories');

-- Verify RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('expenses', 'categories');

-- Verify policies exist
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('expenses', 'categories');

