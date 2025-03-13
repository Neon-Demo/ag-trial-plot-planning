# Agricultural Trial Plot Planning System

A comprehensive web and mobile application for planning agricultural field trials, navigating to plots, and collecting observations.

## Features

- **Trial Planning**: Design and manage agricultural trials with interactive plot layouts
- **Field Navigation**: GPS-guided navigation to efficiently visit trial plots
- **Data Collection**: Structured observation collection with offline capabilities
- **Data Analysis**: Statistical analysis and visualization of trial results
- **Weather Integration**: Incorporate weather data for comprehensive analysis
- **Equipment Integration**: Connect with field measurement devices

## Authentication

The system supports:
- Google SSO
- Microsoft SSO
- Demo login for development and testing

## Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Database**: PostgreSQL with PostGIS for spatial data
- **Authentication**: NextAuth.js with OAuth providers
- **ORM**: Prisma for database access
- **Maps**: Leaflet for interactive mapping

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database (with PostGIS extension for production)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ag-trial-plot-planning.git
   cd ag-trial-plot-planning
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file based on `.env.example` and add your environment variables
   ```
   cp .env.example .env.local
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Setting up OAuth Providers

#### Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Configure the OAuth consent screen
4. Create OAuth credentials (Web application type)
5. Add authorized JavaScript origins: `http://localhost:3000`
6. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env.local` file

#### Microsoft OAuth
1. Go to the [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure Active Directory
3. Set up platform configurations (Web)
4. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
5. Create a client secret
6. Copy the Application (client) ID, Directory (tenant) ID, and client secret to your `.env.local` file

## Project Structure

```
/project
  /src
    /app             # Next.js 13+ app directory
    /components      # Reusable React components
    /lib             # Utility functions and hooks
    /styles          # Global styles
    /types           # TypeScript type definitions
  /prisma            # Prisma schema and migrations
  /public            # Static assets
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## License

[MIT License](LICENSE)