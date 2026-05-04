-- Promote a user to admin role.
-- Run in Supabase SQL editor or via psql. Replace <email> with the target.

UPDATE public.users
SET role = 'admin'
WHERE email = '<email>';

-- Verify
SELECT id, email, role FROM public.users WHERE email = '<email>';
