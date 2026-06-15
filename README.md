# ✨ What is EventsVibe?
 
**EventsVibe** is a full-stack events platform where users can discover local events, connect with friends, become a host, and get AI-powered event suggestions — all in one place. Built with the latest React 19, Next.js 16, and a modern UI stack.
 
# 🌐 Live Link
[https://events-management-system-flame.vercel.app/](https://events-management-system-flame.vercel.app/)

---
 
## 🚀 Key Features
 
| Feature | Description |
|---|---|
| 🔐 **Auth System** | Login, Register, Forgot/Reset Password via NextAuth |
| 🤖 **AI Suggestions** | Personalized event recommendations based on user interests |
| 🗺️ **Map Integration** | Interactive maps with Leaflet + Geocoder for event locations |
| 💳 **Payments** | Stripe-powered checkout for event tickets |
| 👥 **Social System** | Follow users, send friend requests, save events |
| ⭐ **Reviews** | Rate and review events you've attended |
| 🔔 **Notifications** | Real-time notification system |
| 📊 **Analytics** | User and host dashboards with Recharts |
| 🌙 **Dark Mode** | Full theme switching via next-themes |
| 🧑‍💼 **Role-Based Access** | User / Host / Admin roles with protected routes |
 
---
 
## 🛠️ Tech Stack
 
### Core
```
Next.js 16 (App Router + Turbopack)   →  Framework
React 19                               →  UI Library
TypeScript 5                           →  Type Safety
Tailwind CSS 4                         →  Styling
```
 
### UI & Components
```
Radix UI          →  Accessible headless components (Dialog, Dropdown, Label, Nav)
Lucide React      →  Icon library
Sonner            →  Toast notifications
SweetAlert2       →  Beautiful alert dialogs
next-themes       →  Dark/light mode
tw-animate-css    →  Tailwind animations
clsx + tailwind-merge  →  Conditional class utilities
class-variance-authority  →  Component variant management
```
 
### Maps
```
Leaflet 1.9.4              →  Interactive map rendering
React-Leaflet 5            →  React bindings for Leaflet
Leaflet-Control-Geocoder   →  Address search on maps
Leaflet-GeoSearch          →  Location search integration
```
 
### Forms & Validation
```
React Hook Form 7   →  Performant form handling
Zod 4               →  Schema-based validation
@hookform/resolvers →  Zod + RHF bridge
```
 
### Data & Auth
```
NextAuth 4      →  Authentication (Credentials + Google OAuth)
Recharts        →  Charts and analytics dashboards
React Fast Marquee  →  Scrolling announcement banners
```
 
---
 
## 📁 Project Structure
 
```
events-management-system/
├── 📁 public/                      # Static assets (images, icons)
├── 📁 src/
│   ├── 📁 app/                     # Next.js App Router
│   │   ├── 📁 (protected)/         # Auth-guarded routes
│   │   │   ├── 📁 admin/           # Admin dashboard, users, events, hosts
│   │   │   ├── 📁 host/            # Host profile, events, analytics
│   │   │   └── 📁 user/            # User profile, my-events, social, analytics
│   │   ├── 📁 (public)/            # Public-facing pages
│   │   ├── 📁 api/auth/            # NextAuth API route
│   │   ├── 📁 events/[eventId]/    # Dynamic event detail pages
│   │   ├── 📁 payment-cancel/      # Stripe cancel redirect
│   │   ├── 📁 payment-success/     # Stripe success redirect
│   │   ├── 📁 login/               # Login page
│   │   ├── 📁 register/            # Register page
│   │   ├── 📁 forgot-password/     # Forgot password
│   │   ├── 📁 reset-password/      # Reset password
│   │   ├── 📁 become-host/         # Host application page
│   │   └── layout.tsx              # Root layout
│   │
│   ├── 📁 components/
│   │   ├── 📁 modules/             # Feature-based components
│   │   │   ├── 📁 Auth/            # Login, Register, ForgotPassword forms
│   │   │   ├── 📁 Events/          # EventCard, EventDetails, EventForm
│   │   │   ├── 📁 Forms/           # Reusable form components
│   │   │   └── 📁 Home/            # Hero, FAQ, Featured, Promotions, AI Suggestions
│   │   ├── 📁 shared/              # Navbar, Footer
│   │   └── 📁 ui/                  # Shadcn-style base components
│   │
│   ├── 📁 helpers/                 # authOptions, authFetch, etc.
│   ├── 📁 lib/                     # Utility functions (utils.ts)
│   ├── 📁 providers/               # AuthProvider, ThemeProvider
│   ├── 📁 services/                # API service layers (Events, Social, Users)
│   ├── 📁 types/                   # TypeScript interfaces & types
│   ├── declarations.d.ts           # CSS module declarations
│   ├── globals.css                 # Global styles
│   └── proxy.ts                    # API proxy config
│
├── .env.production                 # Production environment variables
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript config
├── tailwind.config                 # Tailwind config
└── package.json
```
 
---
 
## ⚙️ Getting Started
 
Follow these steps to run the project locally:

### 1. Clone the Repository
git clone https://github.com/tahminatanjidamiti/events-management-system.git
cd events-management-system

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a `.env.local` file in the root and Configure Environment Variables

### 4. Run the Application
npm run dev

## ✅ Status
Project is functional and under active development.

⭐ **Star this repo if you find it helpful!**