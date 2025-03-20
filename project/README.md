# Agricultural Trial Plot Planning Web Application

This is a Next.js application for planning, navigating, and collecting data from experimental agricultural plots. It allows for efficient management of agricultural field trials, from plot layout and design to data collection and analysis.

## Features

- **Trial Management:** Create and manage complex field trials with multiple treatments, replications, and plot layouts
- **Field Navigation:** Optimize routes between plots for efficient field work with GPS guidance and mapping
- **Data Collection:** Capture observations with custom forms, photos, and automated measurements
- **User Management:** Role-based access control with different permission levels (Admin, Researcher, Field Technician)
- **Authentication:** Google and Microsoft SSO support
- **Offline Capability:** Work in fields with limited connectivity

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL (optional for development, as the app can run with mock data)

### Installation

1. Clone the repository
2. Install dependencies

```bash
cd project
npm install
```

3. Set up environment variables
   - Copy the `.env.example` file to `.env.local` and update the values as needed

```bash
cp .env.example .env.local
```

4. Initialize the database (if using PostgreSQL)

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Mode

This application includes a demo mode that allows you to explore the features without setting up external authentication providers:

1. Go to the login page
2. Use one of the demo accounts:
   - **Admin:** admin@example.com
   - **Researcher:** researcher@example.com
   - **Field Technician:** fieldtech@example.com

### Deployment

#### Prerequisites for Production

- Set up OAuth credentials for Google and/or Microsoft
- Configure a PostgreSQL database
- Set the appropriate environment variables

## Technology Stack

- **Frontend:** React, Next.js, TypeScript, TailwindCSS
- **Authentication:** NextAuth.js with Google and Microsoft providers
- **Database:** PostgreSQL with Prisma ORM
- **State Management:** Redux Toolkit
- **Form Handling:** Formik with Yup validation
- **Mapping:** Leaflet for interactive maps

## Project Structure

- `/src/app` - Application routes and pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and libraries
- `/src/types` - TypeScript type definitions
- `/prisma` - Database schema and migrations

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.