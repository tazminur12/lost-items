# Smart Lost-Item Recovery System

A full-stack web application that helps communities (especially students and campus users) report lost items, post found items, and get matched with potential owners or finders. The platform follows a streamlined workflow: **Report → Match → Verify → Recover**. It also features an AI-powered summary generator using Google Gemini.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Third-Party Integrations](#third-party-integrations)

---

## Features

- **User Authentication** — Registration with email/password, login via NextAuth (Credentials provider), JWT-based sessions, role-based access (User / Admin / Moderator).
- **Report Lost Items** — Authenticated users submit a detailed report with title, description, category, location, date, contact info, and an optional photo uploaded to Cloudinary.
- **Post Found Items** — Same form structure but for items someone has found.
- **Browse & Match Items** — A searchable, filterable, sortable listing of all reported items. Filter by type (Lost/Found), search by title or location, sort by newest/oldest.
- **AI-Powered Summary** — Each item has an "AI Summary" button that sends the description to Google Gemini and displays a concise 2–3 sentence summary.
- **Claim Verification** — A claim page where users describe identifying features and optionally upload proof of ownership.
- **User Dashboard** — Role-based dashboard with stats (active reports, potential matches, resolved cases, pending claims) and a recent items table.
- **Profile Management** — Rich profile view with avatar upload, bio, phone, address, stats, and recent reports.
- **Responsive Design** — Fully responsive with mobile navigation, mobile sidebar, and adaptive layouts.
- **Animated UI** — Smooth page transitions and interactive animations using Framer Motion.

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| **Framework**      | Next.js (App Router)                |
| **Language**       | JavaScript (JSX)                    |
| **UI Library**     | React 19                            |
| **Styling**        | Tailwind CSS v4                     |
| **Animation**      | Framer Motion                       |
| **Icons**          | Lucide React                        |
| **Authentication** | NextAuth.js (Credentials, JWT)      |
| **Database**       | MongoDB Atlas (Mongoose ODM)        |
| **Password Hash**  | bcryptjs                            |
| **Image Upload**   | Cloudinary (unsigned client upload) |
| **AI Integration** | Google Gemini (Generative Language)  |
| **Alerts/Modals**  | SweetAlert2                         |
| **Font**           | Inter (via next/font/google)        |
| **Linting**        | ESLint (eslint-config-next)         |

---

## Project Structure

```
lost-items/
├── app/                              # Next.js App Router pages
│   ├── layout.js                     # Root layout (font, Navbar, Footer, AuthProvider)
│   ├── page.js                       # Home page (Hero + How It Works)
│   ├── globals.css                   # Global styles & Tailwind import
│   ├── login/page.js                 # Login page
│   ├── register/page.js              # Registration page
│   ├── report-lost/page.js           # Report lost item form
│   ├── post-found/page.js            # Post found item form
│   ├── claim/page.js                 # Claim verification page
│   ├── matches/page.js               # Browse/search all items + AI summary
│   ├── notifications/page.js         # Notifications (placeholder)
│   ├── how-it-works/page.js          # How it works + FAQ
│   ├── profile/page.js               # User profile with tabs
│   │
│   ├── dashboard/                    # Dashboard section
│   │   ├── layout.js                 # Dashboard layout with sidebar
│   │   ├── page.js                   # Dashboard overview (stats + items table)
│   │   ├── my-lost/page.js           # User's lost item reports
│   │   ├── my-found/page.js          # User's found item posts
│   │   ├── messages/page.js          # Messages (placeholder)
│   │   └── settings/page.js          # Profile settings form
│   │
│   └── api/                          # API Routes
│       ├── auth/[...nextauth]/route.js   # NextAuth handler
│       ├── register/route.js             # User registration
│       ├── items/route.js                # Get all items / Create item
│       ├── user/update/route.js          # Update user profile
│       └── generate/summary/route.js     # AI text summary (Gemini)
│
├── components/                       # Reusable React components
│   ├── Navbar.js                     # Navigation bar (responsive, auth-aware)
│   ├── Footer.js                     # Site footer
│   ├── Hero.js                       # Landing page hero section
│   ├── HowItWorks.js                 # "How It Works" section
│   ├── DashboardSidebar.js           # Role-based dashboard sidebar
│   ├── ItemCard.js                   # Item display card
│   ├── Button.js                     # Reusable button (primary/secondary/outline)
│   └── Providers.js                  # NextAuth SessionProvider wrapper
│
├── lib/                              # Utility libraries
│   ├── mongodb.js                    # MongoDB connection with caching
│   └── upload.js                     # Cloudinary upload helper
│
├── models/                           # Mongoose models
│   ├── Item.js                       # Item schema
│   └── User.js                       # User schema
│
├── public/                           # Static assets
├── .env                              # Environment variables (DO NOT commit)
├── package.json                      # Dependencies and scripts
├── next.config.mjs                   # Next.js configuration
├── postcss.config.mjs                # PostCSS with Tailwind v4
├── eslint.config.mjs                 # ESLint configuration
└── jsconfig.json                     # Path aliases (@/* → ./*)
```

---

## Pages & Routes

| Route                  | Description                          | Auth Required |
| ---------------------- | ------------------------------------ | :-----------: |
| `/`                    | Home page (Hero + How It Works)      |      No       |
| `/login`               | Login page                           |      No       |
| `/register`            | Registration page                    |      No       |
| `/report-lost`         | Report a lost item                   |      Yes      |
| `/post-found`          | Post a found item                    |      Yes      |
| `/matches`             | Browse, search & filter all items    |      No       |
| `/claim`               | Claim / verify item ownership        |      No       |
| `/notifications`       | Notifications list (placeholder)     |      No       |
| `/how-it-works`        | How it works + FAQ                   |      No       |
| `/profile`             | User profile with tabs               |      Yes      |
| `/dashboard`           | Dashboard overview with stats        |      Yes      |
| `/dashboard/my-lost`   | User's lost item reports             |      Yes      |
| `/dashboard/my-found`  | User's found item posts              |      Yes      |
| `/dashboard/messages`  | Messages (placeholder)               |      Yes      |
| `/dashboard/settings`  | Profile settings form                |      Yes      |

---

## API Endpoints

| Endpoint                    | Method   | Description                              |
| --------------------------- | -------- | ---------------------------------------- |
| `/api/auth/[...nextauth]`  | GET/POST | NextAuth authentication handler          |
| `/api/register`            | POST     | Register a new user                      |
| `/api/items`               | GET      | Fetch all items (sorted newest first)    |
| `/api/items`               | POST     | Create a new lost/found item (auth)      |
| `/api/user/update`         | PUT      | Update user profile (auth)               |
| `/api/generate/summary`    | POST     | Generate AI summary via Google Gemini    |

---

## Database Models

### User

| Field      | Type   | Description                              |
| ---------- | ------ | ---------------------------------------- |
| `name`     | String | User's full name                         |
| `email`    | String | Unique email address                     |
| `password` | String | Hashed with bcryptjs                     |
| `role`     | String | `User` / `Admin` / `Moderator`           |
| `image`    | String | Profile avatar URL                       |
| `bio`      | String | Short bio                                |
| `phone`    | String | Phone number                             |
| `address`  | String | Address                                  |

### Item

| Field         | Type     | Description                                     |
| ------------- | -------- | ----------------------------------------------- |
| `title`       | String   | Item title                                      |
| `description` | String   | Detailed description                            |
| `type`        | String   | `Lost` or `Found`                               |
| `category`    | String   | Item category                                   |
| `location`    | String   | Where the item was lost/found                   |
| `date`        | Date     | When the item was lost/found                    |
| `imageUrl`    | String   | Cloudinary image URL                            |
| `status`      | String   | `Pending` / `Resolved` / `Claimed`              |
| `user`        | ObjectId | Reference to the User who reported              |
| `contactInfo` | String   | Contact details                                 |

---

## How It Works

1. **Report** — A user reports a lost or found item by filling out a form with all relevant details and an optional photo.
2. **Match** — The system displays all reported items on the Matches page where others can browse, search, and filter to find potential matches.
3. **Verify** — When a user spots their item, they go to the Claim page to submit identifying details and proof of ownership.
4. **Recover** — Once verified, the item status updates and both parties can connect to arrange recovery.

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (or yarn / pnpm / bun)
- **MongoDB Atlas** cluster (or local MongoDB instance)
- **Cloudinary** account (for image uploads)
- **Google Gemini API key** (for AI summaries)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd lost-items

# 2. Install dependencies
npm install

# 3. Create a .env file (see Environment Variables section below)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-secret-key>

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your-upload-preset>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

GOOGLE_GEMINI_API_KEY=<your-gemini-api-key>
```

> **Note:** Never commit the `.env` file to version control. It is already listed in `.gitignore`.

---

## Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start development server           |
| `npm run build`   | Build for production               |
| `npm start`       | Start production server            |
| `npm run lint`    | Run ESLint                         |

---

## Third-Party Integrations

### MongoDB Atlas
- Database for storing users and items.
- Connection is cached globally for hot-reloading support (`lib/mongodb.js`).

### Cloudinary
- Handles image uploads for item photos and profile avatars.
- Uses unsigned client-side uploads via `lib/upload.js`.

### Google Gemini (Generative Language API)
- Powers the AI Summary feature on the Matches page.
- Sends item descriptions to the API and returns a concise 2–3 sentence summary.

### NextAuth.js
- Handles authentication with a Credentials provider (email + password).
- Uses JWT session strategy.
- Custom callbacks extend the session with user role, bio, phone, address, and image.
- Role-based dashboard sidebar shows different navigation for Admin, Moderator, and User roles.
