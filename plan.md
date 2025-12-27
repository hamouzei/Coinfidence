# Coinfidence — Phased Implementation Plan

## Guiding Principles

- Ship usable features early
- Optimize for student speed and clarity
- Keep backend simple (Supabase as BaaS)
- Avoid over-engineering
- Each phase must end with something testable

---

## Phase 0 — Foundation & Planning

**Goal:** Prepare the ground before coding.

### Tasks

- Finalize product scope (v1 only)
- Lock target user: Students
- Freeze core features list
- Choose stack:
  - Frontend: React + Vite
  - Routing: React Router
  - Backend: Supabase (Auth + DB)
  - Styling: Tailwind CSS
  - Icons: Material Symbols
- Create Git repository
- Setup basic project structure

### Deliverables

- Git repo initialized
- README with product description
- Clear v1 feature list
- Project structure with folders: `components/`, `pages/`, `services/`, `types/`

---

## Phase 1 — UI & UX (Frontend Only, No Backend)

**Goal:** Build the full user experience without real data.

### Tasks

- **Design all screens:**
  - Login / Sign Up (with tab toggle)
  - Email verification confirmation screen
  - Dashboard (home)
  - Add Expense modal
  - Edit Expense modal (with delete confirmation)
  - Expense list (History page)
  - Profile
- **Create reusable UI components:**
  - Buttons (primary, secondary, icon buttons, destructive)
  - Inputs (text, email, password with show/hide toggle, date, number)
  - Modals (with backdrop, close button, animations)
  - Cards (summary cards, expense cards)
  - Category selector (icon grid, 5-column layout)
  - Bottom navigation bar (mobile)
  - Sidebar (desktop, optional)
  - Toast notifications (success/error messages)
  - Delete confirmation dialog
  - Loading skeletons/spinners
  - Empty state components
- **Implement styling system:**
  - Tailwind CSS configuration
  - Typography scale (headings, body, labels, helper text)
  - Color palette (primary, background, surface, text, error, success)
  - Spacing system (padding, gaps, margins)
  - Border radius (12px-16px for cards, rounded-full for buttons)
  - Dark mode support (system preference or toggle)
  - Material Symbols icons integration
- **Implement navigation:**
  - React Router setup
  - Protected route logic (mock authentication)
  - Bottom nav for mobile (Home, Expenses, Profile)
  - Sidebar for desktop (optional)
  - Active route highlighting
  - Smooth page transitions
- **Use mock data for expenses:**
  - Sample expenses with all categories
  - Mock user data (name, email, avatar)
  - Date variety (today, yesterday, this week, this month)
- **Implement frontend validation:**
  - Email format validation (regex)
  - Password strength (min 8 chars, show requirement text)
  - Confirm password matching (sign up only)
  - Amount validation (positive numbers, max 999999.99)
  - Date validation (not future dates, optional)
  - Note character limit (200 chars, show count)
  - Required field validation
  - Inline error messages (appear on blur or submit)
- **Implement category system:**
  - Default categories with icons (see Category Specification)
  - Category color coding (consistent across app)
  - Category icon mapping (Material Symbols)
  - Category selector grid (5-column on mobile)
  - Category display in cards (circular icons, colored backgrounds)
- **Implement UI states:**
  - Loading states (button spinners, skeleton screens)
  - Empty states (dashboard, history page)
  - Error states (form validation, network errors)
  - Success states (toast notifications)
  - Hover states (cards, buttons, icons)
  - Disabled states (buttons, inputs)
- **Implement date formatting:**
  - Display logic: "Today", "Yesterday", "Oct 24, 2023"
  - Date grouping for expense list
  - Current month calculation for dashboard
  - ISO 8601 format for storage (YYYY-MM-DD)
- **Implement interactions:**
  - Modal animations (fade + scale, 200ms)
  - Button hover effects (color change, slight scale)
  - Card hover effects (shadow increase, border highlight)
  - Toast notifications (auto-dismiss after 3 seconds)
  - Delete confirmation dialog
  - Password show/hide toggle
  - Category selection feedback
- **Implement accessibility:**
  - ARIA labels for icons and buttons
  - Keyboard navigation (Tab, Enter, Escape)
  - Focus management (visible focus indicators)
  - Screen reader support (semantic HTML)
  - Touch targets (minimum 44x44px)
  - Color contrast (WCAG AA compliant)
- **Implement responsive design:**
  - Mobile-first approach
  - Breakpoints: 640px, 768px, 1024px
  - Bottom sheet modal on mobile
  - Centered modal on desktop
  - Responsive typography
  - Touch-friendly inputs

### Category Specification

**Default Categories (7 total):**

1. **Food & Dining** - Icon: `restaurant` - Color: Orange
2. **Transport** - Icon: `directions_bus` - Color: Blue/Emerald
3. **Rent** - Icon: `home` - Color: Gray
4. **Internet** - Icon: `wifi` - Color: Sky Blue
5. **Textbooks** - Icon: `menu_book` - Color: Blue/Emerald
6. **Entertainment** - Icon: `sports_esports` or `movie` - Color: Purple
7. **Other** - Icon: `sell` - Color: Slate

**Category Properties:**

- Each category has: name, icon (Material Symbols), color theme
- Categories are fixed in v1 (no custom categories)
- Categories stored as enum in TypeScript
- Icons displayed in 5-column grid for selection

### Deliverables

- **Fully navigable frontend:**
  - All 7 screens implemented and connected
  - Smooth navigation between pages
  - Active route highlighting
- **Expense management flows:**
  - Add expense modal (all fields, validation, category selector)
  - Edit expense modal (pre-filled, delete confirmation)
  - Expense list with date grouping ("Today", "Oct 24, 2023")
  - Delete confirmation dialog
- **UI components library:**
  - All reusable components (buttons, inputs, modals, cards)
  - Consistent styling across all components
  - Dark mode support
- **User experience:**
  - Empty states for dashboard and history
  - Loading skeletons for better perceived performance
  - Toast notifications for user feedback
  - Smooth animations and transitions
  - Responsive design (mobile, tablet, desktop)
- **Accessibility:**
  - Keyboard navigation working
  - Screen reader compatible
  - Proper focus management
  - WCAG AA color contrast
- **Validation & error handling:**
  - All form validations working
  - Inline error messages
  - Password show/hide toggle
  - Character count for notes
- **Category system:**
  - All 7 categories with icons and colors
  - Category selector functional (5-column grid)
  - Category display in cards and lists
- **All screens match frontend.md specifications exactly**

---

## Phase 2 — Supabase Setup & Authentication

**Goal:** Secure user access.

### Tasks

- Create Supabase project
- Configure Email/Password authentication
- Enable email verification
- Configure email templates (Supabase default or custom)
- Create auth UI logic:
  - Sign up flow
  - Login flow
  - Logout flow
  - Email verification check
  - Resend verification email
- Protect private routes:
  - Route guards for authenticated users
  - Redirect unauthenticated users to login
  - Handle auth state changes
- Handle auth states:
  - Loading states (spinner, disabled buttons)
  - Error messages (invalid credentials, network errors)
  - Success states (verification sent, login success)
- Session management:
  - Persist sessions on refresh
  - Handle token refresh
  - Clear session on logout

### Deliverables

- Users can sign up, verify email, and log in
- Only authenticated users can access app
- Sessions persist on refresh
- Clear error messaging for auth failures
- Email verification flow complete

---

## Phase 3 — Database & Security (RLS)

**Goal:** Secure and structured data storage.

### Tasks

- Design database schema:
  - `expenses` table:
    - `id` (UUID, primary key)
    - `user_id` (UUID, foreign key to auth.users)
    - `amount` (DECIMAL(10,2), NOT NULL)
    - `category` (TEXT, NOT NULL, enum constraint)
    - `date` (DATE, NOT NULL)
    - `note` (TEXT, nullable)
    - `created_at` (TIMESTAMP, default now())
    - `updated_at` (TIMESTAMP, default now())
  - `categories` table (optional, for future extensibility):
    - `id` (UUID, primary key)
    - `name` (TEXT, UNIQUE)
    - `icon` (TEXT)
    - `color` (TEXT)
    - `is_default` (BOOLEAN)
- Create tables in Supabase SQL Editor
- Enable Row Level Security (RLS) on all tables
- Write RLS policies:
  - Users can only SELECT their own expenses
  - Users can only INSERT expenses with their own user_id
  - Users can only UPDATE their own expenses
  - Users can only DELETE their own expenses
- Create database indexes:
  - Index on `expenses.user_id` for fast queries
  - Index on `expenses.date` for date filtering
  - Index on `expenses.category` for category aggregation
- Seed default categories (if using categories table)
- Test RLS policies with different user accounts

### Deliverables

- Secure database structure
- Users can only access their own data
- RLS policies tested and verified
- Database indexes for performance
- Categories available (either enum or seeded table)

---

## Phase 4 — Connect Frontend to Supabase (Core Logic)

**Goal:** Make Coinfidence real.

### Tasks

- Replace mock data with Supabase queries
- Create Supabase client service:
  - Initialize Supabase client
  - Handle connection errors
  - Configure realtime subscriptions (optional for v1)
- Implement CRUD operations:
  - **Add expense:**
    - Insert into `expenses` table
    - Validate data before insert
    - Show success/error feedback
    - Refresh expense list
  - **Fetch expenses:**
    - Query by user_id
    - Order by date (descending)
    - Filter by current month (for dashboard)
    - Handle empty states
  - **Edit expense:**
    - Update existing expense
    - Validate changes
    - Optimistic UI update
    - Show success/error feedback
  - **Delete expense:**
    - Soft delete or hard delete
    - Confirm before deletion
    - Refresh expense list
- Handle loading & error states:
  - Loading spinners during queries
  - Error messages for network failures
  - Retry mechanisms for failed requests
  - Graceful degradation
- Optimistic UI updates:
  - Update UI immediately on add/edit/delete
  - Rollback on error
  - Show loading indicators
- Date handling:
  - Store dates in UTC
  - Display dates in user's local timezone
  - Format dates consistently (e.g., "Oct 24, 2023")
  - Group expenses by date for list view

### Deliverables

- Real expense tracking
- Data persists across sessions
- Core product usable end-to-end
- All CRUD operations working
- Error handling robust

---

## Phase 5 — Dashboard Insights

**Goal:** Provide meaningful clarity.

### Tasks

- Implement monthly total calculation:
  - Filter expenses by current calendar month
  - Sum all amounts
  - Display formatted total (e.g., "$481.50")
  - Handle empty month (show $0.00)
- Create category aggregation queries:
  - Group expenses by category
  - Sum amounts per category
  - Sort by amount (descending)
  - Limit to top 4-5 categories
- Display clean summary UI:
  - Large, prominent total
  - Category breakdown cards
  - Percentage bars for visual comparison
  - Category icons and colors
- Calculate spending trends (optional for v1):
  - Compare to previous month
  - Show percentage change
- Optimize queries for performance:
  - Use database aggregation functions
  - Cache results if needed
  - Minimize data transfer
- Handle edge cases:
  - No expenses this month
  - Single expense
  - All expenses in one category

### Deliverables

- Monthly spending visible at a glance
- Category breakdown accurate
- Dashboard loads quickly (< 1 second)
- Visual hierarchy clear

---

## Phase 6 — Polish & UX Optimization

**Goal:** Make it feel professional.

### Tasks

- Improve empty states:
  - Friendly illustrations or icons
  - Helpful messaging
  - Clear call-to-action buttons
- Add subtle animations:
  - Modal enter/exit animations
  - Button hover effects
  - List item transitions
  - Loading skeleton screens
- Improve error messaging:
  - User-friendly error text
  - Actionable error messages
  - Error recovery suggestions
  - Toast notifications for feedback
- Ensure fast load times:
  - Optimize bundle size
  - Lazy load routes
  - Minimize API calls
  - Cache static assets
- Mobile UX testing:
  - Test on real devices
  - Verify touch targets (min 44x44px)
  - Test keyboard interactions
  - Verify bottom nav accessibility
- Accessibility improvements:
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
  - Focus management
- Form improvements:
  - Auto-focus first input
  - Enter key submits forms
  - Clear validation messages
  - Disable submit during processing

### Deliverables

- Smooth, calm user experience
- No obvious UX friction
- Fast performance (< 2s initial load)
- Accessible to all users

---

## Phase 7 — Testing & Hardening

**Goal:** Reduce bugs and edge cases.

### Tasks

- Manual testing of all flows:
  - Sign up → Verify → Login → Add expense → Edit → Delete
  - Test all navigation paths
  - Test all error scenarios
- Auth edge cases testing:
  - Expired sessions
  - Invalid tokens
  - Network interruptions during auth
  - Email verification link reuse
- RLS validation testing:
  - Test with multiple user accounts
  - Verify users can't access others' data
  - Test direct database access attempts
- Data validation testing:
  - Very large amounts
  - Negative amounts (should be prevented)
  - Future dates
  - Very old dates
  - Special characters in notes
  - Empty strings
- Slow internet simulation:
  - Test with throttled network
  - Verify loading states work
  - Test timeout handling
- Cross-device testing:
  - Mobile (iOS, Android)
  - Tablet
  - Desktop (Chrome, Firefox, Safari)
- Browser compatibility:
  - Test in major browsers
  - Verify CSS compatibility
  - Test JavaScript features

### Deliverables

- Stable, reliable app
- Confidence in security
- No critical bugs
- Works across devices

---

## Phase 8 — Deployment

**Goal:** Make it public.

### Tasks

- Deploy frontend:
  - Choose platform (Vercel recommended for React)
  - Connect Git repository
  - Configure build settings
  - Set up custom domain (optional)
- Configure environment variables:
  - Supabase URL
  - Supabase Anon Key
  - Any other API keys
  - Set production vs development configs
- Test production auth & DB:
  - Verify sign up works
  - Verify email verification works
  - Test all CRUD operations
  - Verify RLS still works
- Setup basic monitoring:
  - Error tracking (Sentry or similar)
  - Analytics (optional, privacy-focused)
  - Uptime monitoring
- Performance optimization:
  - Enable CDN
  - Optimize images
  - Enable compression
- Security checks:
  - Verify HTTPS
  - Check CORS settings
  - Verify environment variables not exposed

### Deliverables

- Live Coinfidence app
- Production-ready environment
- Monitoring in place
- Fast, secure deployment

---

## Phase 9 — Post-v1 Improvements (Optional)

**Goal:** Enhance without bloating.

### Possible Additions

- Monthly budgets (set limit, track progress)
- Recurring expenses (subscriptions, rent)
- Export to CSV (for spreadsheet analysis)
- Dark mode toggle (if not already implemented)
- PWA support (offline capability, installable)
- Expense search and filtering
- Multi-currency support
- Receipt photo uploads
- Category customization

---

## Definition of Done (v1)

- Student can sign up & verify email
- Student can add expenses in < 5 seconds
- Student can edit and delete expenses
- Monthly summary is clear and accurate
- Category breakdown shows top spending
- Data is secure & private (RLS verified)
- App is fast and stable (< 2s load time)
- Works on mobile and desktop
- No critical bugs or security issues

---

## Technical Specifications

### Date Handling

- **Storage:** UTC timestamps in database
- **Display:** User's local timezone
- **Format:** "Oct 24, 2023" for list, "Today" for current day
- **Month Calculation:** Calendar month (e.g., October 1-31, 2023)

### Amount Formatting

- **Storage:** DECIMAL(10,2) in database
- **Display:** "$XX.XX" format (2 decimal places)
- **Validation:** Positive numbers only, max 999999.99

### Error Handling Patterns

- **Network Errors:** "Connection failed. Please check your internet."
- **Auth Errors:** "Invalid email or password."
- **Validation Errors:** Inline messages below fields
- **Server Errors:** "Something went wrong. Please try again."
- **Timeout:** "Request timed out. Please try again."

---

## Final Note

**Coinfidence is not built by adding features — it's built by removing friction.**  
Every phase should be evaluated by asking:

> "Does this make a student's life easier?"

Only then, move to the next phase.
