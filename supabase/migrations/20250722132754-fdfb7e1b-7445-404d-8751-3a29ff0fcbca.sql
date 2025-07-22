
-- Create table for user invitations
CREATE TABLE public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role public.app_role DEFAULT 'student',
  invite_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_invitations
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_invitations
CREATE POLICY "Admins can manage invitations" 
ON public.user_invitations FOR ALL 
USING (is_admin_or_instructor(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_user_invitations_updated_at
BEFORE UPDATE ON public.user_invitations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to sync missing profiles
CREATE OR REPLACE FUNCTION public.sync_missing_profiles()
RETURNS TABLE(synced_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  sync_count INTEGER := 0;
BEGIN
  -- Insert profiles for users that don't have them
  INSERT INTO public.profiles (id, first_name, last_name, role)
  SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data ->> 'first_name', 'User'),
    COALESCE(au.raw_user_meta_data ->> 'last_name', split_part(au.email, '@', 1)),
    'student'::app_role
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL;
  
  GET DIAGNOSTICS sync_count = ROW_COUNT;
  RETURN QUERY SELECT sync_count;
END;
$$;

-- Create table for bulk import sessions
CREATE TABLE public.bulk_import_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  total_records INTEGER NOT NULL,
  successful_imports INTEGER DEFAULT 0,
  failed_imports INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_log JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE NULL
);

-- Enable RLS on bulk_import_sessions
ALTER TABLE public.bulk_import_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for bulk_import_sessions
CREATE POLICY "Admins can manage import sessions" 
ON public.bulk_import_sessions FOR ALL 
USING (is_admin_or_instructor(auth.uid()));
