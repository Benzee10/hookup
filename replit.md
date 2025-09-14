# Overview

CrediMarket is a credit-based marketplace web application where users can discover and unlock contact information for various service providers. The platform features user authentication, credit management, profile browsing, and an admin panel for managing users and payments. Users purchase credits to unlock premium contact details of service providers, creating a monetized discovery platform.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 19 with TypeScript for type safety and modern development
- **Routing**: React Router DOM v7 with hash-based routing for static hosting compatibility
- **Styling**: Tailwind CSS via CDN with custom brand colors and animations
- **State Management**: React Context API for global state (Auth, Data, Notifications)
- **Module System**: ES modules with import maps for external dependencies

## Component Structure
- **Layout System**: Centralized layout component with header, main content, and footer
- **Route Protection**: Protected routes for authenticated users and admin-only routes
- **UI Components**: Reusable components including modals, spinners, notifications, and profile cards
- **Context Providers**: Nested context providers for authentication, data management, and notifications

## Authentication & Authorization
- **Backend**: Supabase Auth for user management and session handling
- **Role-based Access**: User and admin role distinction with admin-only routes
- **Session Management**: Persistent sessions with automatic token refresh
- **Password Reset**: Email-based password recovery system

## Data Management
- **Database**: Supabase (PostgreSQL) with typed schema definitions
- **Data Models**: Structured types for Users, Profiles, Unlocks, Transactions, and Payments
- **Caching Strategy**: Context-based local state management with manual refresh capabilities
- **File Storage**: Supabase storage for payment proof uploads

## Credit System
- **Transaction Types**: Purchase, unlock, and admin grant transactions
- **Payment Processing**: Manual payment verification with admin approval workflow
- **Credit Tracking**: Real-time credit balance updates with transaction history

## Admin Features
- **User Management**: View all users and grant credits with descriptions
- **Payment Processing**: Approve or reject payment requests with proof verification
- **Profile Management**: CRUD operations for service provider profiles

# External Dependencies

## Core Framework Dependencies
- **React**: v19.1.1 - Core UI framework
- **React DOM**: v19.1.1 - DOM rendering
- **React Router DOM**: v7.8.0 - Client-side routing

## Backend Services
- **Supabase**: v2 - Backend-as-a-Service providing authentication, database, and file storage
- **PostgreSQL**: Managed by Supabase for data persistence

## Development Tools
- **Vite**: v6.2.0 - Build tool and development server
- **TypeScript**: v5.8.2 - Type checking and compilation
- **Tailwind CSS**: Via CDN for styling

## External CDN Resources
- **Tailwind CSS**: Styling framework loaded via CDN
- **ES Module Imports**: External dependencies loaded via import maps from esm.sh

## Environment Configuration
- **VITE_SUPABASE_URL**: Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Supabase anonymous access key
- **GEMINI_API_KEY**: Google Gemini API key (referenced but not actively used in current codebase)