import UIKit
import GoogleSignIn
import MSAL
import SwiftyBeaver
import MapboxMaps

let log = SwiftyBeaver.self

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    private let dependencyContainer = DependencyContainer.shared

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Configure logger
        setupLogging()
        
        // Configure dependencies
        configureDependencies()
        
        // Configure third-party SDKs
        configureMapbox()
        
        // Determine initial authentication state
        checkAuthenticationState()
        
        return true
    }
    
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        // Handle authentication callbacks
        if GIDSignIn.sharedInstance.handle(url) {
            return true
        }
        
        // Handle Microsoft authentication
        return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String)
    }
    
    // MARK: - Private methods
    
    private func setupLogging() {
        // Console logging
        let console = ConsoleDestination()
        console.minLevel = .debug
        console.format = "$DHH:mm:ss$d $L $N.$F:$l - $M"
        log.addDestination(console)
        
        // File logging
        let file = FileDestination()
        file.minLevel = .info
        log.addDestination(file)
        
        #if DEBUG
        log.debug("App started in DEBUG mode")
        #else
        log.info("App started in RELEASE mode")
        #endif
    }
    
    private func configureDependencies() {
        // Core services
        dependencyContainer.register(NetworkService.self, implementation: NetworkServiceImpl())
        dependencyContainer.register(DatabaseService.self, implementation: DatabaseServiceImpl())
        dependencyContainer.register(LocationService.self, implementation: LocationServiceImpl())
        dependencyContainer.register(AuthService.self, implementation: AuthServiceImpl())
        dependencyContainer.register(SyncService.self, implementation: SyncServiceImpl())
        
        // Repositories
        dependencyContainer.register(UserRepository.self, implementation: UserRepositoryImpl())
        dependencyContainer.register(TrialRepository.self, implementation: TrialRepositoryImpl())
        dependencyContainer.register(PlotRepository.self, implementation: PlotRepositoryImpl())
        dependencyContainer.register(ObservationRepository.self, implementation: ObservationRepositoryImpl())
        
        log.debug("Dependencies configured")
    }
    
    private func configureMapbox() {
        #if DEBUG
        let mapboxKey = EnvironmentConfig.mapboxPublicKeyDevelopment
        #else
        let mapboxKey = EnvironmentConfig.mapboxPublicKeyProduction
        #endif
        
        ResourceOptionsManager.default.resourceOptions.accessToken = mapboxKey
        log.debug("Mapbox configured")
    }
    
    private func checkAuthenticationState() {
        let authService = dependencyContainer.resolve(AuthService.self)
        if authService.hasValidSession() {
            log.debug("User has valid session")
            // Configure UI for authenticated state
            setupAuthenticatedUI()
        } else {
            log.debug("User not authenticated")
            // Configure UI for login
            setupUnauthenticatedUI()
        }
    }
    
    private func setupAuthenticatedUI() {
        let mainCoordinator = MainCoordinator(window: window)
        mainCoordinator.start()
    }
    
    private func setupUnauthenticatedUI() {
        let authCoordinator = AuthenticationCoordinator(window: window)
        authCoordinator.start()
    }
}