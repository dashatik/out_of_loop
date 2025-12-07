# Security Guide

This document outlines the security measures implemented in this AI chat application and provides guidance for secure deployment.

## Security Improvements Implemented

### 1. Authentication & Authorization
- **User Authentication**: Firebase Authentication is required for all users
- **API Protection**: All API routes now require authenticated user ID
- **Session Management**: Firebase handles secure session management automatically

### 2. Rate Limiting
- **Per-User Limits**: 20 requests per minute per authenticated user
- **Protection**: Prevents API abuse and controls costs
- **Implementation**: In-memory rate limiting (resets on deployment)

### 3. Input Validation
- **Message Validation**:
  - Checks that messages are strings
  - Ensures messages are not empty after trimming
  - Maximum length: 10,000 characters
- **Prevents**: Injection attacks and API abuse

### 4. Security Headers
The application now includes comprehensive security headers:
- `X-Frame-Options`: Prevents clickjacking attacks
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `X-XSS-Protection`: Enables browser XSS protection
- `Content-Security-Policy`: Restricts resource loading
- `Permissions-Policy`: Disables unnecessary browser features
- `Referrer-Policy`: Controls referrer information

### 5. API Key Management
**Current Implementation** (User-provided keys):
- Users provide their own OpenAI API keys
- Keys are stored in browser localStorage
- Each request includes the user's API key

**Production Recommendation** (See Server-Side Implementation below)

## Critical Security Issues Remaining

### 1. OpenAI API Keys in localStorage
**Risk**: API keys stored in browser localStorage can be accessed via:
- Browser DevTools
- XSS attacks
- Malicious browser extensions

**Recommended Solution**: Implement server-side API key management (see below)

### 2. Firebase Credentials Exposure
**Risk**: Your current Firebase credentials in `.env.local` are exposed in git history

**Required Actions**:
1. Rotate Firebase credentials:
   - Go to Firebase Console > Project Settings
   - Under "Your apps", remove the current app
   - Create a new Web app with new credentials
   - Update `.env.local` with new credentials

2. Configure Firebase Security Rules:
   ```javascript
   // Firestore Security Rules
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. Remove sensitive files from git history:
   ```bash
   # Remove .env.local from git history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all

   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

### 3. Chat Mode Prompts (ToS Violation)
**Risk**: Current chat modes contain "jailbreak" prompts that attempt to bypass OpenAI safety guidelines

**Required Action**:
- Remove prompts: "Omega", "Developer Mode", "AIM", "UCAR", "Myuiri Jailbreak", "Financial Adviser"
- Replace with legitimate system prompts
- Using these prompts violates OpenAI's Terms of Service and could result in API access being revoked

## Production Deployment Checklist

### Before Going to Production:


- [ ] **Rotate Firebase credentials** and remove from git history
- [ ] **Set up Firebase Security Rules** (see above)
- [ ] **Implement server-side API key management** (see below)
- [ ] **Add Firebase service account** for server-side auth verification
- [ ] **Enable HTTPS only** (Vercel does this automatically)
- [ ] **Set up monitoring** and error tracking (Sentry, LogRocket, etc.)
- [ ] **Review and test rate limits** for your expected usage
- [ ] **Add API cost monitoring** to prevent unexpected bills
- [ ] **Implement proper error handling** and user-friendly error messages
- [ ] **Add logging** for security events (failed auth, rate limit hits, etc.)
- [ ] **Test authentication flows** thoroughly
- [ ] **Run security audit**: `npm audit fix`
- [ ] **Update dependencies** to latest secure versions

## Recommended: Server-Side API Key Management

Instead of users providing their own keys, implement server-side key management:

### Option 1: Single Shared API Key (Simpler)

1. Add your OpenAI API key to environment variables:
   ```env
   OPENAI_API_KEY=sk-...your-key-here
   ```

2. Update `/api/chat/route.ts`:
   ```typescript
   const apiKey = process.env.OPENAI_API_KEY;
   if (!apiKey) {
     return NextResponse.json(
       { error: 'Server configuration error' },
       { status: 500 }
     );
   }
   ```

3. Remove API key input from settings panel
4. Implement usage quotas per user
5. Add billing/subscription system if needed

### Option 2: Per-User API Keys in Database (More Secure)

1. Store API keys in Firestore with encryption
2. Retrieve user's key server-side only
3. Never expose keys to client

## Firebase Admin Setup (For Production)

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Add to environment variables:
   ```env
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
5. Enable server-side Firebase auth verification

## Monitoring & Alerts

Set up monitoring for:
- **Authentication failures**: Unusual auth attempt patterns
- **Rate limit hits**: Users hitting rate limits frequently
- **API errors**: OpenAI API errors or failures
- **Costs**: Daily/weekly OpenAI API spending
- **Security events**: Suspicious activity patterns

## Incident Response

If you suspect a security breach:

1. **Immediately rotate** all API keys (OpenAI, Firebase)
2. **Review logs** for suspicious activity
3. **Force logout** all users by regenerating Firebase credentials
4. **Assess impact**: What data was potentially accessed?
5. **Notify users** if their data was compromised
6. **Document** the incident and response
7. **Implement fixes** to prevent recurrence

## Security Best Practices for Users

Inform your users to:
- Use strong, unique passwords
- Never share their API keys
- Log out on shared devices
- Report suspicious activity
- Keep their OpenAI API key secure (if user-provided keys)

## Regular Security Maintenance

- **Weekly**: Review error logs and security alerts
- **Monthly**:
  - Run `npm audit` and update dependencies
  - Review Firebase security rules
  - Check for unusual API usage patterns
- **Quarterly**:
  - Full security review
  - Rotate API keys
  - Review and update security policies

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OpenAI API Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)

## Contact

For security concerns or to report vulnerabilities, please contact: [your-email@example.com]

---

**Last Updated**: December 2025
**Security Review Required**: Before production deployment
