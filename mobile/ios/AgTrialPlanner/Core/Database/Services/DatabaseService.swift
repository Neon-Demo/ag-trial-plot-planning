import Foundation
import SQLite
import Combine

protocol DatabaseService {
    // CRUD operations for different entities
    
    // Trials management
    func getTrials() -> AnyPublisher<[Trial], Error>
    func getTrial(id: String) -> AnyPublisher<Trial?, Error>
    func saveTrials(_ trials: [Trial]) -> AnyPublisher<Int, Error>
    func saveTrial(_ trial: Trial) -> AnyPublisher<Bool, Error>
    func deleteTrials(ids: [String]) -> AnyPublisher<Int, Error>
    
    // Plots management
    func getPlots(trialId: String) -> AnyPublisher<[Plot], Error>
    func getPlot(id: String) -> AnyPublisher<Plot?, Error>
    func savePlots(_ plots: [Plot]) -> AnyPublisher<Int, Error>
    func savePlot(_ plot: Plot) -> AnyPublisher<Bool, Error>
    func deletePlots(trialId: String) -> AnyPublisher<Int, Error>
    
    // Observations management
    func getObservations(plotId: String? = nil, trialId: String? = nil) -> AnyPublisher<[Observation], Error>
    func getObservation(id: String) -> AnyPublisher<Observation?, Error>
    func saveObservations(_ observations: [Observation]) -> AnyPublisher<Int, Error>
    func saveObservation(_ observation: Observation) -> AnyPublisher<Bool, Error>
    func getPendingSyncObservations() -> AnyPublisher<[Observation], Error>
    func updateObservationSyncStatus(id: String, synced: Bool) -> AnyPublisher<Bool, Error>
    
    // Image management
    func getImages(observationId: String) -> AnyPublisher<[ObservationImage], Error>
    func saveImages(_ images: [ObservationImage]) -> AnyPublisher<Int, Error>
    func getPendingSyncImages() -> AnyPublisher<[ObservationImage], Error>
    func updateImageSyncStatus(id: String, synced: Bool) -> AnyPublisher<Bool, Error>
    
    // Database management
    func purgeDatabase() -> AnyPublisher<Bool, Error>
    func getDatabaseSize() -> AnyPublisher<Int64, Error>
    func getEntitiesCount() -> AnyPublisher<[String: Int], Error>
    func vacuum() -> AnyPublisher<Bool, Error>
}

class DatabaseServiceImpl: DatabaseService {
    private var db: Connection?
    private let dbQueue = DispatchQueue(label: "com.ag-trial-planner.db", qos: .utility)
    
    // Tables
    private var trialsTable: Table?
    private var plotsTable: Table?
    private var observationsTable: Table?
    private var observationValuesTable: Table?
    private var observationImagesTable: Table?
    private var treatmentsTable: Table?
    
    // Shared columns
    private let id = Expression<String>("id")
    private let createdAt = Expression<Date>("created_at")
    private let updatedAt = Expression<Date>("updated_at")
    private let syncStatus = Expression<String>("sync_status")
    
    // Trial columns
    private let trialName = Expression<String>("name")
    private let trialDescription = Expression<String?>("description")
    private let trialStartDate = Expression<Date>("start_date")
    private let trialEndDate = Expression<Date?>("end_date")
    private let trialStatus = Expression<String>("status")
    private let trialLocation = Expression<String?>("location")
    private let trialOrganizationId = Expression<String>("organization_id")
    private let trialBoundary = Expression<Data?>("boundary")
    
    // Plot columns
    private let plotNumber = Expression<String>("plot_number")
    private let plotTrialId = Expression<String>("trial_id")
    private let plotTreatmentId = Expression<String?>("treatment_id")
    private let plotCoordinates = Expression<Data>("coordinates")
    private let plotArea = Expression<Double?>("area")
    private let plotNotes = Expression<String?>("notes")
    
    // Observation columns
    private let observationPlotId = Expression<String>("plot_id")
    private let observationProtocolId = Expression<String>("protocol_id")
    private let observationDate = Expression<Date>("observation_date")
    private let observerName = Expression<String?>("observer_name")
    private let observerNotes = Expression<String?>("notes")
    private let observationWeather = Expression<String?>("weather")
    
    // Observation Value columns
    private let valueObservationId = Expression<String>("observation_id")
    private let valueMetricId = Expression<String>("metric_id")
    private let valueMetricName = Expression<String>("metric_name")
    private let valueType = Expression<String>("value_type")
    private let valueData = Expression<Data>("value_data")
    
    // Image columns
    private let imageObservationId = Expression<String>("observation_id")
    private let imageUrl = Expression<String?>("url")
    private let imageLocalPath = Expression<String>("local_path")
    private let imageCaption = Expression<String?>("caption")
    
    // Treatment columns
    private let treatmentName = Expression<String>("name")
    private let treatmentDescription = Expression<String?>("description")
    private let treatmentTrialId = Expression<String>("trial_id")
    private let treatmentFactors = Expression<Data?>("factors")
    
    init() {
        setupDatabase()
    }
    
    // MARK: - Database setup
    
    private func setupDatabase() {
        do {
            // Get the database file path in the app's document directory
            let fileURL = try FileManager.default
                .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
                .appendingPathComponent("ag_trial_planner.sqlite")
            
            log.debug("Database path: \(fileURL.path)")
            
            // Open the database connection
            db = try Connection(fileURL.path)
            
            // Set pragma for foreign keys
            try db?.run("PRAGMA foreign_keys = ON")
            
            // Set up tables
            setupTables()
            
            log.info("Database setup complete")
        } catch {
            log.error("Database setup error: \(error)")
        }
    }
    
    private func setupTables() {
        guard let db = db else {
            log.error("Database connection not available")
            return
        }
        
        do {
            // Trials table
            trialsTable = Table("trials")
            try db.run(trialsTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(trialName)
                table.column(trialDescription)
                table.column(trialStartDate)
                table.column(trialEndDate)
                table.column(trialStatus)
                table.column(trialLocation)
                table.column(trialOrganizationId)
                table.column(trialBoundary)
                table.column(createdAt)
                table.column(updatedAt)
                table.column(syncStatus, defaultValue: "synced")
            })
            
            // Treatments table
            treatmentsTable = Table("treatments")
            try db.run(treatmentsTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(treatmentName)
                table.column(treatmentDescription)
                table.column(treatmentTrialId)
                table.column(treatmentFactors)
                table.column(createdAt)
                table.column(updatedAt)
                
                table.foreignKey(treatmentTrialId, references: trialsTable!, id, onDelete: .cascade)
            })
            
            // Plots table
            plotsTable = Table("plots")
            try db.run(plotsTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(plotNumber)
                table.column(plotTrialId)
                table.column(plotTreatmentId)
                table.column(plotCoordinates)
                table.column(plotArea)
                table.column(plotNotes)
                table.column(createdAt)
                table.column(updatedAt)
                
                table.foreignKey(plotTrialId, references: trialsTable!, id, onDelete: .cascade)
                table.foreignKey(plotTreatmentId, references: treatmentsTable!, id, onDelete: .setNull)
            })
            
            // Observations table
            observationsTable = Table("observations")
            try db.run(observationsTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(observationPlotId)
                table.column(observationProtocolId)
                table.column(observationDate)
                table.column(observerName)
                table.column(observerNotes)
                table.column(observationWeather)
                table.column(createdAt)
                table.column(updatedAt)
                table.column(syncStatus, defaultValue: "pending")
                
                table.foreignKey(observationPlotId, references: plotsTable!, id, onDelete: .cascade)
            })
            
            // Observation Values table
            observationValuesTable = Table("observation_values")
            try db.run(observationValuesTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(valueObservationId)
                table.column(valueMetricId)
                table.column(valueMetricName)
                table.column(valueType)
                table.column(valueData)
                table.column(createdAt)
                table.column(updatedAt)
                
                table.foreignKey(valueObservationId, references: observationsTable!, id, onDelete: .cascade)
            })
            
            // Observation Images table
            observationImagesTable = Table("observation_images")
            try db.run(observationImagesTable!.create(ifNotExists: true) { table in
                table.column(id, primaryKey: true)
                table.column(imageObservationId)
                table.column(imageUrl)
                table.column(imageLocalPath)
                table.column(imageCaption)
                table.column(createdAt)
                table.column(updatedAt)
                table.column(syncStatus, defaultValue: "pending")
                
                table.foreignKey(imageObservationId, references: observationsTable!, id, onDelete: .cascade)
            })
            
            // Create indices
            try db.run(plotsTable!.createIndex(plotTrialId, ifNotExists: true))
            try db.run(observationsTable!.createIndex(observationPlotId, ifNotExists: true))
            try db.run(observationValuesTable!.createIndex(valueObservationId, ifNotExists: true))
            try db.run(observationImagesTable!.createIndex(imageObservationId, ifNotExists: true))
            
            log.debug("Tables created successfully")
        } catch {
            log.error("Error creating tables: \(error)")
        }
    }
    
    // MARK: - Trial Operations
    
    func getTrials() -> AnyPublisher<[Trial], Error> {
        return Future<[Trial], Error> { [weak self] promise in
            guard let self = self, let db = self.db, let trialsTable = self.trialsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = trialsTable.order(self.updatedAt.desc)
                    let rows = try db.prepare(query)
                    
                    var trials = [Trial]()
                    for row in rows {
                        do {
                            let trial = try self.decodeTrial(from: row)
                            trials.append(trial)
                        } catch {
                            log.error("Error decoding trial: \(error)")
                        }
                    }
                    
                    promise(.success(trials))
                } catch {
                    log.error("Error fetching trials: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getTrial(id trialId: String) -> AnyPublisher<Trial?, Error> {
        return Future<Trial?, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let trialsTable = self.trialsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = trialsTable.filter(self.id == trialId)
                    if let row = try db.pluck(query) {
                        do {
                            let trial = try self.decodeTrial(from: row)
                            promise(.success(trial))
                        } catch {
                            log.error("Error decoding trial: \(error)")
                            promise(.failure(DatabaseError.decodingError(error.localizedDescription)))
                        }
                    } else {
                        promise(.success(nil))
                    }
                } catch {
                    log.error("Error fetching trial: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func saveTrials(_ trials: [Trial]) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let trialsTable = self.trialsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var count = 0
                    try db.transaction {
                        for trial in trials {
                            do {
                                if try self.trialExists(id: trial.id) {
                                    // Update existing trial
                                    let query = trialsTable.filter(self.id == trial.id)
                                    try db.run(query.update(
                                        self.trialName <- trial.name,
                                        self.trialDescription <- trial.description,
                                        self.trialStartDate <- trial.startDate,
                                        self.trialEndDate <- trial.endDate,
                                        self.trialStatus <- trial.status.rawValue,
                                        self.trialLocation <- trial.location,
                                        self.trialOrganizationId <- trial.organizationId,
                                        self.trialBoundary <- self.encodeBoundary(trial.boundaryCoordinates),
                                        self.updatedAt <- Date(),
                                        self.syncStatus <- "synced"
                                    ))
                                } else {
                                    // Insert new trial
                                    try db.run(trialsTable.insert(
                                        self.id <- trial.id,
                                        self.trialName <- trial.name,
                                        self.trialDescription <- trial.description,
                                        self.trialStartDate <- trial.startDate,
                                        self.trialEndDate <- trial.endDate,
                                        self.trialStatus <- trial.status.rawValue,
                                        self.trialLocation <- trial.location,
                                        self.trialOrganizationId <- trial.organizationId,
                                        self.trialBoundary <- self.encodeBoundary(trial.boundaryCoordinates),
                                        self.createdAt <- trial.createdAt ?? Date(),
                                        self.updatedAt <- trial.updatedAt ?? Date(),
                                        self.syncStatus <- "synced"
                                    ))
                                }
                                count += 1
                            } catch {
                                log.error("Error saving trial \(trial.id): \(error)")
                            }
                        }
                    }
                    
                    promise(.success(count))
                } catch {
                    log.error("Error saving trials: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func saveTrial(_ trial: Trial) -> AnyPublisher<Bool, Error> {
        return saveTrials([trial])
            .map { count in count > 0 }
            .eraseToAnyPublisher()
    }
    
    func deleteTrials(ids: [String]) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let trialsTable = self.trialsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = trialsTable.filter(ids.contains(self.id))
                    let count = try db.run(query.delete())
                    promise(.success(count))
                } catch {
                    log.error("Error deleting trials: \(error)")
                    promise(.failure(DatabaseError.deleteError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Plot Operations
    
    func getPlots(trialId: String) -> AnyPublisher<[Plot], Error> {
        return Future<[Plot], Error> { [weak self] promise in
            guard let self = self, let db = self.db, let plotsTable = self.plotsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = plotsTable.filter(self.plotTrialId == trialId).order(self.plotNumber.asc)
                    let rows = try db.prepare(query)
                    
                    var plots = [Plot]()
                    for row in rows {
                        do {
                            let plot = try self.decodePlot(from: row)
                            plots.append(plot)
                        } catch {
                            log.error("Error decoding plot: \(error)")
                        }
                    }
                    
                    promise(.success(plots))
                } catch {
                    log.error("Error fetching plots: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getPlot(id plotId: String) -> AnyPublisher<Plot?, Error> {
        return Future<Plot?, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let plotsTable = self.plotsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = plotsTable.filter(self.id == plotId)
                    if let row = try db.pluck(query) {
                        do {
                            let plot = try self.decodePlot(from: row)
                            promise(.success(plot))
                        } catch {
                            log.error("Error decoding plot: \(error)")
                            promise(.failure(DatabaseError.decodingError(error.localizedDescription)))
                        }
                    } else {
                        promise(.success(nil))
                    }
                } catch {
                    log.error("Error fetching plot: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func savePlots(_ plots: [Plot]) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let plotsTable = self.plotsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var count = 0
                    try db.transaction {
                        for plot in plots {
                            do {
                                if try self.plotExists(id: plot.id) {
                                    // Update existing plot
                                    let query = plotsTable.filter(self.id == plot.id)
                                    try db.run(query.update(
                                        self.plotNumber <- plot.plotNumber,
                                        self.plotTrialId <- plot.trialId,
                                        self.plotTreatmentId <- plot.treatmentId,
                                        self.plotCoordinates <- self.encodeCoordinates(plot.coordinates),
                                        self.plotArea <- plot.area,
                                        self.plotNotes <- plot.notes,
                                        self.updatedAt <- Date()
                                    ))
                                } else {
                                    // Insert new plot
                                    try db.run(plotsTable.insert(
                                        self.id <- plot.id,
                                        self.plotNumber <- plot.plotNumber,
                                        self.plotTrialId <- plot.trialId,
                                        self.plotTreatmentId <- plot.treatmentId,
                                        self.plotCoordinates <- self.encodeCoordinates(plot.coordinates),
                                        self.plotArea <- plot.area,
                                        self.plotNotes <- plot.notes,
                                        self.createdAt <- plot.createdAt ?? Date(),
                                        self.updatedAt <- plot.updatedAt ?? Date()
                                    ))
                                }
                                count += 1
                            } catch {
                                log.error("Error saving plot \(plot.id): \(error)")
                            }
                        }
                    }
                    
                    promise(.success(count))
                } catch {
                    log.error("Error saving plots: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func savePlot(_ plot: Plot) -> AnyPublisher<Bool, Error> {
        return savePlots([plot])
            .map { count in count > 0 }
            .eraseToAnyPublisher()
    }
    
    func deletePlots(trialId: String) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let plotsTable = self.plotsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = plotsTable.filter(self.plotTrialId == trialId)
                    let count = try db.run(query.delete())
                    promise(.success(count))
                } catch {
                    log.error("Error deleting plots: \(error)")
                    promise(.failure(DatabaseError.deleteError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Observation Operations
    
    func getObservations(plotId: String? = nil, trialId: String? = nil) -> AnyPublisher<[Observation], Error> {
        return Future<[Observation], Error> { [weak self] promise in
            guard let self = self, let db = self.db, 
                  let observationsTable = self.observationsTable,
                  let plotsTable = self.plotsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var query = observationsTable.order(self.observationDate.desc)
                    
                    if let plotId = plotId {
                        query = query.filter(self.observationPlotId == plotId)
                    } else if let trialId = trialId {
                        // Join with plots to filter by trial ID
                        query = query.join(plotsTable, on: self.observationPlotId == plotsTable[self.id])
                            .filter(plotsTable[self.plotTrialId] == trialId)
                    }
                    
                    let rows = try db.prepare(query)
                    
                    let observations = try self.processObservationRows(rows)
                    promise(.success(observations))
                } catch {
                    log.error("Error fetching observations: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getObservation(id observationId: String) -> AnyPublisher<Observation?, Error> {
        return Future<Observation?, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationsTable = self.observationsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationsTable.filter(self.id == observationId)
                    
                    guard let row = try db.pluck(query) else {
                        promise(.success(nil))
                        return
                    }
                    
                    let observation = try self.decodeObservation(from: row)
                    
                    // Fetch values
                    let values = try self.fetchObservationValues(observationId: observationId)
                    var observationWithValues = observation
                    observationWithValues.values = values
                    
                    // Fetch images
                    let images = try self.fetchObservationImages(observationId: observationId)
                    observationWithValues.images = images
                    
                    promise(.success(observationWithValues))
                } catch {
                    log.error("Error fetching observation: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func saveObservations(_ observations: [Observation]) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, 
                  let observationsTable = self.observationsTable,
                  let observationValuesTable = self.observationValuesTable,
                  let observationImagesTable = self.observationImagesTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var count = 0
                    try db.transaction {
                        for observation in observations {
                            let observationExists = try self.observationExists(id: observation.id)
                            
                            if observationExists {
                                // Update existing observation
                                let query = observationsTable.filter(self.id == observation.id)
                                try db.run(query.update(
                                    self.observationPlotId <- observation.plotId,
                                    self.observationProtocolId <- observation.protocolId,
                                    self.observationDate <- observation.observationDate,
                                    self.observerName <- observation.observerName,
                                    self.observerNotes <- observation.notes,
                                    self.observationWeather <- observation.weatherConditions,
                                    self.updatedAt <- Date(),
                                    self.syncStatus <- observation.syncStatus.rawValue
                                ))
                            } else {
                                // Insert new observation
                                try db.run(observationsTable.insert(
                                    self.id <- observation.id,
                                    self.observationPlotId <- observation.plotId,
                                    self.observationProtocolId <- observation.protocolId,
                                    self.observationDate <- observation.observationDate,
                                    self.observerName <- observation.observerName,
                                    self.observerNotes <- observation.notes,
                                    self.observationWeather <- observation.weatherConditions,
                                    self.createdAt <- observation.createdAt ?? Date(),
                                    self.updatedAt <- observation.updatedAt ?? Date(),
                                    self.syncStatus <- observation.syncStatus.rawValue
                                ))
                            }
                            
                            // Handle values
                            if let values = observation.values {
                                // First delete existing values
                                let deleteValuesQuery = observationValuesTable.filter(self.valueObservationId == observation.id)
                                try db.run(deleteValuesQuery.delete())
                                
                                // Then insert new values
                                for value in values {
                                    try db.run(observationValuesTable.insert(
                                        self.id <- value.id,
                                        self.valueObservationId <- observation.id,
                                        self.valueMetricId <- value.metricId,
                                        self.valueMetricName <- value.metricName,
                                        self.valueType <- value.valueType.rawValue,
                                        self.valueData <- try self.encodeValueData(value),
                                        self.createdAt <- value.createdAt ?? Date(),
                                        self.updatedAt <- value.updatedAt ?? Date()
                                    ))
                                }
                            }
                            
                            // Handle images
                            if let images = observation.images {
                                for image in images {
                                    if try self.imageExists(id: image.id) {
                                        // Update existing image
                                        let imageQuery = observationImagesTable.filter(self.id == image.id)
                                        try db.run(imageQuery.update(
                                            self.imageUrl <- image.url,
                                            self.imageLocalPath <- image.localPath,
                                            self.imageCaption <- image.caption,
                                            self.updatedAt <- Date(),
                                            self.syncStatus <- image.syncStatus.rawValue
                                        ))
                                    } else {
                                        // Insert new image
                                        try db.run(observationImagesTable.insert(
                                            self.id <- image.id,
                                            self.imageObservationId <- observation.id,
                                            self.imageUrl <- image.url,
                                            self.imageLocalPath <- image.localPath,
                                            self.imageCaption <- image.caption,
                                            self.createdAt <- image.createdAt ?? Date(),
                                            self.updatedAt <- image.updatedAt ?? Date(),
                                            self.syncStatus <- image.syncStatus.rawValue
                                        ))
                                    }
                                }
                            }
                            
                            count += 1
                        }
                    }
                    
                    promise(.success(count))
                } catch {
                    log.error("Error saving observations: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func saveObservation(_ observation: Observation) -> AnyPublisher<Bool, Error> {
        return saveObservations([observation])
            .map { count in count > 0 }
            .eraseToAnyPublisher()
    }
    
    func getPendingSyncObservations() -> AnyPublisher<[Observation], Error> {
        return Future<[Observation], Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationsTable = self.observationsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationsTable.filter(self.syncStatus == SyncStatus.pending.rawValue)
                        .order(self.observationDate.asc)
                    
                    let rows = try db.prepare(query)
                    let observations = try self.processObservationRows(rows)
                    
                    promise(.success(observations))
                } catch {
                    log.error("Error fetching pending sync observations: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func updateObservationSyncStatus(id: String, synced: Bool) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationsTable = self.observationsTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationsTable.filter(self.id == id)
                    let status = synced ? SyncStatus.synced.rawValue : SyncStatus.pending.rawValue
                    
                    let count = try db.run(query.update(
                        self.syncStatus <- status,
                        self.updatedAt <- Date()
                    ))
                    
                    promise(.success(count > 0))
                } catch {
                    log.error("Error updating observation sync status: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Image Operations
    
    func getImages(observationId: String) -> AnyPublisher<[ObservationImage], Error> {
        return Future<[ObservationImage], Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationImagesTable = self.observationImagesTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationImagesTable.filter(self.imageObservationId == observationId)
                    let rows = try db.prepare(query)
                    
                    var images = [ObservationImage]()
                    for row in rows {
                        do {
                            let image = try self.decodeImage(from: row)
                            images.append(image)
                        } catch {
                            log.error("Error decoding image: \(error)")
                        }
                    }
                    
                    promise(.success(images))
                } catch {
                    log.error("Error fetching images: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func saveImages(_ images: [ObservationImage]) -> AnyPublisher<Int, Error> {
        return Future<Int, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationImagesTable = self.observationImagesTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var count = 0
                    try db.transaction {
                        for image in images {
                            if try self.imageExists(id: image.id) {
                                // Update existing image
                                let query = observationImagesTable.filter(self.id == image.id)
                                try db.run(query.update(
                                    self.imageUrl <- image.url,
                                    self.imageLocalPath <- image.localPath,
                                    self.imageCaption <- image.caption,
                                    self.updatedAt <- Date(),
                                    self.syncStatus <- image.syncStatus.rawValue
                                ))
                            } else {
                                // Insert new image
                                try db.run(observationImagesTable.insert(
                                    self.id <- image.id,
                                    self.imageObservationId <- image.observationId,
                                    self.imageUrl <- image.url,
                                    self.imageLocalPath <- image.localPath,
                                    self.imageCaption <- image.caption,
                                    self.createdAt <- image.createdAt ?? Date(),
                                    self.updatedAt <- image.updatedAt ?? Date(),
                                    self.syncStatus <- image.syncStatus.rawValue
                                ))
                            }
                            count += 1
                        }
                    }
                    
                    promise(.success(count))
                } catch {
                    log.error("Error saving images: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getPendingSyncImages() -> AnyPublisher<[ObservationImage], Error> {
        return Future<[ObservationImage], Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationImagesTable = self.observationImagesTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationImagesTable.filter(self.syncStatus == SyncStatus.pending.rawValue)
                    let rows = try db.prepare(query)
                    
                    var images = [ObservationImage]()
                    for row in rows {
                        do {
                            let image = try self.decodeImage(from: row)
                            images.append(image)
                        } catch {
                            log.error("Error decoding image: \(error)")
                        }
                    }
                    
                    promise(.success(images))
                } catch {
                    log.error("Error fetching pending sync images: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func updateImageSyncStatus(id: String, synced: Bool) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { [weak self] promise in
            guard let self = self, let db = self.db, let observationImagesTable = self.observationImagesTable else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    let query = observationImagesTable.filter(self.id == id)
                    let status = synced ? SyncStatus.synced.rawValue : SyncStatus.pending.rawValue
                    
                    let count = try db.run(query.update(
                        self.syncStatus <- status,
                        self.updatedAt <- Date()
                    ))
                    
                    promise(.success(count > 0))
                } catch {
                    log.error("Error updating image sync status: \(error)")
                    promise(.failure(DatabaseError.updateError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Database Management
    
    func purgeDatabase() -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { [weak self] promise in
            guard let self = self, let db = self.db else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    try db.transaction {
                        // Delete all tables in reverse order of dependencies
                        if let observationImagesTable = self.observationImagesTable {
                            try db.run(observationImagesTable.delete())
                        }
                        
                        if let observationValuesTable = self.observationValuesTable {
                            try db.run(observationValuesTable.delete())
                        }
                        
                        if let observationsTable = self.observationsTable {
                            try db.run(observationsTable.delete())
                        }
                        
                        if let plotsTable = self.plotsTable {
                            try db.run(plotsTable.delete())
                        }
                        
                        if let treatmentsTable = self.treatmentsTable {
                            try db.run(treatmentsTable.delete())
                        }
                        
                        if let trialsTable = self.trialsTable {
                            try db.run(trialsTable.delete())
                        }
                    }
                    
                    try self.vacuum().sink(
                        receiveCompletion: { _ in },
                        receiveValue: { _ in }
                    ).store(in: &self.cancellables)
                    
                    promise(.success(true))
                } catch {
                    log.error("Error purging database: \(error)")
                    promise(.failure(DatabaseError.deleteError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getDatabaseSize() -> AnyPublisher<Int64, Error> {
        return Future<Int64, Error> { [weak self] promise in
            guard let self = self, let db = self.db else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    // Get the database file path
                    let fileURL = try FileManager.default
                        .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
                        .appendingPathComponent("ag_trial_planner.sqlite")
                    
                    // Get file attributes
                    let attributes = try FileManager.default.attributesOfItem(atPath: fileURL.path)
                    if let fileSize = attributes[.size] as? Int64 {
                        promise(.success(fileSize))
                    } else {
                        promise(.failure(DatabaseError.unknown("Could not determine database size")))
                    }
                } catch {
                    log.error("Error getting database size: \(error)")
                    promise(.failure(DatabaseError.unknown(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func getEntitiesCount() -> AnyPublisher<[String: Int], Error> {
        return Future<[String: Int], Error> { [weak self] promise in
            guard let self = self, let db = self.db else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    var counts = [String: Int]()
                    
                    if let trialsTable = self.trialsTable {
                        counts["trials"] = try db.scalar(trialsTable.count)
                    }
                    
                    if let plotsTable = self.plotsTable {
                        counts["plots"] = try db.scalar(plotsTable.count)
                    }
                    
                    if let treatmentsTable = self.treatmentsTable {
                        counts["treatments"] = try db.scalar(treatmentsTable.count)
                    }
                    
                    if let observationsTable = self.observationsTable {
                        counts["observations"] = try db.scalar(observationsTable.count)
                        
                        // Count pending observations
                        let pendingCount = try db.scalar(observationsTable.filter(self.syncStatus == SyncStatus.pending.rawValue).count)
                        counts["pendingObservations"] = pendingCount
                    }
                    
                    if let observationValuesTable = self.observationValuesTable {
                        counts["observationValues"] = try db.scalar(observationValuesTable.count)
                    }
                    
                    if let observationImagesTable = self.observationImagesTable {
                        counts["observationImages"] = try db.scalar(observationImagesTable.count)
                        
                        // Count pending images
                        let pendingCount = try db.scalar(observationImagesTable.filter(self.syncStatus == SyncStatus.pending.rawValue).count)
                        counts["pendingImages"] = pendingCount
                    }
                    
                    promise(.success(counts))
                } catch {
                    log.error("Error getting entity counts: \(error)")
                    promise(.failure(DatabaseError.queryError(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    func vacuum() -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { [weak self] promise in
            guard let self = self, let db = self.db else {
                promise(.failure(DatabaseError.connectionError))
                return
            }
            
            self.dbQueue.async {
                do {
                    try db.execute("VACUUM")
                    promise(.success(true))
                } catch {
                    log.error("Error vacuuming database: \(error)")
                    promise(.failure(DatabaseError.unknown(error.localizedDescription)))
                }
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Helper methods
    
    private func trialExists(id: String) throws -> Bool {
        guard let db = db, let trialsTable = trialsTable else {
            throw DatabaseError.connectionError
        }
        
        let query = trialsTable.filter(self.id == id).count
        return try db.scalar(query) > 0
    }
    
    private func plotExists(id: String) throws -> Bool {
        guard let db = db, let plotsTable = plotsTable else {
            throw DatabaseError.connectionError
        }
        
        let query = plotsTable.filter(self.id == id).count
        return try db.scalar(query) > 0
    }
    
    private func observationExists(id: String) throws -> Bool {
        guard let db = db, let observationsTable = observationsTable else {
            throw DatabaseError.connectionError
        }
        
        let query = observationsTable.filter(self.id == id).count
        return try db.scalar(query) > 0
    }
    
    private func imageExists(id: String) throws -> Bool {
        guard let db = db, let observationImagesTable = observationImagesTable else {
            throw DatabaseError.connectionError
        }
        
        let query = observationImagesTable.filter(self.id == id).count
        return try db.scalar(query) > 0
    }
    
    private func decodeTrial(from row: Row) throws -> Trial {
        let boundaryData = try? row.get(trialBoundary)
        let boundaryCoordinates = try self.decodeBoundary(boundaryData)
        
        return Trial(
            id: row[id],
            name: row[trialName],
            description: row[trialDescription],
            startDate: row[trialStartDate],
            endDate: row[trialEndDate],
            status: TrialStatus(rawValue: row[trialStatus]) ?? .draft,
            location: row[trialLocation],
            organizationId: row[trialOrganizationId],
            boundaryCoordinates: boundaryCoordinates,
            createdAt: row[createdAt],
            updatedAt: row[updatedAt]
        )
    }
    
    private func decodePlot(from row: Row) throws -> Plot {
        let coordinatesData = row[plotCoordinates]
        let coordinates = try self.decodeCoordinates(coordinatesData)
        
        return Plot(
            id: row[id],
            plotNumber: row[plotNumber],
            trialId: row[plotTrialId],
            treatmentId: row[plotTreatmentId],
            coordinates: coordinates,
            area: row[plotArea],
            notes: row[plotNotes],
            createdAt: row[createdAt],
            updatedAt: row[updatedAt]
        )
    }
    
    private func decodeObservation(from row: Row) throws -> Observation {
        return Observation(
            id: row[id],
            plotId: row[observationPlotId],
            protocolId: row[observationProtocolId],
            observationDate: row[observationDate],
            observerName: row[observerName],
            notes: row[observerNotes],
            weatherConditions: row[observationWeather],
            syncStatus: SyncStatus(rawValue: row[syncStatus]) ?? .pending,
            createdAt: row[createdAt],
            updatedAt: row[updatedAt]
        )
    }
    
    private func decodeImage(from row: Row) throws -> ObservationImage {
        return ObservationImage(
            id: row[id],
            observationId: row[imageObservationId],
            url: row[imageUrl],
            localPath: row[imageLocalPath],
            caption: row[imageCaption],
            syncStatus: SyncStatus(rawValue: row[syncStatus]) ?? .pending,
            createdAt: row[createdAt],
            updatedAt: row[updatedAt]
        )
    }
    
    private func processObservationRows(_ rows: AnySequence<Row>) throws -> [Observation] {
        var observations = [Observation]()
        
        for row in rows {
            do {
                var observation = try self.decodeObservation(from: row)
                
                // Fetch values for this observation
                let values = try self.fetchObservationValues(observationId: observation.id)
                observation.values = values
                
                // Fetch images for this observation
                let images = try self.fetchObservationImages(observationId: observation.id)
                observation.images = images
                
                observations.append(observation)
            } catch {
                log.error("Error processing observation row: \(error)")
            }
        }
        
        return observations
    }
    
    private func fetchObservationValues(observationId: String) throws -> [ObservationValue] {
        guard let db = db, let observationValuesTable = observationValuesTable else {
            throw DatabaseError.connectionError
        }
        
        let query = observationValuesTable.filter(valueObservationId == observationId)
        let rows = try db.prepare(query)
        
        var values = [ObservationValue]()
        for row in rows {
            do {
                let value = try decodeObservationValue(from: row)
                values.append(value)
            } catch {
                log.error("Error decoding observation value: \(error)")
            }
        }
        
        return values
    }
    
    private func fetchObservationImages(observationId: String) throws -> [ObservationImage] {
        guard let db = db, let observationImagesTable = observationImagesTable else {
            throw DatabaseError.connectionError
        }
        
        let query = observationImagesTable.filter(imageObservationId == observationId)
        let rows = try db.prepare(query)
        
        var images = [ObservationImage]()
        for row in rows {
            do {
                let image = try decodeImage(from: row)
                images.append(image)
            } catch {
                log.error("Error decoding observation image: \(error)")
            }
        }
        
        return images
    }
    
    private func decodeObservationValue(from row: Row) throws -> ObservationValue {
        let valueTypeString = row[valueType]
        let valueTypeEnum = ObservationValueType(rawValue: valueTypeString) ?? .text
        let valueData = row[valueData]
        
        var value: Any
        
        switch valueTypeEnum {
        case .numeric:
            if let numericValue = try JSONDecoder().decode(Double.self, from: valueData) {
                value = numericValue
            } else {
                value = 0.0
            }
        case .text:
            if let textValue = try JSONDecoder().decode(String.self, from: valueData) {
                value = textValue
            } else {
                value = ""
            }
        case .categorical:
            if let categoricalValue = try JSONDecoder().decode(String.self, from: valueData) {
                value = categoricalValue
            } else {
                value = ""
            }
        case .boolean:
            if let boolValue = try JSONDecoder().decode(Bool.self, from: valueData) {
                value = boolValue
            } else {
                value = false
            }
        case .date:
            if let dateValue = try JSONDecoder().decode(Date.self, from: valueData) {
                value = dateValue
            } else {
                value = Date()
            }
        }
        
        return ObservationValue(
            id: row[id],
            metricId: row[valueMetricId],
            metricName: row[valueMetricName],
            valueType: valueTypeEnum,
            value: value,
            createdAt: row[createdAt],
            updatedAt: row[updatedAt]
        )
    }
    
    // MARK: - Encoding and Decoding helpers
    
    private func encodeBoundary(_ boundaryCoordinates: [Coordinate]?) -> Data? {
        guard let boundaryCoordinates = boundaryCoordinates else { return nil }
        
        do {
            return try JSONEncoder().encode(boundaryCoordinates)
        } catch {
            log.error("Error encoding boundary coordinates: \(error)")
            return nil
        }
    }
    
    private func decodeBoundary(_ data: Data?) -> [Coordinate]? {
        guard let data = data else { return nil }
        
        do {
            return try JSONDecoder().decode([Coordinate].self, from: data)
        } catch {
            log.error("Error decoding boundary coordinates: \(error)")
            return nil
        }
    }
    
    private func encodeCoordinates(_ coordinates: [Coordinate]) -> Data {
        do {
            return try JSONEncoder().encode(coordinates)
        } catch {
            log.error("Error encoding coordinates: \(error)")
            return Data()
        }
    }
    
    private func decodeCoordinates(_ data: Data) throws -> [Coordinate] {
        do {
            return try JSONDecoder().decode([Coordinate].self, from: data)
        } catch {
            log.error("Error decoding coordinates: \(error)")
            throw DatabaseError.decodingError(error.localizedDescription)
        }
    }
    
    private func encodeValueData(_ value: ObservationValue) throws -> Data {
        do {
            switch value.valueType {
            case .numeric:
                if let numericValue = value.value as? Double {
                    return try JSONEncoder().encode(numericValue)
                }
            case .text, .categorical:
                if let textValue = value.value as? String {
                    return try JSONEncoder().encode(textValue)
                }
            case .boolean:
                if let boolValue = value.value as? Bool {
                    return try JSONEncoder().encode(boolValue)
                }
            case .date:
                if let dateValue = value.value as? Date {
                    return try JSONEncoder().encode(dateValue)
                }
            }
            
            throw DatabaseError.encodingError("Value type mismatch")
        } catch {
            log.error("Error encoding value data: \(error)")
            throw DatabaseError.encodingError(error.localizedDescription)
        }
    }
}

// MARK: - Errors

enum DatabaseError: Error, LocalizedError {
    case connectionError
    case queryError(String)
    case updateError(String)
    case deleteError(String)
    case encodingError(String)
    case decodingError(String)
    case unknown(String)
    
    var errorDescription: String? {
        switch self {
        case .connectionError:
            return "Database connection error"
        case .queryError(let details):
            return "Query error: \(details)"
        case .updateError(let details):
            return "Update error: \(details)"
        case .deleteError(let details):
            return "Delete error: \(details)"
        case .encodingError(let details):
            return "Encoding error: \(details)"
        case .decodingError(let details):
            return "Decoding error: \(details)"
        case .unknown(let details):
            return "Unknown error: \(details)"
        }
    }
}