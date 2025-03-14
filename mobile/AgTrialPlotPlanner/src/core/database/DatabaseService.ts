import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { Plot, Observation, ObservationValue, Image, Trial, ObservationProtocol, ObservationMetric, Treatment } from '../models/Types';

// Open database
let db: SQLite.SQLiteDatabase | null = null;

const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (Platform.OS === 'web') {
    // SQLite not supported on web
    throw new Error('SQLite is not supported on web platforms');
  }
  
  // In Expo SDK 52, the openDatabase API has changed
  if (!db) {
    db = await SQLite.openDatabaseAsync('agroplanner.db');
  }
  return db;
};

// Initialize the database
const dbPromise = openDatabase();

// Initialize database tables
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await dbPromise;
    
    // Users table (limited local info for offline use)
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        preferences TEXT
      );`
    );

    // Organizations table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS organizations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        contact_email TEXT,
        logo_url TEXT
      );`
    );

    // Trials table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS trials (
        id TEXT PRIMARY KEY,
        organization_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        location TEXT,
        crop_type TEXT,
        status TEXT NOT NULL,
        start_date TEXT,
        planned_end_date TEXT,
        actual_end_date TEXT,
        metadata TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (organization_id) REFERENCES organizations (id)
      );`
    );

    // Treatments table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS treatments (
        id TEXT PRIMARY KEY,
        trial_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        factors TEXT,
        color TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (trial_id) REFERENCES trials (id)
      );`
    );

    // Plots table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS plots (
        id TEXT PRIMARY KEY,
        trial_id TEXT NOT NULL,
        plot_number TEXT NOT NULL,
        treatment_id TEXT,
        replication INTEGER,
        coordinates TEXT NOT NULL,
        centroid TEXT,
        size_value REAL,
        size_unit TEXT,
        status TEXT NOT NULL,
        planting_date TEXT,
        emergence_date TEXT,
        metadata TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (trial_id) REFERENCES trials (id),
        FOREIGN KEY (treatment_id) REFERENCES treatments (id)
      );`
    );

    // Observation protocols table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS observation_protocols (
        id TEXT PRIMARY KEY,
        trial_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        frequency TEXT,
        start_date TEXT,
        end_date TEXT,
        metadata TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (trial_id) REFERENCES trials (id)
      );`
    );

    // Observation metrics table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS observation_metrics (
        id TEXT PRIMARY KEY,
        protocol_id TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        unit TEXT,
        validation_rules TEXT,
        required INTEGER NOT NULL,
        display_order INTEGER,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (protocol_id) REFERENCES observation_protocols (id)
      );`
    );

    // Observations table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS observations (
        id TEXT PRIMARY KEY,
        plot_id TEXT NOT NULL,
        protocol_id TEXT NOT NULL,
        observer_id TEXT NOT NULL,
        observation_timestamp TEXT NOT NULL,
        location TEXT,
        weather_data TEXT,
        blinded INTEGER NOT NULL,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (plot_id) REFERENCES plots (id),
        FOREIGN KEY (protocol_id) REFERENCES observation_protocols (id)
      );`
    );

    // Observation values table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS observation_values (
        id TEXT PRIMARY KEY,
        observation_id TEXT NOT NULL,
        metric_id TEXT NOT NULL,
        value TEXT NOT NULL,
        unit TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (observation_id) REFERENCES observations (id),
        FOREIGN KEY (metric_id) REFERENCES observation_metrics (id)
      );`
    );

    // Images table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        plot_id TEXT NOT NULL,
        observation_id TEXT,
        metric_id TEXT,
        url TEXT,
        thumbnail_url TEXT,
        local_path TEXT,
        capture_timestamp TEXT NOT NULL,
        geo_location TEXT,
        width INTEGER,
        height INTEGER,
        file_type TEXT,
        file_size INTEGER,
        metadata TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (plot_id) REFERENCES plots (id),
        FOREIGN KEY (observation_id) REFERENCES observations (id),
        FOREIGN KEY (metric_id) REFERENCES observation_metrics (id)
      );`
    );

    // Route plans table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS route_plans (
        id TEXT PRIMARY KEY,
        trial_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT,
        plot_sequence TEXT NOT NULL,
        route_geometry TEXT,
        total_distance_value REAL,
        total_distance_unit TEXT,
        estimated_duration INTEGER,
        optimization_strategy TEXT,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (trial_id) REFERENCES trials (id)
      );`
    );

    // Weather data table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS weather_data (
        id TEXT PRIMARY KEY,
        trial_id TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        daily_summary TEXT,
        hourly_data TEXT,
        precipitation REAL,
        temperature_min REAL,
        temperature_max REAL,
        temperature_avg REAL,
        humidity_avg REAL,
        wind_speed REAL,
        wind_direction REAL,
        gdd REAL,
        is_synced INTEGER DEFAULT 0,
        FOREIGN KEY (trial_id) REFERENCES trials (id)
      );`
    );

    // Sync log table
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS sync_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        items_processed INTEGER,
        error_details TEXT
      );`
    );
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Generic query executor
const executeQuery = async <T>(
  query: string, 
  params: any[] = []
): Promise<T[]> => {
  try {
    const database = await dbPromise;
    const result = await database.getAllAsync<T>(query, params);
    return result;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

// Generic insert function
const insertItem = async (
  table: string,
  item: Record<string, any>
): Promise<void> => {
  try {
    const database = await dbPromise;
    const columns = Object.keys(item);
    const placeholders = columns.map(() => '?').join(',');
    const values = Object.values(item);
    
    const query = `INSERT OR REPLACE INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
    
    await database.runAsync(query, values);
  } catch (error) {
    console.error(`Error inserting into ${table}:`, error);
    throw error;
  }
};

// Convert objects to/from DB format
const toDbObject = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Stringify objects
    if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
      result[snakeKey] = JSON.stringify(value);
    } else if (value instanceof Date) {
      result[snakeKey] = value.toISOString();
    } else if (typeof value === 'boolean') {
      result[snakeKey] = value ? 1 : 0;
    } else {
      result[snakeKey] = value;
    }
  }
  
  return result;
};

const fromDbObject = <T>(obj: Record<string, any>): T => {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    // Convert snake_case to camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Parse JSON strings back to objects
    if (typeof value === 'string' && 
       (value.startsWith('{') || value.startsWith('[')) && 
       (value.endsWith('}') || value.endsWith(']'))) {
      try {
        result[camelKey] = JSON.parse(value);
      } catch (e) {
        result[camelKey] = value;
      }
    } else if (typeof value === 'number' && (key.endsWith('_boolean') || key === 'is_synced' || key === 'required' || key === 'blinded')) {
      result[camelKey] = value === 1;
    } else {
      result[camelKey] = value;
    }
  }
  
  return result as T;
};

// TrialService - CRUD operations for trials
export const TrialService = {
  getAll: async (): Promise<Trial[]> => {
    const trials = await executeQuery<Record<string, any>>('SELECT * FROM trials');
    return trials.map(trial => fromDbObject<Trial>(trial));
  },
  
  getById: async (id: string): Promise<Trial | null> => {
    const trials = await executeQuery<Record<string, any>>(
      'SELECT * FROM trials WHERE id = ? LIMIT 1',
      [id]
    );
    return trials.length > 0 ? fromDbObject<Trial>(trials[0]) : null;
  },
  
  create: async (trial: Trial): Promise<void> => {
    return insertItem('trials', toDbObject(trial));
  },
  
  update: async (id: string, trial: Partial<Trial>): Promise<void> => {
    const current = await TrialService.getById(id);
    if (!current) throw new Error(`Trial with id ${id} not found`);
    
    const updated = { ...current, ...trial };
    return insertItem('trials', toDbObject(updated));
  },
  
  delete: async (id: string): Promise<void> => {
    await executeQuery('DELETE FROM trials WHERE id = ?', [id]);
  },
};

// PlotService - CRUD operations for plots
export const PlotService = {
  getAll: async (trialId?: string): Promise<Plot[]> => {
    const query = trialId
      ? 'SELECT * FROM plots WHERE trial_id = ?'
      : 'SELECT * FROM plots';
    const params = trialId ? [trialId] : [];
    
    const plots = await executeQuery<Record<string, any>>(query, params);
    return plots.map(plot => fromDbObject<Plot>(plot));
  },
  
  getById: async (id: string): Promise<Plot | null> => {
    const plots = await executeQuery<Record<string, any>>(
      'SELECT * FROM plots WHERE id = ? LIMIT 1',
      [id]
    );
    return plots.length > 0 ? fromDbObject<Plot>(plots[0]) : null;
  },
  
  create: async (plot: Plot): Promise<void> => {
    return insertItem('plots', toDbObject(plot));
  },
  
  update: async (id: string, plot: Partial<Plot>): Promise<void> => {
    const current = await PlotService.getById(id);
    if (!current) throw new Error(`Plot with id ${id} not found`);
    
    const updated = { ...current, ...plot };
    return insertItem('plots', toDbObject(updated));
  },
  
  delete: async (id: string): Promise<void> => {
    await executeQuery('DELETE FROM plots WHERE id = ?', [id]);
  },
};

// ObservationService - CRUD operations for observations
export const ObservationService = {
  getAll: async (plotId?: string): Promise<Observation[]> => {
    // Query observations
    const query = plotId
      ? 'SELECT * FROM observations WHERE plot_id = ?'
      : 'SELECT * FROM observations';
    const params = plotId ? [plotId] : [];
    
    const observations = await executeQuery<Record<string, any>>(query, params);
    const observationMap = new Map<string, Observation>();
    
    // Create basic observations
    for (const obs of observations) {
      const observation = fromDbObject<Observation>({
        ...obs,
        values: []
      });
      observationMap.set(observation.id, observation);
    }
    
    // If we have observations, fetch their values
    if (observations.length > 0) {
      const obsIds = observations.map(obs => obs.id);
      const placeholders = obsIds.map(() => '?').join(',');
      
      const values = await executeQuery<Record<string, any>>(
        `SELECT * FROM observation_values WHERE observation_id IN (${placeholders})`,
        obsIds
      );
      
      // Add values to their observations
      for (const value of values) {
        const obsValue = fromDbObject<ObservationValue>(value);
        const observation = observationMap.get(obsValue.observationId);
        if (observation) {
          observation.values.push(obsValue);
        }
      }
    }
    
    return Array.from(observationMap.values());
  },
  
  getById: async (id: string): Promise<Observation | null> => {
    const observations = await executeQuery<Record<string, any>>(
      'SELECT * FROM observations WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (observations.length === 0) return null;
    
    const observation = fromDbObject<Observation>({
      ...observations[0],
      values: []
    });
    
    // Fetch values for this observation
    const values = await executeQuery<Record<string, any>>(
      'SELECT * FROM observation_values WHERE observation_id = ?',
      [id]
    );
    
    observation.values = values.map(value => fromDbObject<ObservationValue>(value));
    
    return observation;
  },
  
  create: async (observation: Observation): Promise<void> => {
    try {
      const database = await dbPromise;
      
      // Insert observation
      const obsObj = toDbObject({ ...observation, values: undefined });
      const obsColumns = Object.keys(obsObj);
      const obsPlaceholders = obsColumns.map(() => '?').join(',');
      const obsValues = Object.values(obsObj);
      
      await database.runAsync(
        `INSERT OR REPLACE INTO observations (${obsColumns.join(',')}) VALUES (${obsPlaceholders})`,
        obsValues
      );
      
      // Insert each value
      for (const value of observation.values) {
        const valueObj = toDbObject(value);
        const valueColumns = Object.keys(valueObj);
        const valuePlaceholders = valueColumns.map(() => '?').join(',');
        const valueValues = Object.values(valueObj);
        
        await database.runAsync(
          `INSERT OR REPLACE INTO observation_values (${valueColumns.join(',')}) VALUES (${valuePlaceholders})`,
          valueValues
        );
      }
    } catch (error) {
      console.error('Error creating observation:', error);
      throw error;
    }
  },
  
  update: async (id: string, observation: Partial<Observation>): Promise<void> => {
    const current = await ObservationService.getById(id);
    if (!current) throw new Error(`Observation with id ${id} not found`);
    
    const updated = { ...current, ...observation };
    return ObservationService.create(updated);
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const database = await dbPromise;
      
      // Delete values first (foreign key constraint)
      await database.runAsync('DELETE FROM observation_values WHERE observation_id = ?', [id]);
      
      // Delete observation
      await database.runAsync('DELETE FROM observations WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting observation:', error);
      throw error;
    }
  },
};

// Export services for other entities
export const ProtocolService = {
  getAll: async (trialId?: string): Promise<ObservationProtocol[]> => {
    // Query protocols
    const query = trialId
      ? 'SELECT * FROM observation_protocols WHERE trial_id = ?'
      : 'SELECT * FROM observation_protocols';
    const params = trialId ? [trialId] : [];
    
    const protocols = await executeQuery<Record<string, any>>(query, params);
    const protocolMap = new Map<string, ObservationProtocol>();
    
    // Create basic protocols
    for (const prot of protocols) {
      const protocol = fromDbObject<ObservationProtocol>({
        ...prot,
        metrics: []
      });
      protocolMap.set(protocol.id, protocol);
    }
    
    // If we have protocols, fetch their metrics
    if (protocols.length > 0) {
      const protIds = protocols.map(prot => prot.id);
      const placeholders = protIds.map(() => '?').join(',');
      
      const metrics = await executeQuery<Record<string, any>>(
        `SELECT * FROM observation_metrics WHERE protocol_id IN (${placeholders})`,
        protIds
      );
      
      // Add metrics to their protocols
      for (const metric of metrics) {
        const obsMetric = fromDbObject<ObservationMetric>(metric);
        const protocol = protocolMap.get(obsMetric.protocolId);
        if (protocol) {
          protocol.metrics.push(obsMetric);
        }
      }
    }
    
    return Array.from(protocolMap.values());
  },
  
  getById: async (id: string): Promise<ObservationProtocol | null> => {
    const protocols = await executeQuery<Record<string, any>>(
      'SELECT * FROM observation_protocols WHERE id = ? LIMIT 1',
      [id]
    );
    
    if (protocols.length === 0) return null;
    
    const protocol = fromDbObject<ObservationProtocol>({
      ...protocols[0],
      metrics: []
    });
    
    // Fetch metrics for this protocol
    const metrics = await executeQuery<Record<string, any>>(
      'SELECT * FROM observation_metrics WHERE protocol_id = ?',
      [id]
    );
    
    protocol.metrics = metrics.map(metric => fromDbObject<ObservationMetric>(metric));
    
    return protocol;
  },
  
  create: async (protocol: ObservationProtocol): Promise<void> => {
    try {
      const database = await dbPromise;
      
      // Insert protocol
      const protObj = toDbObject({ ...protocol, metrics: undefined });
      const protColumns = Object.keys(protObj);
      const protPlaceholders = protColumns.map(() => '?').join(',');
      const protValues = Object.values(protObj);
      
      await database.runAsync(
        `INSERT OR REPLACE INTO observation_protocols (${protColumns.join(',')}) VALUES (${protPlaceholders})`,
        protValues
      );
      
      // Insert each metric
      for (const metric of protocol.metrics) {
        const metricObj = toDbObject(metric);
        const metricColumns = Object.keys(metricObj);
        const metricPlaceholders = metricColumns.map(() => '?').join(',');
        const metricValues = Object.values(metricObj);
        
        await database.runAsync(
          `INSERT OR REPLACE INTO observation_metrics (${metricColumns.join(',')}) VALUES (${metricPlaceholders})`,
          metricValues
        );
      }
    } catch (error) {
      console.error('Error creating protocol:', error);
      throw error;
    }
  },
};

export const TreatmentService = {
  getAll: async (trialId?: string): Promise<Treatment[]> => {
    const query = trialId
      ? 'SELECT * FROM treatments WHERE trial_id = ?'
      : 'SELECT * FROM treatments';
    const params = trialId ? [trialId] : [];
    
    const treatments = await executeQuery<Record<string, any>>(query, params);
    return treatments.map(treatment => fromDbObject<Treatment>(treatment));
  },
  
  getById: async (id: string): Promise<Treatment | null> => {
    const treatments = await executeQuery<Record<string, any>>(
      'SELECT * FROM treatments WHERE id = ? LIMIT 1',
      [id]
    );
    return treatments.length > 0 ? fromDbObject<Treatment>(treatments[0]) : null;
  },
  
  create: async (treatment: Treatment): Promise<void> => {
    return insertItem('treatments', toDbObject(treatment));
  },
};

// Image database operations
export const ImageService = {
  getForPlot: async (plotId: string): Promise<Image[]> => {
    const images = await executeQuery<Record<string, any>>(
      'SELECT * FROM images WHERE plot_id = ?',
      [plotId]
    );
    return images.map(image => fromDbObject<Image>(image));
  },
  
  getForObservation: async (observationId: string): Promise<Image[]> => {
    const images = await executeQuery<Record<string, any>>(
      'SELECT * FROM images WHERE observation_id = ?',
      [observationId]
    );
    return images.map(image => fromDbObject<Image>(image));
  },
  
  create: async (image: Image): Promise<void> => {
    return insertItem('images', toDbObject(image));
  },
  
  getUnsyncedImages: async (): Promise<Image[]> => {
    const images = await executeQuery<Record<string, any>>(
      'SELECT * FROM images WHERE is_synced = 0'
    );
    return images.map(image => fromDbObject<Image>(image));
  },
  
  markAsSynced: async (id: string): Promise<void> => {
    await executeQuery(
      'UPDATE images SET is_synced = 1 WHERE id = ?',
      [id]
    );
  },
};

// Export database setup function
export const setupDatabase = async (): Promise<void> => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};