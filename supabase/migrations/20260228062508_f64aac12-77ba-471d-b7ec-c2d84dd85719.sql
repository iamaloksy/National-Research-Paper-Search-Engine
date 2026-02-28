
-- Drop overly permissive policies on papers
DROP POLICY IF EXISTS "Papers can be inserted via service role" ON public.papers;
DROP POLICY IF EXISTS "Papers can be updated via service role" ON public.papers;
DROP POLICY IF EXISTS "Papers can be deleted via service role" ON public.papers;

-- Only admins can insert papers
CREATE POLICY "Admins can insert papers"
ON public.papers FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update papers
CREATE POLICY "Admins can update papers"
ON public.papers FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete papers
CREATE POLICY "Admins can delete papers"
ON public.papers FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
