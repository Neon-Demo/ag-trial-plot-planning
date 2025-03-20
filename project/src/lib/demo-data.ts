// This file contains mock data for demonstration purposes

export const DEMO_USERS = [
  {
    id: "1",
    name: "Demo Admin",
    email: "admin@example.com",
    role: "ADMIN",
    organizationId: "1",
    image: "https://ui-avatars.com/api/?name=Admin+User&background=2a9d8f&color=fff",
  },
  {
    id: "2",
    name: "Demo Researcher",
    email: "researcher@example.com",
    role: "RESEARCHER",
    organizationId: "1",
    image: "https://ui-avatars.com/api/?name=Demo+Researcher&background=e9c46a&color=fff",
  },
  {
    id: "3",
    name: "Demo Field Tech",
    email: "fieldtech@example.com",
    role: "FIELD_TECHNICIAN",
    organizationId: "1",
    image: "https://ui-avatars.com/api/?name=Field+Technician&background=e76f51&color=fff",
  },
];

export const DEMO_ORGANIZATIONS = [
  {
    id: "1",
    name: "AgriResearch Inc.",
    description: "Agricultural research organization focused on sustainable farming",
    contactEmail: "info@agriresearch.example.com",
    logoUrl: "https://ui-avatars.com/api/?name=Agri+Research&background=2a9d8f&color=fff&size=256",
    subscriptionTier: "ENTERPRISE",
    subscriptionStatus: "ACTIVE",
  },
];

export const DEMO_TRIALS = [
  {
    id: "1",
    name: "Corn Variety Trial 2024",
    organizationId: "1",
    description: "Evaluating yield performance of 10 corn varieties under standard conditions",
    location: "North Field Station",
    cropType: "corn",
    status: "ACTIVE",
    startDate: "2024-04-15",
    plannedEndDate: "2024-10-30",
    createdById: "2",
    metadata: {
      field_size: "10 acres",
      soil_type: "Loamy",
      previous_crop: "Soybeans",
    },
  },
  {
    id: "2",
    name: "Wheat Disease Resistance",
    organizationId: "1",
    description: "Testing 8 wheat varieties for resistance to stripe rust",
    location: "East Research Farm",
    cropType: "wheat",
    status: "ACTIVE",
    startDate: "2024-03-10",
    plannedEndDate: "2024-09-15",
    createdById: "2",
    metadata: {
      field_size: "8 acres",
      soil_type: "Clay loam",
      previous_crop: "Fallow",
    },
  },
  {
    id: "3",
    name: "Soybean Fertilizer Trial",
    organizationId: "1",
    description: "Evaluating 5 different fertilizer treatments on soybean yield",
    location: "South Field",
    cropType: "soybean",
    status: "PLANNED",
    startDate: "2024-05-20",
    plannedEndDate: "2024-10-15",
    createdById: "2",
    metadata: {
      field_size: "6 acres",
      soil_type: "Silty clay",
      previous_crop: "Corn",
    },
  },
];

export const DEMO_TREATMENTS = [
  // Corn Variety Trial Treatments
  {
    id: "1",
    trialId: "1",
    name: "Pioneer P0157",
    description: "Pioneer P0157 corn hybrid with standard management",
    factors: {
      variety: "Pioneer P0157",
      maturity: "101 days",
      seed_treatment: "Standard"
    },
    color: "#ff6b6b",
  },
  {
    id: "2",
    trialId: "1",
    name: "DeKalb DKC64-34",
    description: "DeKalb DKC64-34 corn hybrid with standard management",
    factors: {
      variety: "DeKalb DKC64-34",
      maturity: "114 days",
      seed_treatment: "Standard"
    },
    color: "#4ecdc4",
  },
  {
    id: "3",
    trialId: "1",
    name: "Agrisure Viptera 3111",
    description: "Agrisure Viptera 3111 corn hybrid with standard management",
    factors: {
      variety: "Agrisure Viptera 3111",
      maturity: "105 days",
      seed_treatment: "Premium"
    },
    color: "#ffbe0b",
  },
  
  // Wheat Disease Resistance Treatments
  {
    id: "4",
    trialId: "2",
    name: "SY Mondora",
    description: "SY Mondora hard red wheat with standard management",
    factors: {
      variety: "SY Mondora",
      type: "Hard Red",
      seed_treatment: "Standard"
    },
    color: "#fb5607",
  },
  {
    id: "5",
    trialId: "2",
    name: "AP Coachman",
    description: "AP Coachman hard white wheat with standard management",
    factors: {
      variety: "AP Coachman",
      type: "Hard White",
      seed_treatment: "Standard"
    },
    color: "#8338ec",
  },
  
  // Soybean Fertilizer Trial Treatments
  {
    id: "6",
    trialId: "3",
    name: "Control",
    description: "No additional fertilizer applied",
    factors: {
      fertilizer: "None",
      rate: "0 lbs/acre"
    },
    color: "#cccccc",
  },
  {
    id: "7",
    trialId: "3",
    name: "Standard NPK",
    description: "Standard NPK fertilizer application",
    factors: {
      fertilizer: "NPK (10-20-20)",
      rate: "300 lbs/acre"
    },
    color: "#3a86ff",
  },
  {
    id: "8",
    trialId: "3",
    name: "High K",
    description: "High potassium fertilizer application",
    factors: {
      fertilizer: "NPK (10-10-30)",
      rate: "300 lbs/acre"
    },
    color: "#7209b7",
  },
];

export const DEMO_OBSERVATION_PROTOCOLS = [
  {
    id: "1",
    trialId: "1",
    name: "Vegetative Stage Assessment",
    description: "Weekly assessment during vegetative growth stage",
    frequency: "weekly",
    startDate: "2024-05-01",
    endDate: "2024-07-15",
    createdById: "2",
  },
  {
    id: "2",
    trialId: "1",
    name: "Reproductive Stage Assessment",
    description: "Bi-weekly assessment during reproductive growth stage",
    frequency: "bi-weekly",
    startDate: "2024-07-16",
    endDate: "2024-09-30",
    createdById: "2",
  },
  {
    id: "3",
    trialId: "2",
    name: "Disease Rating",
    description: "Weekly assessment of disease incidence and severity",
    frequency: "weekly",
    startDate: "2024-04-15",
    endDate: "2024-08-15",
    createdById: "2",
  },
];

export const DEMO_OBSERVATION_METRICS = [
  // Corn Vegetative Stage Metrics
  {
    id: "1",
    protocolId: "1",
    name: "Plant Height",
    type: "numeric",
    unit: "cm",
    validationRules: {
      min: 0,
      max: 300
    },
    required: true,
    displayOrder: 1,
  },
  {
    id: "2",
    protocolId: "1",
    name: "Leaf Count",
    type: "integer",
    validationRules: {
      min: 0,
      max: 30
    },
    required: true,
    displayOrder: 2,
  },
  {
    id: "3",
    protocolId: "1",
    name: "Plant Vigor",
    type: "categorical",
    validationRules: {
      options: [
        {value: 1, label: "Poor"},
        {value: 2, label: "Below Average"},
        {value: 3, label: "Average"},
        {value: 4, label: "Good"},
        {value: 5, label: "Excellent"}
      ]
    },
    required: true,
    displayOrder: 3,
  },
  {
    id: "4",
    protocolId: "1",
    name: "Plant Photo",
    type: "image",
    required: false,
    displayOrder: 4,
  },
  
  // Corn Reproductive Stage Metrics
  {
    id: "5",
    protocolId: "2",
    name: "Silk Emergence",
    type: "categorical",
    validationRules: {
      options: [
        {value: 0, label: "None"},
        {value: 1, label: "Early"},
        {value: 2, label: "Mid"},
        {value: 3, label: "Late"},
        {value: 4, label: "Complete"}
      ]
    },
    required: true,
    displayOrder: 1,
  },
  {
    id: "6",
    protocolId: "2",
    name: "Ear Height",
    type: "numeric",
    unit: "cm",
    validationRules: {
      min: 0,
      max: 200
    },
    required: true,
    displayOrder: 2,
  },
  
  // Wheat Disease Rating Metrics
  {
    id: "7",
    protocolId: "3",
    name: "Disease Incidence",
    type: "numeric",
    unit: "%",
    validationRules: {
      min: 0,
      max: 100
    },
    required: true,
    displayOrder: 1,
  },
  {
    id: "8",
    protocolId: "3",
    name: "Disease Severity",
    type: "categorical",
    validationRules: {
      options: [
        {value: 0, label: "None"},
        {value: 1, label: "Low"},
        {value: 2, label: "Moderate"},
        {value: 3, label: "High"},
        {value: 4, label: "Severe"}
      ]
    },
    required: true,
    displayOrder: 2,
  },
];

// Generate sample plots for the corn variety trial
export const generateSamplePlots = (trialId: string, treatmentCount: number, replicates: number) => {
  const plots = [];
  let plotCounter = 1;
  
  for (let rep = 1; rep <= replicates; rep++) {
    for (let treatment = 1; treatment <= treatmentCount; treatment++) {
      const plotNumber = `R${rep}T${treatment}`;
      
      plots.push({
        id: `plot-${plotCounter}`,
        trialId,
        plotNumber,
        treatmentId: treatment.toString(),
        replication: rep,
        coordinates: {
          type: "Polygon",
          coordinates: [
            // Generate a simple square plot - in reality, this would be actual GPS coordinates
            [[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]]
          ]
        },
        centroid: {
          type: "Point",
          coordinates: [5, 5]
        },
        sizeValue: 100,
        sizeUnit: "square_meters",
        status: "unobserved",
        plantingDate: "2024-04-20",
      });
      
      plotCounter++;
    }
  }
  
  return plots;
};