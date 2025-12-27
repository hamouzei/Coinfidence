# Student Expense Tracker – Frontend Design Specification

## Overview

Design a clean, fast, mobile-first web interface for a **Student Expense Tracker** application.  
The target user is a student with a tight budget who wants to track expenses quickly and securely.  
The design must prioritize **speed, clarity, and trust**.

---

## General Style & Theme

- **Minimal, modern UI**
- **Light mode first** (dark mode support via system preference or toggle)
- **Soft neutral background** (#f8f9fa or similar)
- **One primary accent color** (Blue: #3b82f6 or similar)
- **Rounded corners** (12px-16px border radius)
- **Large, touch-friendly inputs** (min 44x44px touch targets)
- **Clear visual hierarchy** (typography scale, spacing)
- **No clutter, no ads**
- **Material Symbols icons** for consistency

### Typography

- **Headings:** Bold, large (2xl-5xl), dark text
- **Body:** Medium weight, readable size (base), neutral gray
- **Labels:** Semibold, small (sm), dark text
- **Helper text:** Regular, extra small (xs), muted gray

### Spacing

- **Card padding:** 16px-24px
- **Section gaps:** 24px-32px
- **Input spacing:** 12px-16px between fields
- **Component gaps:** 8px-12px

### Colors

- **Primary:** Blue (#3b82f6)
- **Background:** Light gray (#f8f9fa) / Dark (#1a2633)
- **Surface:** White / Dark gray (#1A2633)
- **Text Primary:** Dark (#111418) / White
- **Text Secondary:** Gray (#617589) / Light gray
- **Border:** Light gray (#dbe0e6) / Dark gray (#2e3b4b)
- **Error:** Red (#ef4444)
- **Success:** Green (#10b981)

---

## Screen 1: Authentication (Login & Sign Up)

### Purpose

Secure access with clear separation between login and account creation.

### Layout

- **App logo + name at top** (centered, large icon)
- **Short tagline:** _"Track your spending. Stay in control."_
- **Centered authentication card** (max-width: 440px, rounded-2xl, shadow)
- **Toggle tabs or switch:**
  - Login (left tab)
  - Sign Up (right tab)
- **Background:** Subtle gradient or blur effect

### Login Tab

**Fields**

- **Email input:**
  - Icon: `mail` (left side)
  - Placeholder: "student@university.edu"
  - Type: email
  - Required validation
- **Password input:**
  - Icon: `lock` (left side)
  - Show/hide toggle (eye icon, right side)
  - Placeholder: "Enter your password"
  - Type: password
  - Required validation

**Actions**

- **Primary button:** **Log In** (full width, blue, bold)
- **Secondary text link:** _Forgot password?_ (below button, small, muted)

**States**

- **Loading:** Button shows spinner, disabled
- **Error:** Red message below form: "Invalid email or password."
- **Success:** Redirect to dashboard

---

### Sign Up Tab

**Fields**

- **Email input:**
  - Icon: `mail` (left side)
  - Placeholder: "student@university.edu"
  - Type: email
  - Required validation
- **Password input:**
  - Icon: `lock` (left side)
  - Show/hide toggle
  - Placeholder: "Create a password"
  - Type: password
  - Required validation
- **Confirm password input:**
  - Icon: `lock_reset` (left side)
  - Placeholder: "Re-enter password"
  - Type: password
  - Required validation
  - Must match password field

**Password Helper Text**

- **Minimum length:** "Must be at least 8 characters." (below field, small, muted)
- **Strength indicator:** Optional (simple: weak/medium/strong)

**Actions**

- **Primary button:** **Create Account** (full width, blue, bold)

**After Submit (Verification State)**

- **Success banner** (green background, top of card):
  - Icon: `check_circle` (green)
  - Message: "Verification email sent!"
  - Subtext: "Please check your inbox to activate your account."
  - Dismissible (X button)
- **Resend verification link** option (optional, below banner)
- **Login disabled** until email is verified (show message if attempted)

---

### UX Rules

- **Clear distinction** between Login and Sign Up (active tab highlighted)
- **Inline validation** messages (appear on blur or submit)
- **No auto-login** until email is verified
- **Calm, reassuring tone** in all messages
- **Keyboard navigation** supported (Tab, Enter)
- **Accessibility:** ARIA labels, focus management

---

## Screen 2: Email Verification Confirmation

### Purpose

Clearly confirm the next step after user clicks verification link.

### Elements

- **Success icon** (large, green, centered)
- **Message:**
  > "Your email has been verified successfully."
- **Primary button:** **Continue to Login** (centered, blue, full width on mobile)
- **Layout:** Centered card, similar to auth screen

### States

- **Loading:** Show spinner while verifying token
- **Error:** "Verification link expired or invalid." with "Resend email" option
- **Success:** Show confirmation, then redirect to login

---

## Screen 3: Dashboard (Home)

### Purpose

Instant financial awareness at a glance.

### Top Section

- **Greeting:** _"Hi, [Name]"_ (large, bold, 4xl)
- **Subtext:** "Welcome back to your dashboard" (muted, base)
- **Current month label** (badge, right side):
  - Icon: `calendar_month`
  - Text: "October 2023" (or current month)

### Main Summary Card

- **Background:** White/dark surface, rounded-xl, border, shadow
- **Large text:** **Total spent this month** (5xl-6xl, primary color, bold)
- **Subtext:** _"Across all categories"_ (muted, base)
- **Visual:** Subtle gradient or blur effect in background

### Category Breakdown Section

- **Heading:** "Top Spending" (2xl, bold, left)
- **List of top categories** (max 4-5), each showing:
  - **Icon** (circular, colored background)
  - **Name** (bold, left)
  - **Amount** (bold, right, large)
  - **Percentage bar** (visual indicator, colored)
  - **Card style:** White/dark surface, rounded-xl, border, hover effect

### Primary Action

- **Floating button:** **"+ Add Expense"** (bottom-right, fixed, rounded-full, shadow)
- **Icon:** `add` (Material Symbols)
- **Color:** Primary blue
- **Size:** Large (56px), touch-friendly

### Empty State (No Expenses)

- **Illustration/Icon:** Large, centered, muted
- **Message:** "No expenses yet. Start tracking today."
- **CTA Button:** "Add Your First Expense" (primary button)

---

## Screen 4: Add Expense (Modal / Bottom Sheet)

### Purpose

Add an expense in under 5 seconds.

### Modal Structure

- **Backdrop:** Dark overlay (60% opacity, blur)
- **Modal:** Centered card (max-width: 450px on desktop, full-width bottom sheet on mobile)
- **Header:**
  - Title: "Add New Expense" (xl, bold)
  - Close button: X icon (top-right)
- **Body:** Scrollable content area
- **Footer:** Action buttons (Cancel, Save)

### Fields (in order)

1. **Amount (numeric, large, autofocus)**

   - **Layout:** Centered, large display
   - **Format:** "$" prefix, large number input (6xl font)
   - **Placeholder:** "0.00"
   - **Type:** number, step 0.01
   - **Validation:** Must be > 0, max 999999.99
   - **Helper text:** "Enter amount" (below, muted)

2. **Category selector (icon grid)**

   - **Layout:** 5-column grid (on mobile), 5-7 columns (desktop)
   - **Each category:**
     - Icon (circular, 40px, colored background when selected)
     - Label (truncated, small, below icon)
     - Border highlight when selected
   - **Default selection:** First category (Food)
   - **Categories:** See Category Specification below

3. **Date picker (defaults to today)**

   - **Layout:** Input with calendar icon (left)
   - **Type:** date input (native picker)
   - **Default:** Today's date
   - **Format:** YYYY-MM-DD (ISO format)
   - **Validation:** Cannot be future date (optional)

4. **Optional note field**
   - **Layout:** Text input, full width
   - **Placeholder:** "Add a note (optional)..."
   - **Type:** text
   - **Max length:** 200 characters
   - **Helper text:** Character count (optional)

### Action Buttons

- **Cancel:** Secondary button (outline, left)
- **Save Expense:** Primary button (blue, bold, right, flex-2)
- **Disabled state:** Save disabled until amount > 0 and category selected

### States

- **Loading:** Button shows spinner, all inputs disabled
- **Success:** Close modal, show toast "Expense added successfully"
- **Error:** Show error message below form

---

## Screen 5: Edit Expense (Modal)

### Purpose

Quickly modify an existing expense.

### Modal Structure

- **Same as Add Expense modal** (reusable component)
- **Title:** "Edit Expense" (instead of "Add New Expense")
- **Pre-filled fields:** Amount, category, date, note from existing expense

### Fields

- **Same as Add Expense** (all fields pre-populated)
- **Amount:** Pre-filled with current amount
- **Category:** Pre-selected current category
- **Date:** Pre-filled with current date
- **Note:** Pre-filled with current note

### Action Buttons

- **Cancel:** Secondary button (outline, left)
- **Save Changes:** Primary button (blue, bold, right)
- **Delete button:** Optional, red, below or in header (trash icon)

### Delete Confirmation

- **If delete clicked:** Show confirmation dialog
- **Message:** "Are you sure you want to delete this expense?"
- **Actions:** "Cancel" (secondary), "Delete" (red, destructive)

### States

- **Loading:** Button shows spinner
- **Success:** Close modal, show toast "Expense updated"
- **Error:** Show error message

---

## Screen 6: Expense List (History Page)

### Purpose

Review spending clearly, chronologically.

### Header

- **Title:** "Expense History" (xl, bold, left)
- **Add Expense button** (top-right, primary, icon + text)
- **Filter chips** (below title):
  - "All Categories" (dropdown, selected)
  - "This Month" (chip, optional filter)

### Summary Section

- **Total spent:** Large number (3xl, bold, centered)
- **Subtext:** "Total spent this month" (muted, centered)

### Layout

- **Expenses grouped by date** (sticky date headers)
- **Date labels:**
  - "Today" for current day
  - "Oct 24, 2023" for other dates
  - Sticky header when scrolling

### Each Expense Item

- **Card style:** White/dark surface, rounded-xl, border, hover effect
- **Layout:** Horizontal, flex
- **Left side:**
  - **Category icon** (circular, 48px, colored background)
  - **Text:**
    - **Note or category name** (bold, base, primary text)
    - **Category name** (muted, sm, below)
- **Right side:**
  - **Amount** (bold, base, primary text)
  - **Edit & delete icons** (on hover/click, muted)
    - Edit: `edit` icon
    - Delete: `delete` icon

### Empty State

- **Illustration/Icon:** Large, centered, muted (checklist icon)
- **Message:** "You're all caught up!" or "No expenses yet. Start tracking today."
- **CTA Button:** "Add Your First Expense" (if no expenses)

### Interactions

- **Click expense:** Opens edit modal (optional)
- **Hover:** Shows edit/delete icons
- **Edit icon:** Opens edit modal
- **Delete icon:** Shows confirmation, then deletes

---

## Navigation

### Bottom Navigation Bar (Mobile)

- **Position:** Fixed bottom, above safe area
- **Style:** White/dark surface, rounded-2xl, shadow, backdrop blur
- **Items:** 3 tabs
  - **Home** (icon: `home`, label: "Home")
  - **Expenses** (icon: `receipt_long`, label: "Expenses")
  - **Profile** (icon: `person`, label: "Profile")
- **Active tab:** Highlighted (primary color, filled icon)
- **Inactive tabs:** Muted gray
- **Touch targets:** Minimum 44x44px

### Sidebar (Desktop, Optional)

- **Position:** Left side, fixed
- **Width:** 240px
- **Items:** Same as bottom nav, vertical layout
- **User info:** Top section (avatar, name, email)

---

## Screen 7: Profile / Settings

### Purpose

User account management and app information.

### Layout

- **Header:** "Profile" (xl, bold)
- **User section:**
  - **Avatar** (circular, large, centered or left)
  - **Name** (2xl, bold)
  - **Email** (muted, base)
- **Settings section:**
  - **App version** (muted, xs, bottom)
- **Actions:**
  - **Logout button** (primary, destructive red, full width or right-aligned)

### Minimal v1 Features

- User email (display only)
- Logout button
- App version (e.g., "v1.0.0")
- No advanced settings (keep it simple)

### Future Enhancements (Post-v1)

- Change password
- Delete account
- Export data
- Theme toggle (dark/light)

---

## Category Specification

### Default Categories (7 total)

1. **Food & Dining**

   - Icon: `restaurant`
   - Color: Orange (#f97316)
   - Background: Orange-100 / Orange-900/30 (dark)

2. **Transport**

   - Icon: `directions_bus`
   - Color: Emerald (#10b981)
   - Background: Emerald-100 / Emerald-900/30 (dark)

3. **Rent**

   - Icon: `home`
   - Color: Gray (#6b7280)
   - Background: Gray-100 / Gray-700/30 (dark)

4. **Internet**

   - Icon: `wifi`
   - Color: Sky Blue (#0ea5e9)
   - Background: Sky-100 / Sky-900/30 (dark)

5. **Textbooks**

   - Icon: `menu_book`
   - Color: Blue (#3b82f6)
   - Background: Blue-100 / Blue-900/30 (dark)

6. **Entertainment**

   - Icon: `sports_esports` or `movie`
   - Color: Purple (#a855f7)
   - Background: Purple-100 / Purple-900/30 (dark)

7. **Other**
   - Icon: `sell`
   - Color: Slate (#64748b)
   - Background: Slate-100 / Slate-700/30 (dark)

### Category Display Rules

- **Icons:** Material Symbols, 20-24px size
- **Selection:** 5-column grid in modal
- **Cards:** Circular icon (40-48px), colored background
- **Colors:** Consistent across app (icons, bars, highlights)

---

## Date & Time Handling

### Date Format

- **Storage:** ISO 8601 (YYYY-MM-DD)
- **Display:**
  - **Today:** "Today"
  - **Yesterday:** "Yesterday"
  - **This year:** "Oct 24" (month + day)
  - **Other:** "Oct 24, 2023" (full date)
- **Timezone:** User's local timezone for display, UTC for storage

### Month Calculation

- **"This month":** Current calendar month (e.g., October 1-31, 2023)
- **Dashboard:** Shows expenses from current calendar month only
- **History:** Shows all expenses, grouped by date

---

## Error Handling & Validation

### Form Validation

- **Email:** Valid email format, required
- **Password:** Minimum 8 characters, required
- **Amount:** Positive number, max 999999.99, required
- **Date:** Valid date, not in future (optional), required
- **Note:** Max 200 characters, optional

### Error Messages

- **Inline errors:** Appear below field, red text, small
- **Network errors:** Toast notification, "Connection failed. Please check your internet."
- **Auth errors:** Below form, "Invalid email or password."
- **Server errors:** Toast, "Something went wrong. Please try again."
- **Validation errors:** Inline, specific to field

### Success Messages

- **Toast notifications:** Green, top-right or bottom, auto-dismiss (3 seconds)
- **Examples:**
  - "Expense added successfully"
  - "Expense updated"
  - "Expense deleted"
  - "Email verification sent"

---

## Loading States

### Indicators

- **Button loading:** Spinner icon, disabled state
- **Page loading:** Skeleton screens (preferred) or spinner
- **List loading:** Skeleton cards
- **Modal loading:** Disable inputs, show spinner on button

### Skeleton Screens

- **Dashboard:** Skeleton cards for summary and categories
- **History:** Skeleton expense cards
- **Profile:** Skeleton user info

---

## Accessibility & Performance

### Accessibility

- **Keyboard navigation:** Tab, Enter, Escape keys
- **Screen readers:** ARIA labels, semantic HTML
- **Focus management:** Visible focus indicators, logical tab order
- **Color contrast:** WCAG AA compliant (4.5:1 for text)
- **Touch targets:** Minimum 44x44px

### Performance

- **Initial load:** < 2 seconds
- **Navigation:** < 500ms
- **API calls:** Optimistic updates, loading states
- **Bundle size:** Optimized, code splitting
- **Images:** Optimized, lazy loading
- **Animations:** 60fps, GPU-accelerated

### Mobile Optimization

- **Responsive design:** Mobile-first, breakpoints at 640px, 768px, 1024px
- **Touch interactions:** Swipe gestures (optional), large buttons
- **Keyboard:** Proper input types (number, email, date)
- **Viewport:** Proper meta tags, safe area handling

---

## Animation & Transitions

### Transitions

- **Modal enter/exit:** Fade + scale (200ms)
- **Button hover:** Color change, slight scale (150ms)
- **Card hover:** Shadow increase, border highlight (200ms)
- **List items:** Fade in on load (staggered, 100ms delay)
- **Toast:** Slide in from top/bottom (300ms)

### Micro-interactions

- **Button press:** Scale down (0.98) on active
- **Icon hover:** Slight rotation or color change
- **Input focus:** Border color change, ring effect

---

## Overall Product Feel

**Secure. Fast. Calm. Student-friendly.**  
The user should trust the app with their data and feel in control of their money.

### Design Principles

1. **Clarity over cleverness:** Simple, obvious UI
2. **Speed over features:** Fast interactions, minimal steps
3. **Trust through transparency:** Clear data, secure feel
4. **Calm, not stressful:** Soothing colors, friendly copy
5. **Mobile-first:** Works perfectly on phone

---

## Component Library Reference

### Buttons

- **Primary:** Blue background, white text, bold, rounded-xl, shadow
- **Secondary:** Outline, gray border, rounded-xl
- **Icon:** Circular, icon only, hover effect
- **Destructive:** Red background (for delete actions)

### Inputs

- **Text/Email/Password:** Rounded-xl, border, focus ring, icon (left)
- **Number:** Same as text, numeric keyboard on mobile
- **Date:** Native date picker, calendar icon
- **Textarea:** Same styling, multi-line

### Cards

- **Surface:** White/dark, rounded-xl, border, shadow-sm
- **Hover:** Shadow-md, border highlight
- **Padding:** 16-24px

### Modals

- **Backdrop:** Dark overlay, blur
- **Modal:** Centered, rounded-2xl, shadow-2xl, max-width
- **Mobile:** Bottom sheet style (slides up from bottom)

---

## Implementation Notes

### Technology Stack

- **Framework:** React + Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Icons:** Material Symbols (Google Fonts)
- **State:** React hooks (useState, useEffect)
- **Forms:** Controlled components

### File Structure

```
components/
  - ExpenseModal.tsx (add/edit)
  - CategorySelector.tsx
  - Button.tsx
  - Input.tsx
pages/
  - Auth.tsx
  - Dashboard.tsx
  - History.tsx
  - Profile.tsx
types/
  - index.ts (Category enum, Expense interface)
```

---

This specification should guide all frontend development. When in doubt, prioritize **speed, clarity, and student needs**.
