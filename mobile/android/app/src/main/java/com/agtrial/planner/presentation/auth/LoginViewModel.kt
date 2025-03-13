package com.agtrial.planner.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agtrial.planner.domain.model.AuthUser
import com.agtrial.planner.domain.model.UserOrganization
import com.agtrial.planner.domain.model.UserRole
import com.agtrial.planner.domain.repository.AuthRepository
import com.agtrial.planner.domain.util.NetworkMonitor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val networkMonitor: NetworkMonitor
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()
    
    init {
        viewModelScope.launch {
            networkMonitor.isOnline.collect { isOnline ->
                _uiState.update { it.copy(isOffline = !isOnline) }
            }
        }
        
        checkOfflineAuth()
    }
    
    private fun checkOfflineAuth() {
        viewModelScope.launch {
            val canAuthOffline = authRepository.canAuthenticateOffline()
            _uiState.update { it.copy(canAuthenticateOffline = canAuthOffline) }
        }
    }
    
    fun updateEmail(email: String) {
        _uiState.update { it.copy(email = email) }
    }
    
    fun updatePassword(password: String) {
        _uiState.update { it.copy(password = password) }
    }
    
    fun toggleShowEmail() {
        _uiState.update { it.copy(showEmailLogin = !it.showEmailLogin) }
    }
    
    fun toggleShowDemoOptions() {
        _uiState.update { it.copy(showDemoOptions = !it.showDemoOptions) }
    }
    
    fun updateSelectedDemoRole(role: UserRole) {
        _uiState.update { it.copy(selectedDemoRole = role) }
    }
    
    fun loginWithEmailPassword() {
        val email = _uiState.value.email
        val password = _uiState.value.password
        
        if (email.isBlank() || password.isBlank()) {
            _uiState.update { it.copy(errorMessage = "Please enter both email and password") }
            return
        }
        
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.loginWithEmailPassword(email, password)
            handleLoginResult(result)
        }
    }
    
    fun loginWithGoogle(idToken: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.loginWithGoogle(idToken)
            handleLoginResult(result)
        }
    }
    
    fun loginWithMicrosoft(idToken: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.loginWithMicrosoft(idToken)
            handleLoginResult(result)
        }
    }
    
    fun loginWithDemo() {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.loginWithDemo(_uiState.value.selectedDemoRole)
            handleLoginResult(result)
        }
    }
    
    fun loginOffline() {
        if (!_uiState.value.canAuthenticateOffline) {
            _uiState.update { it.copy(errorMessage = "Offline authentication not available") }
            return
        }
        
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.authenticateOffline()
            handleLoginResult(result)
        }
    }
    
    fun selectOrganization(organizationId: String) {
        _uiState.update { it.copy(isLoading = true, errorMessage = null) }
        
        viewModelScope.launch {
            val result = authRepository.selectOrganization(organizationId)
            
            if (result.isSuccess && result.getOrNull() == true) {
                _uiState.update { it.copy(
                    isLoading = false,
                    orgSelectionRequired = false,
                    isAuthenticated = true
                )}
            } else {
                val error = result.exceptionOrNull()
                _uiState.update { it.copy(
                    isLoading = false,
                    errorMessage = error?.message ?: "Failed to select organization"
                )}
            }
        }
    }
    
    private fun handleLoginResult(result: Result<AuthUser>) {
        result.fold(
            onSuccess = { user ->
                Timber.d("Login successful: ${user.displayName}")
                
                // Check if organization selection is needed
                if (user.organizations != null && user.organizations.size > 1) {
                    _uiState.update { it.copy(
                        isLoading = false,
                        authenticatedUser = user,
                        orgSelectionRequired = true,
                        errorMessage = null
                    )}
                } else {
                    // No org selection needed, authentication is complete
                    _uiState.update { it.copy(
                        isLoading = false,
                        authenticatedUser = user,
                        orgSelectionRequired = false,
                        isAuthenticated = true,
                        errorMessage = null
                    )}
                }
            },
            onFailure = { e ->
                Timber.e(e, "Login failed")
                _uiState.update { it.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Authentication failed"
                )}
            }
        )
    }
}

data class LoginUiState(
    val isLoading: Boolean = false,
    val email: String = "",
    val password: String = "",
    val errorMessage: String? = null,
    val showEmailLogin: Boolean = false,
    val showDemoOptions: Boolean = false,
    val selectedDemoRole: UserRole = UserRole.RESEARCHER,
    val authenticatedUser: AuthUser? = null,
    val orgSelectionRequired: Boolean = false,
    val isAuthenticated: Boolean = false,
    val isOffline: Boolean = false,
    val canAuthenticateOffline: Boolean = false
)