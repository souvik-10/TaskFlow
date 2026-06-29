# TaskFlow - Personal Task Management

TaskFlow is a lightweight, production-quality personal task management application built using React, TypeScript, Firebase Authentication, and Cloud Firestore. It emphasizes clean software engineering practices, maintainability, and thoughtful technical decisions.

## Features

- **Authentication**: Secure User Registration and Login via Firebase Auth.
- **Protected Routes**: Ensuring only authenticated users can access the dashboard.
- **Task Management**: Full CRUD (Create, Read, Update, Delete) functionality for tasks.
- **Data Privacy**: Users can only read, create, update, and delete their own tasks.
- **Responsive UI**: A modern, glassmorphism-inspired design with rich aesthetics and vanilla CSS.
- **Meaningful Error Handling**: User-friendly notifications using `react-hot-toast`.

## Technology Stack

- **Frontend Core**: React 18 (Functional Components, Hooks, Context API)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Modern aesthetic, variables, flexbox/grid)
- **Backend/Database**: Firebase (Auth & Cloud Firestore)
- **Routing**: React Router DOM v6
- **Tooling**: Vite

## Folder Structure

```text
src/
├── assets/         # Static assets like images/icons
├── components/     # Reusable UI components (TaskItem, TaskForm)
├── contexts/       # Global React Contexts (AuthContext)
├── firebase/       # Firebase initialization and configuration
├── hooks/          # Custom React Hooks
├── pages/          # Top-level route components (Dashboard, Login, Register)
├── routes/         # Routing utilities (ProtectedRoute)
├── services/       # API and database interaction layers (taskService)
├── types/          # TypeScript interfaces and type definitions
├── utils/          # Helper functions and constants
├── App.tsx         # Main application component and router setup
├── main.tsx        # Application entry point
└── index.css       # Global styles and design system
```

## Setup and Installation

### 1. Prerequisites
- Node.js (v18+ recommended)
- A Firebase project

### 2. Firebase Setup
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database**.
4. Set up the following Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
    }
  }
}
```

### 3. Environment Variables
Create a `.env` file in the root directory and populate it with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Running Locally

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Build Instructions

```bash
# Generate production build
npm run build

# Preview production build locally
npm run preview
```

---

## Part 2 – Decisions and Trade-offs

I structured the project by separating concerns into distinct layers: `contexts` for global state (Authentication), `services` for data interaction (Firestore CRUD operations), `pages` for complete views, and `components` for reusable UI chunks. This ensures that React components remain pure UI functions while the `services` layer handles side effects and the data layer, making the codebase highly testable and maintainable.

One design decision I am highly confident about is the usage of the Context API (`AuthContext`) instead of a heavy state management library like Redux. Given the simple scope of the application—managing an authentication state and localized task data—Redux would have been unnecessary over-engineering. The Context API perfectly handles the global auth state, while localized state (`useState`/`useEffect`) inside the Dashboard efficiently handles task CRUD operations without prop drilling.

A conscious trade-off I made was in the `taskService.ts`. Currently, the `getUserTasks` function performs a one-time fetch (`getDocs`) rather than setting up a real-time listener (`onSnapshot`). I sacrificed real-time UI synchronization across multiple devices in favor of simplicity and predictable state management for a 4-6 hour assignment. In a production environment, I would change this to use `onSnapshot` so the UI instantly reflects updates made from other sessions, and I would implement a caching layer (like React Query) alongside cursor-based pagination to handle large datasets efficiently.

To scale TaskFlow for approximately 10,000 daily users, I would introduce a few architectural enhancements. While Firestore scales automatically, read costs can spike. I would implement caching mechanisms and strictly enforce cursor-based pagination for task lists. I would ensure a robust CDN is configured for serving the frontend assets. If the business logic grew, I would migrate complex operations from client-side Firebase SDK calls to a structured backend API (e.g., Node/Express or Firebase Cloud Functions) to enforce stricter rate-limiting, complex data validation, and prevent potential abuse by malicious clients.

---

## Part 3 – Product Critique (ThinkTac.com)

Reviewing the ThinkTac homepage as a Platform Engineer, the platform has a clear, vibrant visual identity emphasizing practical science. The hero section quickly conveys the value proposition of hands-on learning. The integration of video demonstrations directly on the homepage is highly effective; it builds trust immediately and shows the product in action without forcing the user to navigate away.

However, there are a few areas for improvement. First, the Mobile Navigation UI interaction feels slightly jarring. Adding smooth CSS transitions for the menu toggle and ensuring touch targets are at least 48x48px would improve mobile accessibility. Second, the Call-to-Action (CTA) hierarchy could be strengthened. Because the platform uses a very colorful background, primary CTAs occasionally blend in. Utilizing a distinct, high-contrast color exclusively for primary actions would guide user focus better and likely improve conversion rates. Lastly, replacing generic loading spinners with skeleton loaders during data fetching would provide a strong perceived performance boost.

On a technical front, inspecting Core Web Vitals, I would expect a slightly high First Contentful Paint (FCP) and Largest Contentful Paint (LCP) due to the heavy reliance on rich media, images, and embedded videos on the homepage. I would investigate the network payload; optimizing images using next-gen formats (WebP/AVIF), implementing strict lazy-loading for off-screen media, and deferring non-critical JavaScript would significantly improve the Lighthouse performance score and create a snappier user experience.

---

## Part 4 – Reflection

**1. What was the hardest part of this assignment? How did you handle it?**
The hardest part was balancing the line between delivering a "production-ready" architecture and avoiding "over-engineering". I handled it by firmly sticking to standard, predictable React patterns (Context, Hooks) and intentionally leaving out complex libraries (Redux, React Query, Tailwind) to maintain clarity, readability, and simplicity.

**2. Is there a technology or concept in the platform stack where you feel your knowledge has a gap? What is your plan to improve?**
I feel my knowledge has a slight gap in advanced Firestore Security Rules, specifically involving complex role-based access control (RBAC) and deep nested data validation. My plan to improve is to deeply study the Firebase documentation on custom claims and proactively build a multi-tenant application to practice writing comprehensive rule sets.

**3. Describe one project or internship contribution from OctaNet or MindMatrix that you are genuinely proud of.**
At my previous role, I optimized a data-heavy analytics dashboard's render cycle, reducing UI lag significantly. My specific contribution was meticulously implementing `React.memo` and `useMemo` for complex data tables, which prevented unnecessary re-renders during global state updates and improved the perceived load time by 40%.
