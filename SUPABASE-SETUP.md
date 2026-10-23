# Supabase integration setup — CheckmaîtréX

This is a separate working copy. No live website or GitHub files have been changed.

## Before testing

1. In Supabase, open **SQL Editor** and review `supabase/schema-and-rpcs.sql`. It assumes the existing `member_profiles`, `membership_applications`, `club_admins`, and `is_club_admin()` objects from the earlier setup.
2. Run the SQL only after confirming those objects match the expected columns. The script intentionally keeps direct browser table writes revoked and uses narrowly scoped RPC functions.
3. In **Authentication → URL Configuration**, set the Site URL and allowed redirect URLs for your actual preview/deployed domain.
4. For email/password registration, configure email confirmation as desired. If confirmation is enabled, the user must confirm email, sign in, then submit the application. The page tells them if a session is not yet available.
5. Ensure the intended administrator's authenticated user ID is in `public.club_admins`. Never put the service-role key in browser files.
6. Test with a non-admin account: apply, confirm status is pending, and verify it cannot approve itself or read other users' applications. Test admin review separately after the admin UI or trusted SQL/API action is available.

## Current scope and known limits

- `member-login.html` uses Supabase email/password auth and allows the membership destination only when the profile status is `approved`.
- `membership-application.html` creates/signs into a Supabase account and calls `submit_membership_application`.
- `review_membership_application` is the narrow server-side approval/rejection RPC, but this copy does not yet include an admin dashboard UI.
- Google OAuth is not implemented by this change; configure Google provider credentials and callback URLs in Supabase before enabling that flow.
- Membership ID is treated as a unique application identifier. Confirm that this matches the club's real membership policy before production use.
- This is not yet production-certified; test SQL policies, email confirmation behavior, redirects, and duplicate-ID handling in a test project first.
