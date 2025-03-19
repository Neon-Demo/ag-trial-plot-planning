// Demo user data that matches our Prisma schema
export const demoUsers = [
  {
    id: "demo-admin",
    name: "Demo Admin",
    email: "admin@example.com",
    emailVerified: new Date(),
    image: null,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-researcher",
    name: "Demo Researcher",
    email: "researcher@example.com",
    emailVerified: new Date(),
    image: null,
    role: "researcher",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "demo-field-tech",
    name: "Demo Field Technician",
    email: "field-tech@example.com",
    emailVerified: new Date(),
    image: null,
    role: "field-technician",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// We can add more mock data here as needed for the demo mode
export const demoOrganizations = [
  {
    id: "demo-org-1",
    name: "Demo Agricultural Research Institute",
    description: "A demonstration organization for agricultural research",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const demoTrials = [
  {
    id: "demo-trial-1",
    name: "Corn Variety Trial 2025",
    description: "Evaluating different corn varieties for yield and drought resistance",
    startDate: new Date("2025-04-15"),
    endDate: new Date("2025-09-30"),
    location: "Field A, Northeast Section",
    status: "active",
    organizationId: "demo-org-1",
    createdById: "demo-researcher",
    createdAt: new Date(),
    updatedAt: new Date(),
    boundaryCoordinates: {
      type: "Polygon",
      coordinates: [
        [
          [-97.73432, 30.28759],
          [-97.73382, 30.28759],
          [-97.73382, 30.28709],
          [-97.73432, 30.28709],
          [-97.73432, 30.28759],
        ],
      ],
    },
  },
];