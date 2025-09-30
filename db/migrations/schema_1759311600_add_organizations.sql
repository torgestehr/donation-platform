-- Enable needed extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    mission TEXT NOT NULL,
    description TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT organizations_owner_one UNIQUE (owner_id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_approved ON public.organizations(is_approved);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Only approved orgs are visible to everyone; owners can see their own even if not approved
CREATE POLICY "Organizations are viewable if approved or owned by user"
    ON public.organizations
    FOR SELECT
    USING (is_approved OR auth.uid() = owner_id);

-- Only authenticated users can insert, and only as themselves (one-per-user enforced by unique index)
CREATE POLICY "Users can insert exactly one organization they own"
    ON public.organizations
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own organization but cannot self-approve
CREATE POLICY "Owners can update their organization"
    ON public.organizations
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Optional: owners can delete their org (adjust if you want admins only)
CREATE POLICY "Owners can delete their organization"
    ON public.organizations
    FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION public.organizations_handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS organizations_on_update ON public.organizations;
CREATE TRIGGER organizations_on_update
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.organizations_handle_updated_at();

-- Prevent non-service role users from changing approval status
CREATE OR REPLACE FUNCTION public.organizations_prevent_self_approve()
RETURNS TRIGGER AS $$
DECLARE
    jwt_role TEXT;
BEGIN
    -- Extract role from JWT claims; empty when running without JWT (e.g., psql)
    BEGIN
        jwt_role := COALESCE(current_setting('request.jwt.claims', true)::json->>'role', '');
    EXCEPTION WHEN others THEN
        jwt_role := '';
    END;

    IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
        IF jwt_role IS DISTINCT FROM 'service_role' THEN
            RAISE EXCEPTION 'Not authorized to change approval status';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS organizations_prevent_self_approve ON public.organizations;
CREATE TRIGGER organizations_prevent_self_approve
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.organizations_prevent_self_approve();

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT ON public.organizations TO anon;


