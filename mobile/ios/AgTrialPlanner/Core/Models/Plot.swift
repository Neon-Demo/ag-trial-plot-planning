import Foundation

struct Plot: Identifiable, Codable, Equatable {
    let id: String
    let plotNumber: String
    let trialId: String
    let treatmentId: String?
    let coordinates: [Coordinate]
    let area: Double?
    let notes: String?
    let createdAt: Date?
    let updatedAt: Date?
    
    // Optional relationships
    var treatment: Treatment?
    var pendingObservations: Int?
    var completedObservations: Int?
    
    // Computed properties
    var centerCoordinate: Coordinate? {
        guard !coordinates.isEmpty else { return nil }
        
        let lats = coordinates.map { $0.latitude }
        let longs = coordinates.map { $0.longitude }
        
        let centerLat = lats.reduce(0.0, +) / Double(lats.count)
        let centerLong = longs.reduce(0.0, +) / Double(longs.count)
        
        return Coordinate(latitude: centerLat, longitude: centerLong)
    }
    
    var areaFormatted: String? {
        guard let area = area else { return nil }
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        
        if area >= 10000 {
            // Convert to hectares
            let hectares = area / 10000
            return "\(formatter.string(from: NSNumber(value: hectares)) ?? "0") ha"
        } else {
            // Display in square meters
            return "\(formatter.string(from: NSNumber(value: area)) ?? "0") m²"
        }
    }
    
    var progressPercentage: Double {
        guard let pending = pendingObservations, 
              let completed = completedObservations,
              pending + completed > 0 else {
            return 0.0
        }
        
        return Double(completed) / Double(pending + completed)
    }
    
    var statusText: String {
        if let pending = pendingObservations, pending > 0 {
            return "\(pending) pending"
        } else {
            return "Complete"
        }
    }
}

struct Treatment: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let description: String?
    let trialId: String
    let factors: [String: Any]?
    let createdAt: Date?
    let updatedAt: Date?
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, trialId, createdAt, updatedAt
        case factors
    }
    
    init(id: String, name: String, description: String?, trialId: String, factors: [String: Any]?, createdAt: Date?, updatedAt: Date?) {
        self.id = id
        self.name = name
        self.description = description
        self.trialId = trialId
        self.factors = factors
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(String.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        description = try container.decodeIfPresent(String.self, forKey: .description)
        trialId = try container.decode(String.self, forKey: .trialId)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
        
        // Decode JSON factors
        if let factorsData = try container.decodeIfPresent(Data.self, forKey: .factors),
           let json = try JSONSerialization.jsonObject(with: factorsData) as? [String: Any] {
            factors = json
        } else {
            factors = nil
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encodeIfPresent(description, forKey: .description)
        try container.encode(trialId, forKey: .trialId)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
        try container.encodeIfPresent(updatedAt, forKey: .updatedAt)
        
        // Encode JSON factors
        if let factors = factors {
            let factorsData = try JSONSerialization.data(withJSONObject: factors)
            try container.encode(factorsData, forKey: .factors)
        }
    }
}