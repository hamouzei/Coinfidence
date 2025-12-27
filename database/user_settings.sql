-- ============================================
-- User Settings Table
-- Stores user preferences like budget limit
-- ============================================

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_budget DECIMAL(10, 2) DEFAULT 600.00 CHECK (monthly_budget > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Updated_at trigger
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to get or create user settings
CREATE OR REPLACE FUNCTION get_or_create_user_settings(p_user_id UUID)
RETURNS user_settings AS $$
DECLARE
  v_settings user_settings;
BEGIN
  -- Try to get existing settings
  SELECT * INTO v_settings
  FROM user_settings
  WHERE user_id = p_user_id;

  -- If no settings exist, create default
  IF v_settings IS NULL THEN
    INSERT INTO user_settings (user_id, monthly_budget)
    VALUES (p_user_id, 600.00)
    RETURNING * INTO v_settings;
  END IF;

  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

