# AG Trial Plot Planning System

## Project Overview

The AG Trial Plot Planning System is a comprehensive solution designed to streamline and optimize agricultural field trials. It addresses key challenges faced by agricultural professionals, including efficient plot selection, data collection, observation planning, and route optimization.

This platform helps researchers, agronomists, and field technicians manage trial layouts, collect consistent data, and navigate efficiently between plots, ultimately leading to more reliable trial results and optimized field operations.

## Key Features

- **Trial Management**: Design trials with randomized plot layouts, treatment assignments, and observation protocols
- **Field Navigation**: Optimize walking routes between plots with GPS guidance and field visualization
- **Data Collection**: Structured forms for consistent observations across plots with offline capabilities
- **Mobile Support**: Field-ready mobile application optimized for outdoor use in varying conditions
- **Analytics Dashboard**: Visual representation of trial progress and performance metrics
- **Multi-user Collaboration**: Role-based access for teams working on the same trials

## Project Structure

- `/0-Prelim`: Initial project concept and problem description
- `/1-SystemRequirements`: Detailed requirements documentation
- `/2-TechnicalDocuments`: Architecture diagrams, API specifications, and design documents
- `/project`: Web application implementation (Next.js)
  - Handles trial management, user administration, and data analysis
- `/mobile`: Mobile application implementation (React Native)
  - Provides field-ready data collection and navigation tools

## Getting Started

### Web Application

```bash
cd project
npm install
npm run dev
```

The web application will be available at http://localhost:3000

### Mobile Application

```bash
cd mobile/AgTrialPlotPlanner
npm install
npm start
```

Follow the Expo instructions to run on a simulator or physical device.

## Technologies

- **Web**: Next.js, React, TypeScript, Tailwind CSS, Prisma
- **Mobile**: React Native, Expo
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js

## Contributors

This project is developed and maintained by a team dedicated to improving agricultural field trial efficiency.

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.