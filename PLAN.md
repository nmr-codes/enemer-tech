# Implementation Plan: Authentication System (Google, GitHub, Email)

## 1. User Requirements (Action Required by You)
> [!IMPORTANT]
> You must provide the following credentials and add them to your `.env` file before we can proceed. 

Please gather the following variables and add them to your `.env` file:
```env
# NextAuth Core
AUTH_SECRET="" # Generate using: openssl rand -base64 32

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth (Get from GitHub Developer Settings -> OAuth Apps)
GITHUB_ID=""
GITHUB_SECRET=""

# Email Magic Link (SMTP Server settings, e.g., Resend, Sendgrid, or Gmail)
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="noreply@enemer.tech"
```

## 2. Open Questions
> [!WARNING]
> Please answer these questions so we can align on the exact requirements.

1. **Who is this login for?** Currently, your app has an `/admin/login` restricted to the `ADMIN` role. Are these new providers (Google, GitHub, Email) meant to let *anyone* log in and interact with the site, or are they just alternative ways for *you* to log into the Admin panel? 
2. **Admin Restriction:** If it is only for you, should we restrict these logins so that only your specific email address(es) can successfully sign in?
3. **Email Provider:** Do you have a preferred SMTP provider for the Magic Links (e.g. Resend, standard Gmail, SendGrid)?

## 3. Proposed Changes

### Database Updates
- Modify `schema.prisma` to add the `VerificationToken` model which is required by NextAuth for handling Email Magic Links.

### Dependencies
- Install `@auth/prisma-adapter` to connect NextAuth sessions and accounts to Prisma.
- Install `nodemailer` to send the magic link emails.

### Auth Configuration
- Update `auth.ts` to import and inject `@auth/prisma-adapter`.
- Add `Google`, `GitHub`, and `Nodemailer` (Email) to the `providers` array alongside your existing Credentials provider.

### UI Additions
- Redesign the `app/admin/login/page.tsx` login screen to include Social Auth Buttons ("Sign in with Google", "Sign in with GitHub").
- Add a new section for Magic Link inputs ("Sign in with Email").

## 4. Verification Plan
- **Database Generation**: Run `npx prisma db push` to create the `VerificationToken` table.
- **Provider Tests**:
  - Test Google OAuth login flow and ensure it creates an `Account` and `User` in the database.
  - Test GitHub OAuth login flow.
  - Test sending and clicking an email magic link.
- **Authorization**: Ensure that logging in with these providers grants the correct access roles.
