import Foundation

struct Trial: Identifiable, Codable, Equatable {
    let id: String
    let name: String
    let description: String?
    let startDate: Date
    let endDate: Date?
    let status: TrialStatus
    let location: String?
    let organizationId: String
    let boundaryCoordinates: [Coordinate]?
    let createdAt: Date?
    let updatedAt: Date?
    
    // Computed properties
    var plotCount: Int?
    var pendingObservationCount: Int?
    var completedObservationCount: Int?
    
    var statusText: String {
        switch status {
        case .draft:
            return "Draft"
        case .active:
            return "Active"
        case .completed:
            return "Completed"
        case .archived:
            return "Archived"
        }
    }
    
    var dateRangeText: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .none
        
        let start = formatter.string(from: startDate)
        let end = endDate.map { formatter.string(from: $0) } ?? "Ongoing"
        
        return "\(start) - \(end)"
    }
    
    var isActive: Bool {
        return status == .active
    }
    
    var progressPercentage: Double {
        guard let completed = completedObservationCount, 
              let pending = pendingObservationCount,
              completed + pending > 0 else {
            return 0.0
        }
        
        return Double(completed) / Double(completed + pending)
    }
}

enum TrialStatus: String, Codable, CaseIterable {
    case draft
    case active
    case completed
    case archived
}

struct Coordinate: Codable, Equatable {
    let latitude: Double
    let longitude: Double
    
    var asTuple: (Double, Double) {
        return (latitude, longitude)
    }
}