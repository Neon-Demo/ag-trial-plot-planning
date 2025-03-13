import Foundation

struct AuthUser: Codable, Identifiable, Equatable {
    let id: String
    let email: String
    let name: String?
    let role: UserRole
    let organizations: [UserOrganization]?
    var profileImageUrl: URL?
    let isDemo: Bool
    
    // Computed properties
    var displayName: String {
        name ?? email.components(separatedBy: "@").first ?? email
    }
    
    var initials: String {
        guard let name = name, !name.isEmpty else {
            return String(email.prefix(1).uppercased())
        }
        
        let components = name.components(separatedBy: " ")
        if components.count > 1 {
            let first = components.first?.prefix(1) ?? ""
            let last = components.last?.prefix(1) ?? ""
            return (first + last).uppercased()
        } else {
            return String(name.prefix(1).uppercased())
        }
    }
    
    // Create a demo user for testing or offline demo mode
    static func createDemoUser(role: UserRole = .researcher) -> AuthUser {
        let demoOrg = UserOrganization(id: "demo-org", name: "Demo Organization", role: .member)
        
        var username: String
        
        switch role {
        case .admin:
            username = "Admin"
        case .researcher:
            username = "Researcher"
        case .fieldTechnician:
            username = "Field Technician"
        }
        
        return AuthUser(
            id: "demo-user-\(role.rawValue)",
            email: "\(role.rawValue)@example.com",
            name: "Demo \(username)",
            role: role,
            organizations: [demoOrg],
            profileImageUrl: nil,
            isDemo: true
        )
    }
}

enum UserRole: String, Codable, CaseIterable {
    case admin
    case researcher
    case fieldTechnician = "field-technician"
    
    var displayName: String {
        switch self {
        case .admin:
            return "Administrator"
        case .researcher:
            return "Researcher"
        case .fieldTechnician:
            return "Field Technician"
        }
    }
    
    var permissions: [Permission] {
        switch self {
        case .admin:
            return Permission.allCases
        case .researcher:
            return [.viewTrials, .createTrials, .editTrials, 
                    .viewObservations, .createObservations, .editObservations,
                    .useNavigation]
        case .fieldTechnician:
            return [.viewTrials, .viewObservations, .createObservations, .useNavigation]
        }
    }
    
    func hasPermission(_ permission: Permission) -> Bool {
        return permissions.contains(permission)
    }
}

enum Permission: String, Codable, CaseIterable {
    case viewTrials
    case createTrials
    case editTrials
    case deleteTrials
    
    case viewObservations
    case createObservations
    case editObservations
    
    case manageUsers
    case manageOrganizations
    
    case useNavigation
    case manageSettings
}

struct UserOrganization: Codable, Identifiable, Equatable {
    let id: String
    let name: String
    let role: OrganizationRole
}

enum OrganizationRole: String, Codable {
    case admin
    case member
}