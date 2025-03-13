import SwiftUI

struct LoginView: View {
    @StateObject var viewModel: LoginViewModel
    @Environment(\.colorScheme) var colorScheme
    @State private var showingNetworkAlert = false
    
    // Environment properties for offline mode detection
    @Environment(\.scenePhase) var scenePhase
    @State private var isOffline = !NetworkMonitor.shared.isConnected
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(.systemGreen).opacity(0.6),
                    Color(.systemGreen).opacity(0.3)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                // Logo and app name
                VStack(spacing: 15) {
                    Image("AppLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 100, height: 100)
                        .cornerRadius(15)
                    
                    Text("AG Trial Planner")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.primary)
                    
                    Text("Field data collection & navigation")
                        .font(.headline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 30)
                
                // Main login section
                VStack(spacing: 20) {
                    // Card containing login options
                    VStack(spacing: 16) {
                        if isOffline {
                            offlineLoginSection
                        } else {
                            if viewModel.showEmailLogin {
                                emailLoginSection
                            } else {
                                socialLoginSection
                            }
                            
                            Divider()
                                .padding(.horizontal)
                            
                            demoLoginSection
                        }
                    }
                    .padding(.vertical, 25)
                    .padding(.horizontal, 20)
                    .background(
                        RoundedRectangle(cornerRadius: 20)
                            .fill(Color(.systemBackground))
                            .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
                    )
                    .padding(.horizontal, 20)
                    
                    // Error message
                    if let errorMessage = viewModel.errorMessage {
                        Text(errorMessage)
                            .font(.subheadline)
                            .foregroundColor(.red)
                            .padding(.horizontal, 30)
                            .multilineTextAlignment(.center)
                    }
                }
                
                Spacer()
                
                // Network status indicator
                if isOffline {
                    HStack {
                        Image(systemName: "wifi.slash")
                        Text("You are offline")
                    }
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(10)
                    .background(Color.orange.opacity(0.8))
                    .cornerRadius(10)
                }
                
                // Version and copyright
                Text("Version 1.0 • © 2024 AG Research")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.bottom, 10)
            }
            .padding(.vertical)
            
            // Organization selection sheet
            if viewModel.orgSelectionRequired, let user = viewModel.authenticatedUser,
               let organizations = user.organizations {
                OrganizationSelectionView(
                    organizations: organizations,
                    onSelect: { orgId in
                        viewModel.selectOrganization(id: orgId)
                    }
                )
            }
            
            // Loading overlay
            if viewModel.isLoggingIn {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                
                VStack {
                    ProgressView()
                        .scaleEffect(1.5)
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    
                    Text("Logging in...")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.top, 10)
                }
            }
        }
        .onChange(of: scenePhase) { newPhase in
            if newPhase == .active {
                isOffline = !NetworkMonitor.shared.isConnected
            }
        }
        .onChange(of: NetworkMonitor.shared.isConnected) { isConnected in
            isOffline = !isConnected
        }
    }
    
    // MARK: - View Components
    
    private var socialLoginSection: some View {
        VStack(spacing: 16) {
            Text("Sign in with")
                .font(.headline)
                .foregroundColor(.secondary)
            
            Button(action: viewModel.loginWithGoogle) {
                HStack {
                    Image("GoogleLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                    
                    Text("Continue with Google")
                        .font(.headline)
                        .foregroundColor(.primary)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemBackground))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            
            Button(action: viewModel.loginWithMicrosoft) {
                HStack {
                    Image("MicrosoftLogo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 24, height: 24)
                    
                    Text("Continue with Microsoft")
                        .font(.headline)
                        .foregroundColor(.primary)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemBackground))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
            
            Button {
                withAnimation {
                    viewModel.showEmailLogin = true
                }
            } label: {
                Text("Log in with email instead")
                    .font(.subheadline)
                    .foregroundColor(.accentColor)
            }
            .padding(.top, 5)
        }
    }
    
    private var emailLoginSection: some View {
        VStack(spacing: 16) {
            Text("Log in with email")
                .font(.headline)
                .foregroundColor(.secondary)
            
            TextField("Email", text: $viewModel.email)
                .textContentType(.emailAddress)
                .keyboardType(.emailAddress)
                .autocapitalization(.none)
                .disableAutocorrection(true)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
            
            SecureField("Password", text: $viewModel.password)
                .textContentType(.password)
                .padding()
                .background(Color(.systemGray6))
                .cornerRadius(8)
            
            Button(action: viewModel.loginWithEmailPassword) {
                Text("Log In")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.accentColor)
                    .cornerRadius(8)
            }
            
            Button {
                withAnimation {
                    viewModel.showEmailLogin = false
                    viewModel.email = ""
                    viewModel.password = ""
                    viewModel.errorMessage = nil
                }
            } label: {
                Text("Back to login options")
                    .font(.subheadline)
                    .foregroundColor(.accentColor)
            }
            .padding(.top, 5)
        }
    }
    
    private var demoLoginSection: some View {
        VStack(spacing: 12) {
            if viewModel.showDemoOptions {
                Text("Demo Login")
                    .font(.headline)
                    .foregroundColor(.secondary)
                
                Picker("Select Role", selection: $viewModel.selectedDemoRole) {
                    Text("Admin").tag(UserRole.admin)
                    Text("Researcher").tag(UserRole.researcher)
                    Text("Field Technician").tag(UserRole.fieldTechnician)
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.vertical, 5)
                
                Button(action: viewModel.loginWithDemo) {
                    Text("Log in as \(viewModel.selectedDemoRole.displayName)")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.orange)
                        .cornerRadius(8)
                }
                
                Button {
                    withAnimation {
                        viewModel.showDemoOptions = false
                    }
                } label: {
                    Text("Cancel")
                        .font(.subheadline)
                        .foregroundColor(.accentColor)
                }
                .padding(.top, 5)
            } else {
                Button {
                    withAnimation {
                        viewModel.showDemoOptions = true
                    }
                } label: {
                    Text("Demo Login (No Account Required)")
                        .font(.subheadline)
                        .foregroundColor(.orange)
                }
            }
        }
    }
    
    private var offlineLoginSection: some View {
        VStack(spacing: 20) {
            Image(systemName: "wifi.slash")
                .font(.system(size: 40))
                .foregroundColor(.orange)
            
            Text("You're offline")
                .font(.headline)
            
            Text("You can continue with offline mode if you've previously logged in on this device.")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)
            
            Button(action: viewModel.loginOffline) {
                Text("Continue Offline")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(
                        viewModel.authService.canAuthenticateOffline() ? Color.accentColor : Color.gray
                    )
                    .cornerRadius(8)
            }
            .disabled(!viewModel.authService.canAuthenticateOffline())
            
            if !viewModel.authService.canAuthenticateOffline() {
                Text("You must login online at least once before using offline mode")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
            }
            
            Button {
                showingNetworkAlert = true
            } label: {
                Text("Troubleshoot Connection")
                    .font(.subheadline)
                    .foregroundColor(.accentColor)
            }
        }
        .alert("Network Troubleshooting", isPresented: $showingNetworkAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text("1. Check your device's Wi-Fi or cellular connection\n2. Enable Airplane Mode, then disable it\n3. Restart your device if the problem persists")
        }
    }
}

// MARK: - Organization Selection View
struct OrganizationSelectionView: View {
    let organizations: [UserOrganization]
    let onSelect: (String) -> Void
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Select Organization")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("You belong to multiple organizations. Please select which one you'd like to use.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(organizations) { org in
                        Button {
                            onSelect(org.id)
                        } label: {
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(org.name)
                                        .font(.headline)
                                        .foregroundColor(.primary)
                                    
                                    Text(org.role.rawValue.capitalized)
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                
                                Spacer()
                                
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.gray)
                            }
                            .padding()
                            .background(Color(.systemBackground))
                            .cornerRadius(10)
                            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                        }
                    }
                }
                .padding(.horizontal)
            }
        }
        .padding(30)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.2), radius: 16, x: 0, y: 5)
        )
        .padding(20)
    }
}