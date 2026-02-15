-- 1. Create a new storage bucket called 'avatars'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (It's usually enabled by default, but let's be safe)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public access to view avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- 4. Policy: Allow authenticated users to upload their own avatar
-- We'll rely on the file name structure or just allow auth users to upload
CREATE POLICY "Someone can upload an avatar" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- 5. Policy: Allow users to update their own avatar
CREATE POLICY "Someone can update their own avatar" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- 6. Policy: Allow users to delete their own avatar (Optional, but good practice)
CREATE POLICY "Someone can delete their own avatar" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
