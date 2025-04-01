# CLAUDE.md

## Technical Requirements
Technical requirements of the project are in the `/2-TechnicalDocuments` folder.
All project code should go to the `/project` folder.
The mobile app code is located in the `/mobile/AgTrialPlotPlanner` directory.

## Build Commands
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler checks

## Issue Fixing
You have access to Github through mcp server and command line with gh.
1. Fetch the issue, or new comments, from Github.
2. Create an issue branch. 
3. Fully understand the issue. 
4. Fix the issue. 
5. Commit the change. 
6. Create a Pull Request 


## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces/types for all components/functions
- **Formatting**: Follow Prettier defaults, 2-space indentation
- **Imports**: Group imports: React, external libs, internal components, styles
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Error Handling**: Use try/catch with specific error messages
- **Components**: Functional components with React hooks
- **State Management**: Use Redux Toolkit for global state
- **Forms**: Formik with Yup validation
- **API Calls**: Axios with async/await pattern
- **CSS**: Use Tailwind CSS for styling with custom theme colors
- **Layout**: Use Next.js App Router pattern with layout components
- **Colors**: Primary color is light blue (#4299e1), use the theme colors defined in tailwind.config.js
