# Agricultural Plot Observation Application - API Specification

## 1. API Overview

This document outlines the RESTful API endpoints for the Agricultural Plot Observation Application. The API follows REST principles and uses JSON for request and response payloads.

### 1.1 Base URL
- Production: `https://api.agroplot.com/v1`
- Staging: `https://api.staging.agroplot.com/v1`
- Development: `https://api.dev.agroplot.com/v1`

### 1.2 Authentication
All API requests require authentication using JSON Web Tokens (JWT).

**Authentication Headers:**
```json
{
  "status": "success",
  "data": {
    "routePlan": {
      "plotSequence": [
        {
          "id": "plot123",
          "plotNumber": "A101",
          "centroid": {
            "type": "Point",
            "coordinates": [lon1, lat1]
          },
          "distance": {
            "fromPrevious": {
              "value": 0,
              "unit": "meters"
            },
            "fromStart": {
              "value": 0,
              "unit": "meters"
            }
          }
        },
        {
          "id": "plot456",
          "plotNumber": "B205",
          "centroid": {
            "type": "Point",
            "coordinates": [lon2, lat2]
          },
          "distance": {
            "fromPrevious": {
              "value": 45.2,
              "unit": "meters"
            },
            "fromStart": {
              "value": 45.2,
              "unit": "meters"
            }
          }
        }
      ],
      "routeGeometry": {
        "type": "LineString",
        "coordinates": [[startLon, startLat], [lon1, lat1], [lon2, lat2], [...]]
      },
      "totalDistance": {
        "value": 1250,
        "unit": "meters"
      },
      "estimatedCompletionTime": "2 hours 15 minutes",
      "coverage": {
        "plotsIncluded": 30,
        "plotsTotal": 120,
        "completionPercentage": 25
      }
    }
  }
}
```

### 5.2 Route Recalculation

#### PUT /trials/{trialId}/route-plan
Updates an existing route plan based on new constraints or location.

**Request:**
```json
{
  "currentLocation": {
    "type": "Point",
    "coordinates": [lon, lat]
  },
  "skipPlotIds": ["plot789", "plot101"],
  "optimizationStrategy": "distance"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "routePlan": {
      "plotSequence": [...],
      "routeGeometry": {...},
      "totalDistance": {...},
      "estimatedCompletionTime": "1 hour 45 minutes",
      "coverage": {...}
    },
    "changes": {
      "plotsRemoved": 2,
      "plotsAdded": 0,
      "sequenceChanges": 5
    }
  }
}
```

## 6. Observation API

### 6.1 Observation Data Collection

#### GET /trials/{trialId}/observation-protocols
Retrieves observation protocols for a specific trial.

**Response:**
```json
{
  "status": "success",
  "data": {
    "protocols": [
      {
        "id": "protocol123",
        "name": "Vegetative Stage Assessment",
        "description": "Weekly assessment during vegetative growth stage",
        "frequency": "weekly",
        "startDate": "2024-05-01",
        "endDate": "2024-07-15",
        "metrics": [
          {
            "id": "height",
            "name": "Plant Height",
            "type": "numeric",
            "unit": "cm",
            "validRange": {
              "min": 0,
              "max": 300
            },
            "required": true
          },
          {
            "id": "leaf_count",
            "name": "Leaf Count",
            "type": "integer",
            "validRange": {
              "min": 0,
              "max": 30
            },
            "required": true
          },
          {
            "id": "vigor",
            "name": "Plant Vigor",
            "type": "categorical",
            "options": [
              {"value": 1, "label": "Poor"},
              {"value": 2, "label": "Below Average"},
              {"value": 3, "label": "Average"},
              {"value": 4, "label": "Good"},
              {"value": 5, "label": "Excellent"}
            ],
            "required": true
          },
          {
            "id": "notes",
            "name": "Observation Notes",
            "type": "text",
            "required": false
          },
          {
            "id": "photo",
            "name": "Plant Photo",
            "type": "image",
            "required": false
          }
        ]
      }
    ]
  }
}
```

#### POST /trials/{trialId}/plots/{plotId}/observations
Records a new observation for a specific plot.

**Request:**
```json
{
  "protocolId": "protocol123",
  "timestamp": "2024-06-15T14:30:00Z",
  "location": {
    "type": "Point",
    "coordinates": [lon, lat]
  },
  "metrics": {
    "height": {
      "value": 75.5,
      "unit": "cm"
    },
    "leaf_count": 12,
    "vigor": 4,
    "notes": "Healthy plants with good color"
  },
  "blinded": true,
  "observer": "user123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "obs456",
    "protocolId": "protocol123",
    "plotId": "plot123",
    "timestamp": "2024-06-15T14:30:00Z",
    "metrics": {
      "height": {
        "value": 75.5,
        "unit": "cm"
      },
      "leaf_count": 12,
      "vigor": 4,
      "notes": "Healthy plants with good color"
    }
  }
}
```

#### GET /trials/{trialId}/plots/{plotId}/observations
Retrieves all observations for a specific plot.

**Query Parameters:**
- protocolId: Filter by protocol
- startDate: Filter by date range start
- endDate: Filter by date range end
- page: Page number for pagination
- limit: Number of results per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "observations": [
      {
        "id": "obs123",
        "protocolId": "protocol123",
        "protocolName": "Vegetative Stage Assessment",
        "timestamp": "2024-05-15T10:45:00Z",
        "observer": {
          "id": "user123",
          "name": "Jane Smith"
        },
        "metrics": {
          "height": {
            "value": 45.2,
            "unit": "cm"
          },
          "leaf_count": 8,
          "vigor": 4,
          "notes": "Uniform emergence with good color"
        }
      },
      {
        "id": "obs456",
        "protocolId": "protocol123",
        "protocolName": "Vegetative Stage Assessment",
        "timestamp": "2024-06-15T14:30:00Z",
        "observer": {
          "id": "user123",
          "name": "Jane Smith"
        },
        "metrics": {
          "height": {
            "value": 75.5,
            "unit": "cm"
          },
          "leaf_count": 12,
          "vigor": 4,
          "notes": "Healthy plants with good color"
        }
      }
    ],
    "pagination": {
      "total": 4,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### POST /trials/{trialId}/batch-observations
Records observations for multiple plots at once.

**Request:**
```json
{
  "protocolId": "protocol123",
  "timestamp": "2024-06-15T15:00:00Z",
  "metrics": {
    "vigor": 3,
    "notes": "All plots affected by recent drought"
  },
  "plots": ["plot789", "plot790", "plot791", "plot792"],
  "observer": "user123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "observationsCreated": 4,
    "observationIds": ["obs789", "obs790", "obs791", "obs792"]
  }
}
```

### 6.2 Image Management

#### POST /trials/{trialId}/plots/{plotId}/images
Uploads an image associated with a plot.

**Request:**
Multipart form data with:
- image: File data
- observationId: (optional) Associated observation ID
- metricId: (optional) Associated metric ID
- notes: (optional) Image notes
- timestamp: Capture timestamp

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "img123",
    "plotId": "plot123",
    "observationId": "obs456",
    "metricId": "photo",
    "url": "https://storage.agroplot.com/images/trial123/plot123/img123.jpg",
    "thumbnailUrl": "https://storage.agroplot.com/images/trial123/plot123/thumbnails/img123.jpg",
    "timestamp": "2024-06-15T14:30:00Z",
    "fileSize": 2450000,
    "dimensions": {
      "width": 3264,
      "height": 2448
    },
    "geoLocation": {
      "latitude": 42.123456,
      "longitude": -71.123456,
      "accuracy": 3.5
    }
  }
}
```

#### GET /trials/{trialId}/plots/{plotId}/images
Retrieves all images for a specific plot.

**Query Parameters:**
- observationId: Filter by associated observation
- startDate: Filter by date range start
- endDate: Filter by date range end
- page: Page number for pagination
- limit: Number of results per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "images": [
      {
        "id": "img123",
        "plotId": "plot123",
        "observationId": "obs456",
        "metricId": "photo",
        "url": "https://storage.agroplot.com/images/trial123/plot123/img123.jpg",
        "thumbnailUrl": "https://storage.agroplot.com/images/trial123/plot123/thumbnails/img123.jpg",
        "timestamp": "2024-06-15T14:30:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

## 7. Analysis and Reporting API

### 7.1 Data Analysis

#### GET /trials/{trialId}/analysis/summary
Retrieves a summary analysis of trial data.

**Query Parameters:**
- metrics: Comma-separated list of metric IDs to include
- treatments: Comma-separated list of treatment IDs to include
- groupBy: Group results by (treatment, replication, plotLocation)

**Response:**
```json
{
  "status": "success",
  "data": {
    "trial": {
      "id": "trial123",
      "name": "Corn Variety Trial 2024"
    },
    "metrics": {
      "height": {
        "overall": {
          "mean": 82.4,
          "median": 83.1,
          "stdDev": 7.2,
          "min": 65.3,
          "max": 97.8,
          "unit": "cm"
        },
        "byTreatment": [
          {
            "treatmentId": "treatment1",
            "treatmentName": "Variety A + Standard Fertilizer",
            "mean": 79.2,
            "median": 80.1,
            "stdDev": 5.8,
            "min": 68.3,
            "max": 89.5,
            "unit": "cm"
          },
          {
            "treatmentId": "treatment2",
            "treatmentName": "Variety B + Enhanced Fertilizer",
            "mean": 87.6,
            "median": 88.2,
            "stdDev": 4.9,
            "min": 75.5,
            "max": 97.8,
            "unit": "cm"
          }
        ]
      }
    }
  }
}
```

#### GET /trials/{trialId}/analysis/comparison
Performs statistical comparison between treatments.

**Query Parameters:**
- metric: Metric ID to analyze
- treatments: Comma-separated list of treatment IDs to compare
- testType: Statistical test to use (tTest, anova)

**Response:**
```json
{
  "status": "success",
  "data": {
    "metric": "height",
    "testType": "tTest",
    "treatments": [
      {
        "id": "treatment1",
        "name": "Variety A + Standard Fertilizer"
      },
      {
        "id": "treatment2",
        "name": "Variety B + Enhanced Fertilizer"
      }
    ],
    "results": {
      "pValue": 0.0023,
      "significant": true,
      "significanceLevel": 0.05,
      "meanDifference": 8.4,
      "confidenceInterval": {
        "lower": 3.2,
        "upper": 13.6
      }
    }
  }
}
```

### 7.2 Data Export

#### GET /trials/{trialId}/export
Exports trial data in specified format.

**Query Parameters:**
- format: Export format (csv, excel, json)
- includeObservations: (true/false) whether to include observation data
- includePlotDetails: (true/false) whether to include plot metadata
- includeTreatments: (true/false) whether to include treatment details
- startDate: Filter by date range start
- endDate: Filter by date range end

**Response:**
For CSV/Excel:
File download response

For JSON:
```json
{
  "status": "success",
  "data": {
    "trial": {...},
    "treatments": [...],
    "plots": [...],
    "observations": [...]
  }
}
```

## 8. Weather and Integration API

### 8.1 Weather Data

#### GET /trials/{trialId}/weather
Retrieves weather data for a trial location.

**Query Parameters:**
- startDate: Start date for weather data
- endDate: End date for weather data
- interval: Data interval (hourly, daily)

**Response:**
```json
{
  "status": "success",
  "data": {
    "location": {
      "latitude": 42.123456,
      "longitude": -71.123456,
      "elevation": 145.2,
      "name": "North Field Station"
    },
    "period": {
      "start": "2024-06-01",
      "end": "2024-06-15"
    },
    "daily": [
      {
        "date": "2024-06-01",
        "temperature": {
          "min": 18.3,
          "max": 27.5,
          "avg": 22.9,
          "unit": "celsius"
        },
        "precipitation": {
          "amount": 12.3,
          "unit": "mm"
        },
        "humidity": {
          "min": 55,
          "max": 92,
          "avg": 75,
          "unit": "percent"
        },
        "wind": {
          "speed": 8.2,
          "direction": 270,
          "unit": "km/h"
        },
        "gdd": {
          "value": 12.9,
          "baseTemp": 10.0,
          "unit": "celsius"
        }
      }
    ],
    "summary": {
      "precipitation": {
        "total": 45.7,
        "unit": "mm"
      },
      "gdd": {
        "accumulated": 182.5,
        "unit": "celsius"
      }
    }
  }
}
```

### 8.2 Equipment Integration

#### GET /equipment
Retrieves available equipment connected to the user's account.

**Response:**
```json
{
  "status": "success",
  "data": {
    "equipment": [
      {
        "id": "equip123",
        "name": "NDVI Scanner Pro",
        "type": "scanner",
        "manufacturer": "AgriTech",
        "model": "NDVI-200",
        "lastConnected": "2024-06-14T15:45:22Z",
        "status": "available",
        "batteryLevel": 85
      }
    ]
  }
}
```

#### POST /trials/{trialId}/equipment-data
Imports data from field equipment.

**Request:**
```json
{
  "equipmentId": "equip123",
  "dataType": "ndvi",
  "timestamp": "2024-06-15T14:30:00Z",
  "plotIds": ["plot123", "plot124", "plot125"],
  "dataFormat": "csv",
  "data": "plot_id,ndvi_value\nplot123,0.85\nplot124,0.79\nplot125,0.82"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "recordsProcessed": 3,
    "observationsCreated": 3,
    "errors": []
  }
}
```

## 9. Synchronization API

### 9.1 Data Synchronization

#### GET /sync/status
Retrieves synchronization status for the user.

**Response:**
```json
{
  "status": "success",
  "data": {
    "lastSync": "2024-06-15T10:45:22Z",
    "pendingUploads": 5,
    "pendingDownloads": 0,
    "syncProgress": {
      "observations": {
        "pending": 3,
        "total": 3,
        "completed": 0
      },
      "images": {
        "pending": 2,
        "total": 2,
        "completed": 0
      }
    }
  }
}
```

#### POST /sync
Initiates data synchronization between client and server.

**Request:**
```json
{
  "uploadOnly": false,
  "priorityTrial": "trial123",
  "includeImages": true
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "syncId": "sync123",
    "estimatedTimeRemaining": "45 seconds",
    "pendingItems": 5
  }
}
```

#### GET /sync/{syncId}
Checks the status of a specific synchronization operation.

**Response:**
```json
{
  "status": "success",
  "data": {
    "syncId": "sync123",
    "progress": {
      "total": 5,
      "completed": 3,
      "percentage": 60
    },
    "status": "in_progress",
    "estimatedTimeRemaining": "20 seconds",
    "errors": []
  }
}
```

### 9.2 Offline Data Management

#### GET /offline/required-data
Retrieves a list of data that should be cached for offline use.

**Query Parameters:**
- trialId: Specific trial to prioritize
- maxStorageSize: Maximum storage size in MB

**Response:**
```json
{
  "status": "success",
  "data": {
    "trials": [
      {
        "id": "trial123",
        "name": "Corn Variety Trial 2024",
        "estimatedStorageSize": 15.2,
        "priority": "high",
        "components": {
          "plotData": {
            "required": true,
            "size": 0.8
          },
          "observationForms": {
            "required": true,
            "size": 0.3
          },
          "recentObservations": {
            "required": true,
            "size": 2.1
          },
          "images": {
            "required": false,
            "size": 12.0
          }
        }
      }
    ],
    "totalEstimatedSize": 15.2,
    "recommendations": {
      "imagesToExclude": ["thumbnails", "historical"],
      "dataRetentionPeriod": "30 days"
    }
  }
}
```

## 10. Notification API

### 10.1 Notifications

#### GET /notifications
Retrieves notifications for the current user.

**Query Parameters:**
- unreadOnly: (true/false) filter to unread notifications
- category: Filter by category
- page: Page number for pagination
- limit: Number of results per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "notif123",
        "type": "observation_reminder",
        "title": "Weekly observations due",
        "message": "Vegetative Stage Assessment observations are due for Corn Variety Trial 2024",
        "timestamp": "2024-06-15T08:00:00Z",
        "read": false,
        "priority": "medium",
        "actionable": true,
        "actions": [
          {
            "label": "View Trial",
            "target": "/trials/trial123"
          }
        ]
      }
    ],
    "unreadCount": 3,
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

#### PUT /notifications/{notificationId}/read
Marks a notification as read.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "notif123",
    "read": true
  }
}
```

## 11. API Versioning and Status

### 11.1 API Information

#### GET /status
Checks API operational status.

**Response:**
```json
{
  "status": "success",
  "data": {
    "operational": true,
    "version": "1.2.5",
    "environment": "production",
    "timestamp": "2024-06-15T14:30:00Z",
    "maintenanceScheduled": false
  }
}
```

#### GET /versions
Retrieves information about available API versions.

**Response:**
```json
{
  "status": "success",
  "data": {
    "currentVersion": "v1",
    "latestVersion": "v1",
    "versions": [
      {
        "version": "v1",
        "status": "current",
        "releaseDate": "2024-01-15",
        "endOfLifeDate": null
      }
    ]
  }
}
```
Authorization: Bearer {jwt_token}
```

### 1.3 Response Format
Standard JSON response format:

```json
{
  "status": "success|error",
  "data": {},
  "message": "Optional message",
  "errors": [] // Present only when status is error
}
```

### 1.4 Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error

## 2. Authentication API

### 2.1 User Authentication

#### POST /auth/login
Authenticates a user and returns a JWT token.

**Request:**
```json
{
  "email": "researcher@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "userId": "user123",
    "roles": ["researcher", "field_technician"]
  }
}
```

#### POST /auth/sso/{provider}
Initiates Single Sign-On with specified provider (google, microsoft).

**Response:**
Redirects to SSO provider.

#### GET /auth/sso/callback
Callback endpoint for SSO authentication.

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "userId": "user123",
    "roles": ["researcher", "field_technician"]
  }
}
```

#### POST /auth/refresh
Refreshes an existing JWT token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "refreshToken": "new_refresh_token_string"
  }
}
```

## 3. User and Organization API

### 3.1 User Management

#### GET /users/me
Retrieves the current user's profile.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user123",
    "email": "researcher@example.com",
    "firstName": "Jane",
    "lastName": "Researcher",
    "roles": ["researcher", "field_technician"],
    "preferences": {
      "units": "metric",
      "notificationPreferences": {},
      "displaySettings": {}
    },
    "organizationIds": ["org456", "org789"]
  }
}
```

#### PUT /users/me
Updates the current user's profile.

**Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "preferences": {
    "units": "imperial"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user123",
    "email": "researcher@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "preferences": {
      "units": "imperial",
      "notificationPreferences": {},
      "displaySettings": {}
    }
  }
}
```

### 3.2 Organization Management

#### GET /organizations
Retrieves a list of organizations the user belongs to.

**Response:**
```json
{
  "status": "success",
  "data": {
    "organizations": [
      {
        "id": "org456",
        "name": "AgriResearch Inc.",
        "role": "admin",
        "logoUrl": "https://storage.agroplot.com/logos/org456.png"
      },
      {
        "id": "org789",
        "name": "University Ag Extension",
        "role": "member",
        "logoUrl": "https://storage.agroplot.com/logos/org789.png"
      }
    ]
  }
}
```

#### GET /organizations/{organizationId}
Retrieves detailed information about a specific organization.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "org456",
    "name": "AgriResearch Inc.",
    "description": "Agricultural research organization focused on sustainable farming",
    "address": {
      "street": "123 Research Way",
      "city": "Agriville",
      "state": "CA",
      "postalCode": "94123",
      "country": "USA"
    },
    "contactEmail": "info@agriresearch.example.com",
    "logoUrl": "https://storage.agroplot.com/logos/org456.png",
    "subscriptionStatus": "active",
    "subscriptionTier": "enterprise",
    "members": {
      "count": 45,
      "administrators": 3
    }
  }
}
```

## 4. Trial Management API

### 4.1 Trials

#### GET /trials
Retrieves a list of trials for the user's organization.

**Query Parameters:**
- status: (active, completed, planned)
- organizationId: Filter by organization
- page: Page number for pagination
- limit: Number of results per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "trials": [
      {
        "id": "trial123",
        "name": "Corn Variety Trial 2024",
        "organizationId": "org456",
        "status": "active",
        "startDate": "2024-04-15",
        "endDate": "2024-10-30",
        "location": "North Field Station",
        "plotCount": 120,
        "completedObservations": 340,
        "totalObservations": 480
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

#### POST /trials
Creates a new trial.

**Request:**
```json
{
  "name": "Soybean Drought Resistance Trial",
  "organizationId": "org456",
  "description": "Testing drought resistance of 8 soybean varieties",
  "startDate": "2024-05-01",
  "plannedEndDate": "2024-09-30",
  "location": "South Field Station",
  "cropType": "soybean"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "trial456",
    "name": "Soybean Drought Resistance Trial",
    "organizationId": "org456",
    "status": "planned",
    "startDate": "2024-05-01",
    "plannedEndDate": "2024-09-30",
    "location": "South Field Station",
    "cropType": "soybean"
  }
}
```

#### GET /trials/{trialId}
Retrieves detailed information about a specific trial.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "trial123",
    "name": "Corn Variety Trial 2024",
    "organizationId": "org456",
    "description": "Evaluating yield performance of 10 corn varieties under standard conditions",
    "status": "active",
    "startDate": "2024-04-15",
    "endDate": "2024-10-30",
    "location": "North Field Station",
    "cropType": "corn",
    "plotLayout": {
      "totalPlots": 120,
      "replications": 4,
      "treatments": 10,
      "designType": "randomized_complete_block"
    },
    "observationProtocols": [
      {
        "id": "protocol123",
        "name": "Vegetative Stage Assessment",
        "frequency": "weekly",
        "metrics": ["height", "leaf_count", "vigor"]
      }
    ],
    "weather": {
      "currentConditions": {
        "temperature": 24.5,
        "humidity": 65,
        "precipitation": 0,
        "windSpeed": 8.2
      },
      "forecast": {
        "available": true,
        "daysAvailable": 5
      }
    }
  }
}
```

#### PUT /trials/{trialId}
Updates an existing trial.

**Request:**
```json
{
  "description": "Updated description for corn variety trial",
  "endDate": "2024-11-15"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "trial123",
    "name": "Corn Variety Trial 2024",
    "description": "Updated description for corn variety trial",
    "endDate": "2024-11-15"
  }
}
```

### 4.2 Plots and Treatment Management

#### GET /trials/{trialId}/plots
Retrieves all plots for a specific trial.

**Query Parameters:**
- treatment: Filter by treatment ID
- replication: Filter by replication number
- status: (observed, unobserved)
- page: Page number for pagination
- limit: Number of results per page

**Response:**
```json
{
  "status": "success",
  "data": {
    "plots": [
      {
        "id": "plot123",
        "trialId": "trial123",
        "plotNumber": "A101",
        "treatmentId": "treatment1",
        "replication": 1,
        "coordinates": {
          "type": "Polygon",
          "coordinates": [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]]
        },
        "size": {
          "value": 100,
          "unit": "square_meters"
        },
        "status": "observed",
        "plantingDate": "2024-04-20",
        "lastObservationDate": "2024-06-15"
      }
    ],
    "pagination": {
      "total": 120,
      "page": 1,
      "limit": 10,
      "pages": 12
    }
  }
}
```

#### POST /trials/{trialId}/plots
Adds a new plot to a trial.

**Request:**
```json
{
  "plotNumber": "B205",
  "treatmentId": "treatment2",
  "replication": 2,
  "coordinates": {
    "type": "Polygon",
    "coordinates": [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]]
  },
  "size": {
    "value": 100,
    "unit": "square_meters"
  },
  "plantingDate": "2024-04-21"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "plot456",
    "trialId": "trial123",
    "plotNumber": "B205",
    "treatmentId": "treatment2",
    "replication": 2,
    "coordinates": {
      "type": "Polygon",
      "coordinates": [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]]
    },
    "status": "unobserved",
    "plantingDate": "2024-04-21"
  }
}
```

#### GET /trials/{trialId}/plots/{plotId}
Retrieves detailed information about a specific plot.

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "plot123",
    "trialId": "trial123",
    "plotNumber": "A101",
    "treatmentId": "treatment1",
    "treatmentName": "Variety A + Standard Fertilizer",
    "replication": 1,
    "coordinates": {
      "type": "Polygon",
      "coordinates": [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]]
    },
    "centroid": {
      "type": "Point",
      "coordinates": [lon, lat]
    },
    "size": {
      "value": 100,
      "unit": "square_meters"
    },
    "status": "observed",
    "plantingDate": "2024-04-20",
    "emergenceDate": "2024-04-28",
    "observations": [
      {
        "id": "obs123",
        "date": "2024-05-15",
        "protocol": "Vegetative Stage Assessment",
        "metrics": {
          "height": {
            "value": 45.2,
            "unit": "cm"
          },
          "leaf_count": 8,
          "vigor": 4
        }
      }
    ],
    "notes": [
      {
        "date": "2024-05-10",
        "author": "Jane Smith",
        "text": "Minor deer damage observed on north edge"
      }
    ]
  }
}
```

#### PUT /trials/{trialId}/plots/{plotId}
Updates an existing plot.

**Request:**
```json
{
  "treatmentId": "treatment3",
  "notes": "Treatment changed due to error in initial assignment"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "plot123",
    "treatmentId": "treatment3",
    "notes": "Treatment changed due to error in initial assignment"
  }
}
```

#### GET /trials/{trialId}/treatments
Retrieves treatments for a specific trial.

**Response:**
```json
{
  "status": "success",
  "data": {
    "treatments": [
      {
        "id": "treatment1",
        "trialId": "trial123",
        "name": "Variety A + Standard Fertilizer",
        "description": "Pioneer P0157 with standard NPK application",
        "factors": {
          "variety": "Pioneer P0157",
          "fertilizer": "Standard NPK"
        },
        "plotCount": 12
      }
    ]
  }
}
```

## 5. Navigation and Route Planning API

### 5.1 Location and Navigation

#### POST /navigation/current-location
Updates the user's current location.

**Request:**
```json
{
  "location": {
    "type": "Point",
    "coordinates": [longitude, latitude]
  },
  "accuracy": 3.5,
  "timestamp": "2024-06-15T13:45:22Z"
}
```

**Response:**
```json
{
  "status": "success"
}
```

#### GET /trials/{trialId}/next-plot
Retrieves the recommended next plot to visit based on current location.

**Query Parameters:**
- latitude: Current latitude
- longitude: Current longitude
- filterObserved: (true/false) whether to filter out already observed plots
- protocol: Specific observation protocol ID to filter plots

**Response:**
```json
{
  "status": "success",
  "data": {
    "nextPlot": {
      "id": "plot456",
      "plotNumber": "B205",
      "treatmentId": "treatment2",
      "treatmentName": "Variety B + Enhanced Fertilizer",
      "replication": 2,
      "coordinates": {
        "type": "Polygon",
        "coordinates": [[[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon1, lat1]]]
      },
      "centroid": {
        "type": "Point",
        "coordinates": [lon, lat]
      },
      "distance": {
        "value": 45.2,
        "unit": "meters"
      },
      "direction": 315,
      "estimatedTimeToReach": "45 seconds"
    },
    "suggestedRoute": {
      "type": "LineString",
      "coordinates": [[currentLon, currentLat], [intermediateLon, intermediateLat], [destinationLon, destinationLat]]
    }
  }
}
```

#### GET /trials/{trialId}/route-plan
Generates an optimized route plan for visiting plots.

**Query Parameters:**
- startLatitude: Starting latitude
- startLongitude: Starting longitude
- filterObserved: (true/false) whether to filter out already observed plots
- protocol: Specific observation protocol ID
- optimizationStrategy: (distance, completion_time, treatment_blocks)

**Response:**
```