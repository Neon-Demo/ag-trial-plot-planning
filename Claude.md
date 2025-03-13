# CLAUDE.md

## Technical Requirements
Technical requirements of the project is in the /2-TechnicalDocuments folder.
All project code should go to the /project folder.

## Build Commands
- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test
- `npm run lint` - Run ESLint

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
