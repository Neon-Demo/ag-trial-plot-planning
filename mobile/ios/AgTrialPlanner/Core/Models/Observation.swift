import Foundation

struct Observation: Identifiable, Codable, Equatable {
    let id: String
    let plotId: String
    let protocolId: String
    let observationDate: Date
    let observerName: String?
    let notes: String?
    let weatherConditions: String?
    var syncStatus: SyncStatus
    let createdAt: Date?
    let updatedAt: Date?
    
    // Relationships
    var values: [ObservationValue]?
    var images: [ObservationImage]?
    
    // Optional properties loaded from relationships
    var protocolName: String?
    var plotNumber: String?
    var trialId: String?
    var trialName: String?
    
    // Computed properties
    var hasImages: Bool {
        return (images?.count ?? 0) > 0
    }
    
    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: observationDate)
    }
    
    var isPending: Bool {
        return syncStatus == .pending
    }
    
    static func == (lhs: Observation, rhs: Observation) -> Bool {
        return lhs.id == rhs.id && 
               lhs.updatedAt == rhs.updatedAt &&
               lhs.syncStatus == rhs.syncStatus
    }
}

struct ObservationValue: Identifiable, Codable, Equatable {
    let id: String
    let metricId: String
    let metricName: String
    let valueType: ObservationValueType
    let value: Any
    let createdAt: Date?
    let updatedAt: Date?
    
    enum CodingKeys: String, CodingKey {
        case id, metricId, metricName, valueType, createdAt, updatedAt
        case numericValue
        case textValue
        case booleanValue
        case dateValue
    }
    
    init(id: String, metricId: String, metricName: String, valueType: ObservationValueType, value: Any, createdAt: Date? = nil, updatedAt: Date? = nil) {
        self.id = id
        self.metricId = metricId
        self.metricName = metricName
        self.valueType = valueType
        self.value = value
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        
        id = try container.decode(String.self, forKey: .id)
        metricId = try container.decode(String.self, forKey: .metricId)
        metricName = try container.decode(String.self, forKey: .metricName)
        valueType = try container.decode(ObservationValueType.self, forKey: .valueType)
        createdAt = try container.decodeIfPresent(Date.self, forKey: .createdAt)
        updatedAt = try container.decodeIfPresent(Date.self, forKey: .updatedAt)
        
        // Decode the value based on its type
        switch valueType {
        case .numeric:
            value = try container.decode(Double.self, forKey: .numericValue)
        case .text, .categorical:
            value = try container.decode(String.self, forKey: .textValue)
        case .boolean:
            value = try container.decode(Bool.self, forKey: .booleanValue)
        case .date:
            value = try container.decode(Date.self, forKey: .dateValue)
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        
        try container.encode(id, forKey: .id)
        try container.encode(metricId, forKey: .metricId)
        try container.encode(metricName, forKey: .metricName)
        try container.encode(valueType, forKey: .valueType)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
        try container.encodeIfPresent(updatedAt, forKey: .updatedAt)
        
        // Encode the value based on its type
        switch valueType {
        case .numeric:
            if let numericValue = value as? Double {
                try container.encode(numericValue, forKey: .numericValue)
            } else {
                throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: container.codingPath, debugDescription: "Expected Double for numeric value"))
            }
        case .text, .categorical:
            if let textValue = value as? String {
                try container.encode(textValue, forKey: .textValue)
            } else {
                throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: container.codingPath, debugDescription: "Expected String for text value"))
            }
        case .boolean:
            if let boolValue = value as? Bool {
                try container.encode(boolValue, forKey: .booleanValue)
            } else {
                throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: container.codingPath, debugDescription: "Expected Bool for boolean value"))
            }
        case .date:
            if let dateValue = value as? Date {
                try container.encode(dateValue, forKey: .dateValue)
            } else {
                throw EncodingError.invalidValue(value, EncodingError.Context(codingPath: container.codingPath, debugDescription: "Expected Date for date value"))
            }
        }
    }
    
    static func == (lhs: ObservationValue, rhs: ObservationValue) -> Bool {
        guard lhs.id == rhs.id, lhs.valueType == rhs.valueType else {
            return false
        }
        
        switch lhs.valueType {
        case .numeric:
            return (lhs.value as? Double) == (rhs.value as? Double)
        case .text, .categorical:
            return (lhs.value as? String) == (rhs.value as? String)
        case .boolean:
            return (lhs.value as? Bool) == (rhs.value as? Bool)
        case .date:
            return (lhs.value as? Date) == (rhs.value as? Date)
        }
    }
    
    // Convenience accessor methods
    func asDouble() -> Double? {
        return value as? Double
    }
    
    func asString() -> String? {
        return value as? String
    }
    
    func asBool() -> Bool? {
        return value as? Bool
    }
    
    func asDate() -> Date? {
        return value as? Date
    }
    
    // Formatted value representation
    var formattedValue: String {
        switch valueType {
        case .numeric:
            if let numericValue = value as? Double {
                return String(format: "%.2f", numericValue)
            }
            return "0.00"
        case .text, .categorical:
            return (value as? String) ?? ""
        case .boolean:
            return (value as? Bool == true) ? "Yes" : "No"
        case .date:
            if let dateValue = value as? Date {
                let formatter = DateFormatter()
                formatter.dateStyle = .medium
                return formatter.string(from: dateValue)
            }
            return ""
        }
    }
}

struct ObservationImage: Identifiable, Codable, Equatable {
    let id: String
    let observationId: String
    let url: String?
    let localPath: String
    let caption: String?
    var syncStatus: SyncStatus
    let createdAt: Date?
    let updatedAt: Date?
    
    // Computed properties
    var displayPath: String {
        return url ?? localPath
    }
    
    var isPending: Bool {
        return syncStatus == .pending
    }
    
    var isLocal: Bool {
        return url == nil || url?.isEmpty == true
    }
}

enum ObservationValueType: String, Codable {
    case numeric
    case text
    case categorical
    case boolean
    case date
}

enum SyncStatus: String, Codable {
    case synced
    case pending
}