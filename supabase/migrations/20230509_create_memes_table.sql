
-- Create a memes table to store all meme creations
CREATE TABLE IF NOT EXISTS public.memes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id TEXT NOT NULL,
  template_url TEXT NOT NULL,
  top_text TEXT,
  bottom_text TEXT,
  meme_url TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes INTEGER NOT NULL DEFAULT 0
);

-- Set up RLS policies to manage access control
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own memes
CREATE POLICY IF NOT EXISTS "Users can view their own memes" 
  ON public.memes 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to select public memes
CREATE POLICY IF NOT EXISTS "Anyone can view public memes" 
  ON public.memes 
  FOR SELECT 
  USING (is_public = true);

-- Policy for users to insert their own memes
CREATE POLICY IF NOT EXISTS "Users can insert their own memes" 
  ON public.memes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own memes
CREATE POLICY IF NOT EXISTS "Users can update their own memes" 
  ON public.memes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own memes
CREATE POLICY IF NOT EXISTS "Users can delete their own memes" 
  ON public.memes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add is_pro column to users table if it doesn't exist already
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;
