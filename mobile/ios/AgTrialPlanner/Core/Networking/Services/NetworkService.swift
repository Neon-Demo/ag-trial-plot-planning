import Foundation
import Combine
import Alamofire

protocol NetworkService {
    // Basic request methods
    func get<T: Decodable>(endpoint: String, parameters: [String: Any]?) -> AnyPublisher<T, Error>
    func post<T: Decodable, U: Encodable>(endpoint: String, body: U) -> AnyPublisher<T, Error>
    func put<T: Decodable, U: Encodable>(endpoint: String, body: U) -> AnyPublisher<T, Error>
    func delete<T: Decodable>(endpoint: String) -> AnyPublisher<T, Error>
    
    // File upload
    func uploadImage(endpoint: String, imageData: Data, fileName: String, mimeType: String) -> AnyPublisher<UploadResponse, Error>
    
    // Connectivity
    var isConnected: Bool { get }
    var isConnectedPublisher: AnyPublisher<Bool, Never> { get }
}

class NetworkServiceImpl: NetworkService {
    private let baseURL: URL
    private let session: Session
    private let connectivityMonitor = NetworkMonitor.shared
    
    init() {
        // Configure base URL based on environment
        #if DEBUG
        self.baseURL = URL(string: EnvironmentConfig.apiBaseUrlDevelopment)!
        #else
        self.baseURL = URL(string: EnvironmentConfig.apiBaseUrlProduction)!
        #endif
        
        // Configure Alamofire session with interceptors and custom configuration
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30.0
        configuration.timeoutIntervalForResource = 60.0
        
        let interceptor = AuthRequestInterceptor()
        let eventMonitors: [EventMonitor] = [NetworkLogger()]
        
        self.session = Session(
            configuration: configuration,
            interceptor: interceptor,
            eventMonitors: eventMonitors
        )
        
        // Start monitoring connectivity
        connectivityMonitor.startMonitoring()
    }
    
    var isConnected: Bool {
        return connectivityMonitor.isConnected
    }
    
    var isConnectedPublisher: AnyPublisher<Bool, Never> {
        return connectivityMonitor.isConnectedPublisher
    }
    
    func get<T: Decodable>(endpoint: String, parameters: [String: Any]? = nil) -> AnyPublisher<T, Error> {
        guard isConnected else {
            return Fail(error: NetworkError.noInternetConnection)
                .eraseToAnyPublisher()
        }
        
        let url = baseURL.appendingPathComponent(endpoint)
        
        return session.request(url, method: .get, parameters: parameters)
            .validate()
            .publishDecodable(type: NetworkResponse<T>.self)
            .tryMap { response in
                switch response.result {
                case .success(let networkResponse):
                    if networkResponse.success {
                        if let data = networkResponse.data {
                            return data
                        } else {
                            throw NetworkError.emptyResponse
                        }
                    } else if let message = networkResponse.message {
                        throw NetworkError.apiError(message)
                    } else {
                        throw NetworkError.unknown
                    }
                case .failure(let error):
                    throw self.handleAFError(error)
                }
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    func post<T: Decodable, U: Encodable>(endpoint: String, body: U) -> AnyPublisher<T, Error> {
        guard isConnected else {
            return Fail(error: NetworkError.noInternetConnection)
                .eraseToAnyPublisher()
        }
        
        let url = baseURL.appendingPathComponent(endpoint)
        
        return session.request(url, method: .post, parameters: body, encoder: JSONParameterEncoder.default)
            .validate()
            .publishDecodable(type: NetworkResponse<T>.self)
            .tryMap { response in
                switch response.result {
                case .success(let networkResponse):
                    if networkResponse.success {
                        if let data = networkResponse.data {
                            return data
                        } else {
                            throw NetworkError.emptyResponse
                        }
                    } else if let message = networkResponse.message {
                        throw NetworkError.apiError(message)
                    } else {
                        throw NetworkError.unknown
                    }
                case .failure(let error):
                    throw self.handleAFError(error)
                }
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    func put<T: Decodable, U: Encodable>(endpoint: String, body: U) -> AnyPublisher<T, Error> {
        guard isConnected else {
            return Fail(error: NetworkError.noInternetConnection)
                .eraseToAnyPublisher()
        }
        
        let url = baseURL.appendingPathComponent(endpoint)
        
        return session.request(url, method: .put, parameters: body, encoder: JSONParameterEncoder.default)
            .validate()
            .publishDecodable(type: NetworkResponse<T>.self)
            .tryMap { response in
                switch response.result {
                case .success(let networkResponse):
                    if networkResponse.success {
                        if let data = networkResponse.data {
                            return data
                        } else {
                            throw NetworkError.emptyResponse
                        }
                    } else if let message = networkResponse.message {
                        throw NetworkError.apiError(message)
                    } else {
                        throw NetworkError.unknown
                    }
                case .failure(let error):
                    throw self.handleAFError(error)
                }
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    func delete<T: Decodable>(endpoint: String) -> AnyPublisher<T, Error> {
        guard isConnected else {
            return Fail(error: NetworkError.noInternetConnection)
                .eraseToAnyPublisher()
        }
        
        let url = baseURL.appendingPathComponent(endpoint)
        
        return session.request(url, method: .delete)
            .validate()
            .publishDecodable(type: NetworkResponse<T>.self)
            .tryMap { response in
                switch response.result {
                case .success(let networkResponse):
                    if networkResponse.success {
                        if let data = networkResponse.data {
                            return data
                        } else {
                            throw NetworkError.emptyResponse
                        }
                    } else if let message = networkResponse.message {
                        throw NetworkError.apiError(message)
                    } else {
                        throw NetworkError.unknown
                    }
                case .failure(let error):
                    throw self.handleAFError(error)
                }
            }
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
    
    func uploadImage(endpoint: String, imageData: Data, fileName: String, mimeType: String) -> AnyPublisher<UploadResponse, Error> {
        guard isConnected else {
            return Fail(error: NetworkError.noInternetConnection)
                .eraseToAnyPublisher()
        }
        
        let url = baseURL.appendingPathComponent(endpoint)
        
        return Future<UploadResponse, Error> { promise in
            self.session.upload(
                multipartFormData: { multipartFormData in
                    multipartFormData.append(imageData, withName: "image", fileName: fileName, mimeType: mimeType)
                },
                to: url,
                method: .post
            )
            .uploadProgress { progress in
                print("Upload Progress: \(progress.fractionCompleted)")
            }
            .responseDecodable(of: NetworkResponse<UploadResponse>.self) { response in
                switch response.result {
                case .success(let networkResponse):
                    if networkResponse.success, let data = networkResponse.data {
                        promise(.success(data))
                    } else if let message = networkResponse.message {
                        promise(.failure(NetworkError.apiError(message)))
                    } else {
                        promise(.failure(NetworkError.unknown))
                    }
                case .failure(let error):
                    promise(.failure(self.handleAFError(error)))
                }
            }
        }
        .receive(on: DispatchQueue.main)
        .eraseToAnyPublisher()
    }
    
    private func handleAFError(_ error: AFError) -> Error {
        if let underlyingError = error.underlyingError {
            let nserror = underlyingError as NSError
            if nserror.domain == NSURLErrorDomain {
                switch nserror.code {
                case NSURLErrorNotConnectedToInternet:
                    return NetworkError.noInternetConnection
                case NSURLErrorTimedOut:
                    return NetworkError.timeout
                case NSURLErrorCannotFindHost:
                    return NetworkError.hostNotFound
                default:
                    return NetworkError.networkError(nserror.localizedDescription)
                }
            }
        }
        
        switch error {
        case .responseValidationFailed(let reason):
            switch reason {
            case .unacceptableStatusCode(let code):
                switch code {
                case 401:
                    return NetworkError.unauthorized
                case 403:
                    return NetworkError.forbidden
                case 404:
                    return NetworkError.notFound
                case 500...599:
                    return NetworkError.serverError(code)
                default:
                    return NetworkError.statusCode(code)
                }
            default:
                return NetworkError.validationFailed
            }
        case .responseSerializationFailed:
            return NetworkError.parsingFailed
        default:
            return NetworkError.networkError(error.localizedDescription)
        }
    }
}

// MARK: - Response Models

struct NetworkResponse<T: Decodable>: Decodable {
    let success: Bool
    let message: String?
    let data: T?
    let meta: Meta?
    
    struct Meta: Decodable {
        let page: Int?
        let perPage: Int?
        let total: Int?
    }
}

struct UploadResponse: Decodable {
    let url: String
    let id: String
}

// MARK: - Errors

enum NetworkError: Error, LocalizedError {
    case noInternetConnection
    case timeout
    case hostNotFound
    case networkError(String)
    case unauthorized
    case forbidden
    case notFound
    case serverError(Int)
    case statusCode(Int)
    case validationFailed
    case parsingFailed
    case emptyResponse
    case apiError(String)
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .noInternetConnection:
            return "No internet connection available"
        case .timeout:
            return "Request timed out"
        case .hostNotFound:
            return "The server could not be found"
        case .networkError(let message):
            return "Network error: \(message)"
        case .unauthorized:
            return "You are not authorized to perform this action"
        case .forbidden:
            return "You don't have permission to access this resource"
        case .notFound:
            return "The requested resource could not be found"
        case .serverError(let code):
            return "Server error occurred (\(code))"
        case .statusCode(let code):
            return "Unexpected status code: \(code)"
        case .validationFailed:
            return "Response validation failed"
        case .parsingFailed:
            return "Failed to parse the response"
        case .emptyResponse:
            return "The server returned an empty response"
        case .apiError(let message):
            return message
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

// MARK: - Auth Interceptor

class AuthRequestInterceptor: RequestInterceptor {
    private let authService: AuthService?
    
    init(authService: AuthService? = nil) {
        // Use dependency injection if provided, otherwise will be resolved later
        self.authService = authService
    }
    
    func adapt(_ urlRequest: URLRequest, for session: Session, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        var adaptedRequest = urlRequest
        
        // Either use the injected auth service or get it from the dependency container
        let resolvedAuthService = authService ?? DependencyContainer.shared.resolve(AuthService.self)
        
        // Add authorization header if we have a token
        if let token = resolvedAuthService?.getAccessToken(), !token.isEmpty {
            adaptedRequest.headers.add(.authorization(bearerToken: token))
        }
        
        // Add common headers
        adaptedRequest.headers.add(.accept("application/json"))
        adaptedRequest.headers.add(.contentType("application/json"))
        adaptedRequest.headers.add(name: "X-App-Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "unknown")
        
        completion(.success(adaptedRequest))
    }
    
    func retry(_ request: Request, for session: Session, dueTo error: Error, completion: @escaping (RetryResult) -> Void) {
        // Check if the error is due to an expired token (401 Unauthorized)
        guard let response = request.task?.response as? HTTPURLResponse, response.statusCode == 401 else {
            // Not a token expiration issue, don't retry
            completion(.doNotRetry)
            return
        }
        
        // Either use the injected auth service or get it from the dependency container
        let resolvedAuthService = authService ?? DependencyContainer.shared.resolve(AuthService.self)
        
        // Try to refresh the token
        resolvedAuthService?.refreshTokenIfNeeded()
            .sink(
                receiveCompletion: { result in
                    switch result {
                    case .finished:
                        // Token refresh was successful, retry the request
                        completion(.retry)
                    case .failure:
                        // Token refresh failed, don't retry
                        completion(.doNotRetry)
                        
                        // Notify about authentication failure
                        NotificationCenter.default.post(name: .authenticationFailed, object: nil)
                    }
                },
                receiveValue: { _ in }
            )
            .store(in: &NetworkCancellables.shared.cancellables)
    }
}

// Storage for network-related cancellables
class NetworkCancellables {
    static let shared = NetworkCancellables()
    var cancellables = Set<AnyCancellable>()
}

// MARK: - Network Monitoring

class NetworkMonitor {
    static let shared = NetworkMonitor()
    
    private let monitor = NWPathMonitor()
    private let queue = DispatchQueue(label: "NetworkMonitor")
    private let connectionStateSubject = CurrentValueSubject<Bool, Never>(false)
    
    var isConnected: Bool {
        return connectionStateSubject.value
    }
    
    var isConnectedPublisher: AnyPublisher<Bool, Never> {
        return connectionStateSubject.eraseToAnyPublisher()
    }
    
    private init() {
        monitor.pathUpdateHandler = { [weak self] path in
            self?.connectionStateSubject.send(path.status == .satisfied)
            
            // Log the network interface type for debugging
            let interfaces = path.availableInterfaces.map { $0.type }
            log.debug("Network interfaces: \(interfaces)")
        }
    }
    
    func startMonitoring() {
        monitor.start(queue: queue)
    }
    
    func stopMonitoring() {
        monitor.cancel()
    }
}

// MARK: - Network Logger

class NetworkLogger: EventMonitor {
    func requestDidFinish(_ request: Request) {
        let logLevel: SwiftyBeaver.Level = request.isRejected ? .warning : .debug
        
        log.custom(level: logLevel, message: """
        REQUEST: \(request.description)
        URL: \(request.request?.url?.absoluteString ?? "")
        METHOD: \(request.request?.httpMethod ?? "")
        HEADERS: \(request.request?.allHTTPHeaderFields ?? [:])
        """)
    }
    
    func request<Value>(_ request: DataRequest, didParseResponse response: DataResponse<Value, AFError>) {
        let logLevel: SwiftyBeaver.Level
        
        switch response.result {
        case .success:
            logLevel = .debug
        case .failure:
            logLevel = .warning
        }
        
        log.custom(level: logLevel, message: """
        RESPONSE: \(response.debugDescription)
        URL: \(response.request?.url?.absoluteString ?? "")
        STATUS: \(response.response?.statusCode ?? 0)
        DATA: \(String(data: response.data ?? Data(), encoding: .utf8) ?? "")
        """)
    }
}

// MARK: - Notification Names

extension Notification.Name {
    static let authenticationFailed = Notification.Name("com.ag-trial-planner.authenticationFailed")
}