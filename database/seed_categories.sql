-- ============================================
-- Seed Default Categories
-- Run this after creating the categories table
-- ============================================

-- Insert default categories (only if they don't exist)
INSERT INTO categories (name, icon, color, is_default)
VALUES
  ('Food & Dining', 'restaurant', 'orange', true),
  ('Transport', 'directions_bus', 'emerald', true),
  ('Rent', 'home', 'gray', true),
  ('Internet', 'wifi', 'sky', true),
  ('Textbooks', 'menu_book', 'blue', true),
  ('Entertainment', 'sports_esports', 'purple', true),
  ('Other', 'sell', 'slate', true)
ON CONFLICT (name) DO NOTHING;

-- Verify categories were inserted
-- SELECT * FROM categories ORDER BY name;

