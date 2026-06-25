-- Returns subscriber counts per plan
CREATE OR REPLACE FUNCTION public.membership_subscriber_counts()
RETURNS TABLE(plan_id text, count int)
LANGUAGE sql STABLE
AS $$
  SELECT plan_id, COUNT(*)::int FROM public.memberships GROUP BY plan_id ORDER BY plan_id;
$$;
