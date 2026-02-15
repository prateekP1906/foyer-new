-- 1. Ensure the user_id column exists (Critical for RLS)
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users DEFAULT auth.uid();

-- 2. Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to ensure clean state (avoids "policy already exists" errors)
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can insert their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their own appointments" ON appointments;

-- 4. Re-create policies for full CRUD access
CREATE POLICY "Users can view their own appointments" 
ON appointments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments" 
ON appointments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" 
ON appointments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments" 
ON appointments FOR DELETE 
USING (auth.uid() = user_id);
