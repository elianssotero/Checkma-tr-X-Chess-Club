# CheckmaîtréX Chess Club — Updated ZIP

This ZIP is based on the source ZIP you supplied. Existing website files and public pages are preserved.

## Additions
- `login-selection.html` — separate choice page for Google Login, Member Login, and membership application.
- `google-login.html` — Google login UI placeholder.
- `member-login.html` — member login UI placeholder.
- `membership-application.html` — membership application UI placeholder (Full Name + Membership ID).
- `auth-pages.css` — styles for the new pages.

## Small routing updates
- The homepage quick-access Login action now opens `login-selection.html`.
- The membership page has an additional link to `membership-application.html`.
- The original `login.html` and all other existing pages/assets remain in place.

## Important security note
This is a front-end UI update, not a production authentication system. Google sign-in, member credential verification, application submission, persistent membership status, admin approval, email notifications, and audit logs are NOT connected. The new forms do not transmit or save credentials or applications. Do not treat the pages as production authentication until a secure backend (for example, Supabase Auth + database policies) is configured and tested.

## Safe testing
1. Keep a backup of your current repository.
2. Extract this ZIP into a separate folder and test `index.html` and all new pages.
3. Compare the changes before uploading to GitHub. Do not delete the original repository as a first step.
