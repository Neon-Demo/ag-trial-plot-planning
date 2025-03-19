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
- PostgreSQL database (optional when using demo mode)

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

4. Start the development server using the provided script
   ```
   ./start.sh
   ```
   Or manually:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Demo Mode

The application can run in "demo mode" without requiring a PostgreSQL database:

1. Set `ALLOW_DEMO_LOGIN=true` in your environment variables
2. You can optionally remove the `DATABASE_URL` variable entirely
3. The demo login will be available with these credentials:
   - Admin: admin@example.com (role: admin)
   - Researcher: researcher@example.com (role: researcher)
   - Field Technician: field-tech@example.com (role: field-technician)

This is particularly useful for AWS deployments where setting up a database might not be desired.

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

- `./start.sh` - Start the development server with proper setup
- `./deploy.sh` - Prepare the application for AWS deployment
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client

## AWS Deployment

To deploy to AWS:

1. Remove package-lock.json from your repository (it's now in .gitignore)
2. Use the provided `deploy.sh` script to prepare your application:
   ```bash
   # For demo-only mode (no database):
   ./deploy.sh

   # If you want to use a database:
   INSTALL_DB_DEPS=true ./deploy.sh
   ```

3. Set the following environment variables in your AWS environment:
   - `NEXTAUTH_URL` - Your application URL
   - `NEXTAUTH_SECRET` - A strong random string for JWT encryption
   - `ALLOW_DEMO_LOGIN=true` - To enable demo mode

No database configuration is required when running in demo mode.

### Specialized Build Commands

For precise control over the build process:

- `npm run build:demo` - Build with demo mode enabled (no database required)
- `npm run build` - Standard build that requires database configuration

### Troubleshooting AWS Deployment

If you encounter module not found errors:
1. Make sure `ALLOW_DEMO_LOGIN=true` is set in your environment variables
2. Set `DATABASE_URL` only if you want to use a real database, otherwise omit it
3. Use the following buildspec.yml configuration for AWS:

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  pre_build:
    commands:
      - echo "Installing dependencies..."
      - npm install
      # Only add database-related packages if needed
      - if [ "$DATABASE_URL" != "" ]; then npm install @auth/prisma-adapter@latest; fi
  build:
    commands:
      - echo "Building app..."
      # Use the appropriate build command based on mode
      - if [ "$DATABASE_URL" != "" ]; then npm run build; else npm run build:demo; fi
  post_build:
    commands:
      - echo "Build completed"
artifacts:
  files:
    - next.config.js
    - package.json
    - .next/**/*
    - public/**/*
    - node_modules/**/*
    - .env
```

## License

[MIT License](LICENSE)