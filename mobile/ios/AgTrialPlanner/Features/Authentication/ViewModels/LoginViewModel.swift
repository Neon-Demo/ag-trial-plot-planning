import Foundation
import Combine
import SwiftUI

class LoginViewModel: ObservableObject {
    // Dependencies
    private let authService: AuthService
    private var cancellables = Set<AnyCancellable>()
    
    // UI state
    @Published var email: String = ""
    @Published var password: String = ""
    @Published var selectedDemoRole: UserRole = .researcher
    @Published var isLoggingIn = false
    @Published var showEmailLogin = false
    @Published var showDemoOptions = false
    @Published var errorMessage: String?
    @Published var orgSelectionRequired = false
    
    // Success state
    @Published var authenticatedUser: AuthUser?
    
    init(authService: AuthService) {
        self.authService = authService
    }
    
    func loginWithGoogle() {
        guard !isLoggingIn else { return }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.loginWithGoogle()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.handleLoginError(error)
                    }
                },
                receiveValue: { [weak self] user in
                    guard let self = self else { return }
                    self.handleSuccessfulLogin(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func loginWithMicrosoft() {
        guard !isLoggingIn else { return }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.loginWithMicrosoft()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.handleLoginError(error)
                    }
                },
                receiveValue: { [weak self] user in
                    guard let self = self else { return }
                    self.handleSuccessfulLogin(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func loginWithEmailPassword() {
        guard !isLoggingIn, !email.isEmpty, !password.isEmpty else {
            errorMessage = "Please enter both email and password"
            return
        }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.loginWithEmailPassword(email: email, password: password)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.handleLoginError(error)
                    }
                },
                receiveValue: { [weak self] user in
                    guard let self = self else { return }
                    self.handleSuccessfulLogin(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func loginWithDemo() {
        guard !isLoggingIn else { return }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.loginWithDemo(role: selectedDemoRole)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.handleLoginError(error)
                    }
                },
                receiveValue: { [weak self] user in
                    guard let self = self else { return }
                    self.handleSuccessfulLogin(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func loginOffline() {
        guard !isLoggingIn, authService.canAuthenticateOffline() else {
            errorMessage = "Offline authentication not available"
            return
        }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.authenticateOffline()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.handleLoginError(error)
                    }
                },
                receiveValue: { [weak self] user in
                    guard let self = self else { return }
                    self.handleSuccessfulLogin(user)
                }
            )
            .store(in: &cancellables)
    }
    
    func selectOrganization(id: String) {
        guard !isLoggingIn else { return }
        
        isLoggingIn = true
        errorMessage = nil
        
        authService.selectOrganization(id: id)
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    guard let self = self else { return }
                    self.isLoggingIn = false
                    
                    if case .failure(let error) = completion {
                        self.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] success in
                    guard let self = self, let user = self.authenticatedUser else { return }
                    if success {
                        self.orgSelectionRequired = false
                        // Notify about completed authentication with organization selected
                    }
                }
            )
            .store(in: &cancellables)
    }
    
    // MARK: - Helper methods
    
    private func handleSuccessfulLogin(_ user: AuthUser) {
        authenticatedUser = user
        
        // Check if organization selection is needed
        if let organizations = user.organizations, organizations.count > 1,
           authService.getCurrentOrganization() == nil {
            orgSelectionRequired = true
        } else {
            // Authentication complete, organization selected or not needed
            orgSelectionRequired = false
        }
    }
    
    private func handleLoginError(_ error: Error) {
        if let authError = error as? AuthError {
            errorMessage = authError.errorDescription
        } else {
            errorMessage = error.localizedDescription
        }
        
        log.error("Login error: \(errorMessage ?? "Unknown")")
    }
}