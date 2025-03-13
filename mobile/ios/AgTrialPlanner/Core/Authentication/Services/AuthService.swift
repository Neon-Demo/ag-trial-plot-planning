import Foundation
import Combine
import KeychainAccess
import GoogleSignIn
import MSAL

protocol AuthService {
    // Session management
    func hasValidSession() -> Bool
    func getCurrentUser() -> AuthUser?
    func refreshTokenIfNeeded() -> AnyPublisher<Bool, Error>
    func logout() -> AnyPublisher<Void, Error>
    
    // Authentication methods
    func loginWithEmailPassword(email: String, password: String) -> AnyPublisher<AuthUser, Error>
    func loginWithGoogle() -> AnyPublisher<AuthUser, Error>
    func loginWithMicrosoft() -> AnyPublisher<AuthUser, Error>
    func loginWithDemo(role: UserRole) -> AnyPublisher<AuthUser, Error>
    
    // Organization selection
    func selectOrganization(id: String) -> AnyPublisher<Bool, Error>
    func getCurrentOrganization() -> UserOrganization?
    
    // Token management
    func getAccessToken() -> String?
    
    // Offline support
    func canAuthenticateOffline() -> Bool
    func authenticateOffline() -> AnyPublisher<AuthUser, Error>
}

class AuthServiceImpl: AuthService {
    private let keychain = Keychain(service: "com.ag-trial-planner.auth")
    private let networkService: NetworkService
    private let databaseService: DatabaseService
    
    private let tokenKey = "auth.accessToken"
    private let refreshTokenKey = "auth.refreshToken"
    private let userKey = "auth.user"
    private let currentOrganizationKey = "auth.currentOrganization"
    
    private var currentUser: AuthUser?
    private var currentOrganization: UserOrganization?
    
    init(networkService: NetworkService, databaseService: DatabaseService) {
        self.networkService = networkService
        self.databaseService = databaseService
        
        // Load cached user and organization
        loadUserFromKeychain()
        loadCurrentOrganizationFromKeychain()
    }
    
    // MARK: - Session management
    
    func hasValidSession() -> Bool {
        guard let token = getAccessToken(), !token.isEmpty else {
            return false
        }
        
        return !isTokenExpired(token)
    }
    
    func getCurrentUser() -> AuthUser? {
        return currentUser
    }
    
    func refreshTokenIfNeeded() -> AnyPublisher<Bool, Error> {
        guard let token = getAccessToken(), isTokenExpired(token),
              let refreshToken = getRefreshToken() else {
            return Just(false)
                .setFailureType(to: Error.self)
                .eraseToAnyPublisher()
        }
        
        return networkService.post(
            endpoint: "/auth/refresh",
            body: ["refreshToken": refreshToken]
        )
        .tryMap { [weak self] (data: RefreshTokenResponse) -> Bool in
            guard let self = self else { throw AuthError.unknown }
            
            try self.saveTokens(accessToken: data.accessToken, refreshToken: data.refreshToken)
            return true
        }
        .catch { error -> AnyPublisher<Bool, Error> in
            // If refresh fails, require re-authentication
            return Fail(error: AuthError.sessionExpired).eraseToAnyPublisher()
        }
        .eraseToAnyPublisher()
    }
    
    func logout() -> AnyPublisher<Void, Error> {
        return Future<Void, Error> { [weak self] promise in
            guard let self = self else {
                promise(.failure(AuthError.unknown))
                return
            }
            
            // Clear keychain data
            do {
                try self.keychain.remove(self.tokenKey)
                try self.keychain.remove(self.refreshTokenKey)
                try self.keychain.remove(self.userKey)
                try self.keychain.remove(self.currentOrganizationKey)
                
                // Reset current user and organization
                self.currentUser = nil
                self.currentOrganization = nil
                
                // Sign out of Google if used
                GIDSignIn.sharedInstance.signOut()
                
                // Sign out of Microsoft if used (this would need proper MSAL implementation)
                
                promise(.success(()))
            } catch {
                promise(.failure(AuthError.logoutFailed))
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Authentication methods
    
    func loginWithEmailPassword(email: String, password: String) -> AnyPublisher<AuthUser, Error> {
        return networkService.post(
            endpoint: "/auth/login",
            body: ["email": email, "password": password]
        )
        .tryMap { [weak self] (response: LoginResponse) -> AuthUser in
            guard let self = self else { throw AuthError.unknown }
            
            try self.saveTokens(accessToken: response.accessToken, refreshToken: response.refreshToken)
            try self.saveUser(response.user)
            
            self.currentUser = response.user
            
            // If user has only one organization, select it automatically
            if let organizations = response.user.organizations, organizations.count == 1 {
                try self.saveCurrentOrganization(organizations[0])
                self.currentOrganization = organizations[0]
            }
            
            return response.user
        }
        .eraseToAnyPublisher()
    }
    
    func loginWithGoogle() -> AnyPublisher<AuthUser, Error> {
        return Future<GIDGoogleUser, Error> { promise in
            let signInConfig = GIDConfiguration(clientID: EnvironmentConfig.googleClientId)
            
            GIDSignIn.sharedInstance.signIn(with: signInConfig, presenting: UIApplication.shared.keyWindow!.rootViewController!) { user, error in
                if let error = error {
                    promise(.failure(AuthError.socialLoginFailed(error.localizedDescription)))
                    return
                }
                
                guard let user = user else {
                    promise(.failure(AuthError.socialLoginFailed("No user data received")))
                    return
                }
                
                promise(.success(user))
            }
        }
        .flatMap { [weak self] googleUser -> AnyPublisher<AuthUser, Error> in
            guard let self = self,
                  let idToken = googleUser.authentication.idToken else {
                return Fail(error: AuthError.socialLoginFailed("Invalid Google token")).eraseToAnyPublisher()
            }
            
            return self.networkService.post(
                endpoint: "/auth/google",
                body: ["idToken": idToken]
            )
            .tryMap { [weak self] (response: LoginResponse) -> AuthUser in
                guard let self = self else { throw AuthError.unknown }
                
                try self.saveTokens(accessToken: response.accessToken, refreshToken: response.refreshToken)
                try self.saveUser(response.user)
                
                self.currentUser = response.user
                
                // If user has only one organization, select it automatically
                if let organizations = response.user.organizations, organizations.count == 1 {
                    try self.saveCurrentOrganization(organizations[0])
                    self.currentOrganization = organizations[0]
                }
                
                return response.user
            }
            .eraseToAnyPublisher()
        }
        .eraseToAnyPublisher()
    }
    
    func loginWithMicrosoft() -> AnyPublisher<AuthUser, Error> {
        // Microsoft authentication implementation would go here
        // This is a simplified version for demonstration
        return Future<AuthUser, Error> { promise in
            // Placeholder for MSAL implementation
            promise(.failure(AuthError.notImplemented))
        }.eraseToAnyPublisher()
    }
    
    func loginWithDemo(role: UserRole) -> AnyPublisher<AuthUser, Error> {
        return Future<AuthUser, Error> { [weak self] promise in
            guard let self = self else {
                promise(.failure(AuthError.unknown))
                return
            }
            
            // Create a demo user
            let demoUser = AuthUser.createDemoUser(role: role)
            
            do {
                // Save demo user
                try self.saveUser(demoUser)
                self.currentUser = demoUser
                
                // Create and save a demo organization
                if let demoOrg = demoUser.organizations?.first {
                    try self.saveCurrentOrganization(demoOrg)
                    self.currentOrganization = demoOrg
                }
                
                // Create a demo token (will expire in 24 hours)
                let expiry = Date().addingTimeInterval(86400).timeIntervalSince1970
                let demoToken = "demo_token_\(role.rawValue)_\(expiry)"
                try self.saveTokens(accessToken: demoToken, refreshToken: "demo_refresh_token")
                
                promise(.success(demoUser))
            } catch {
                promise(.failure(AuthError.unknown))
            }
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Organization selection
    
    func selectOrganization(id: String) -> AnyPublisher<Bool, Error> {
        return Future<Bool, Error> { [weak self] promise in
            guard let self = self,
                  let user = self.currentUser,
                  let organizations = user.organizations else {
                promise(.failure(AuthError.notAuthenticated))
                return
            }
            
            guard let organization = organizations.first(where: { $0.id == id }) else {
                promise(.failure(AuthError.organizationNotFound))
                return
            }
            
            do {
                try self.saveCurrentOrganization(organization)
                self.currentOrganization = organization
                promise(.success(true))
            } catch {
                promise(.failure(error))
            }
        }.eraseToAnyPublisher()
    }
    
    func getCurrentOrganization() -> UserOrganization? {
        return currentOrganization
    }
    
    // MARK: - Token management
    
    func getAccessToken() -> String? {
        do {
            return try keychain.get(tokenKey)
        } catch {
            log.error("Failed to retrieve access token: \(error)")
            return nil
        }
    }
    
    // MARK: - Offline support
    
    func canAuthenticateOffline() -> Bool {
        // We can authenticate offline if we have a cached user
        return currentUser != nil
    }
    
    func authenticateOffline() -> AnyPublisher<AuthUser, Error> {
        return Future<AuthUser, Error> { [weak self] promise in
            guard let self = self, let user = self.currentUser else {
                promise(.failure(AuthError.offlineAuthFailed))
                return
            }
            
            promise(.success(user))
        }.eraseToAnyPublisher()
    }
    
    // MARK: - Private helpers
    
    private func getRefreshToken() -> String? {
        do {
            return try keychain.get(refreshTokenKey)
        } catch {
            log.error("Failed to retrieve refresh token: \(error)")
            return nil
        }
    }
    
    private func isTokenExpired(_ token: String) -> Bool {
        // JWT token expiration check
        // This is a simplified version - in reality, you'd parse the JWT
        let parts = token.components(separatedBy: ".")
        guard parts.count == 3 else {
            return true // Invalid token format
        }
        
        // Demo token expiration check
        if token.hasPrefix("demo_token_") {
            let components = token.components(separatedBy: "_")
            if components.count == 4, let expiryTimestamp = Double(components[3]),
               Date().timeIntervalSince1970 < expiryTimestamp {
                return false // Demo token is still valid
            }
            return true // Demo token is expired
        }
        
        // Decode the payload
        guard let payloadData = Data(base64Encoded: parts[1].base64UrlDecoded()),
              let payload = try? JSONSerialization.jsonObject(with: payloadData) as? [String: Any],
              let exp = payload["exp"] as? TimeInterval else {
            return true // Can't parse expiration
        }
        
        return Date().timeIntervalSince1970 > exp
    }
    
    private func saveTokens(accessToken: String, refreshToken: String) throws {
        try keychain.set(accessToken, key: tokenKey)
        try keychain.set(refreshToken, key: refreshTokenKey)
    }
    
    private func saveUser(_ user: AuthUser) throws {
        let userData = try JSONEncoder().encode(user)
        let userString = String(data: userData, encoding: .utf8)!
        try keychain.set(userString, key: userKey)
    }
    
    private func saveCurrentOrganization(_ organization: UserOrganization) throws {
        let orgData = try JSONEncoder().encode(organization)
        let orgString = String(data: orgData, encoding: .utf8)!
        try keychain.set(orgString, key: currentOrganizationKey)
    }
    
    private func loadUserFromKeychain() {
        do {
            if let userString = try keychain.get(userKey),
               let userData = userString.data(using: .utf8) {
                currentUser = try JSONDecoder().decode(AuthUser.self, from: userData)
            }
        } catch {
            log.error("Failed to load user from keychain: \(error)")
        }
    }
    
    private func loadCurrentOrganizationFromKeychain() {
        do {
            if let orgString = try keychain.get(currentOrganizationKey),
               let orgData = orgString.data(using: .utf8) {
                currentOrganization = try JSONDecoder().decode(UserOrganization.self, from: orgData)
            }
        } catch {
            log.error("Failed to load organization from keychain: \(error)")
        }
    }
}

// MARK: - Supporting Models

struct LoginResponse: Codable {
    let user: AuthUser
    let accessToken: String
    let refreshToken: String
}

struct RefreshTokenResponse: Codable {
    let accessToken: String
    let refreshToken: String
}

// MARK: - Errors

enum AuthError: Error, LocalizedError {
    case notAuthenticated
    case sessionExpired
    case invalidCredentials
    case socialLoginFailed(String)
    case offlineAuthFailed
    case organizationNotFound
    case logoutFailed
    case notImplemented
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .notAuthenticated:
            return "User is not authenticated"
        case .sessionExpired:
            return "Your session has expired. Please sign in again."
        case .invalidCredentials:
            return "Invalid email or password"
        case .socialLoginFailed(let message):
            return "Social login failed: \(message)"
        case .offlineAuthFailed:
            return "Offline authentication failed"
        case .organizationNotFound:
            return "Organization not found"
        case .logoutFailed:
            return "Failed to log out"
        case .notImplemented:
            return "This feature is not implemented yet"
        case .unknown:
            return "An unknown authentication error occurred"
        }
    }
}

// MARK: - Extensions

extension String {
    func base64UrlDecoded() -> String {
        var base64 = self
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        
        // Add padding if needed
        if base64.count % 4 != 0 {
            base64.append(String(repeating: "=", count: 4 - base64.count % 4))
        }
        
        return base64
    }
}