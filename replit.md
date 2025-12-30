# FedExpress - Shipping & Logistics Platform

## Overview

FedExpress is a full-stack shipping and logistics management platform that enables users to create shipments, track packages in real-time, and manage delivery operations. The application features user authentication with JWT, an admin dashboard for system management, and a modern React frontend with animated tracking timelines.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state, React Context for auth and theme
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (brand purple #4E2E84, accent orange)
- **Animations**: Framer Motion for page transitions and tracking timeline animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful JSON API under `/api` prefix
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

### Data Layer
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Key Data Models
- **Users**: Authentication with email/password, admin flag, verification status
- **Shipments**: Tracking ID, origin/destination, status, sender/recipient details
- **Shipment Events**: Timeline events for package tracking history
- **Shipping Services**: Available service types with pricing
- **Verification Codes**: Email/phone verification system

### Project Structure
```
├── client/           # React frontend application
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── pages/        # Route page components
│       ├── hooks/        # Custom React hooks
│       └── lib/          # Utilities, auth context, theme
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations
│   ├── auth.ts       # JWT auth utilities
│   └── db.ts         # Drizzle database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle table definitions
│   └── routes.ts     # API route type definitions
└── migrations/       # Database migrations
```

### Build System
- **Development**: `npm run dev` runs tsx for server with Vite middleware
- **Production Build**: Custom script using esbuild for server + Vite for client
- **Output**: Server bundles to `dist/index.cjs`, client to `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing (cost factor 10)
- **express-session**: Session middleware with PostgreSQL store

### Frontend Libraries
- **@tanstack/react-query**: Async state management and caching
- **framer-motion**: Animation library for UI transitions
- **jspdf**: Client-side PDF generation for shipping labels
- **date-fns**: Date formatting utilities

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: JWT signing secret (falls back to demo key)