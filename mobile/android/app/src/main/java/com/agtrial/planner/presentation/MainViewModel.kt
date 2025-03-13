package com.agtrial.planner.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agtrial.planner.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import timber.log.Timber
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {
    
    private val _navigationEvent = MutableStateFlow<NavigationEvent?>(null)
    
    val appState: StateFlow<AppState> = combine(
        authRepository.getCurrentUser(),
        _navigationEvent
    ) { currentUser, navigationEvent ->
        AppState(
            isAuthenticated = currentUser != null,
            navigationEvent = navigationEvent
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = AppState()
    )
    
    init {
        // Check if we need to refresh the token
        viewModelScope.launch {
            try {
                authRepository.refreshTokenIfNeeded()
            } catch (e: Exception) {
                Timber.e(e, "Error refreshing token")
                // If token refresh fails and we're supposed to be authenticated,
                // we should probably log the user out
                if (appState.value.isAuthenticated) {
                    logout()
                }
            }
        }
    }
    
    fun onLoginSuccess() {
        _navigationEvent.update { NavigationEvent.NavigateToDashboard }
    }
    
    fun logout() {
        viewModelScope.launch {
            try {
                authRepository.logout()
                _navigationEvent.update { NavigationEvent.NavigateToLogin }
            } catch (e: Exception) {
                Timber.e(e, "Error during logout")
                // Force navigation to login even if logout fails
                _navigationEvent.update { NavigationEvent.NavigateToLogin }
            }
        }
    }
    
    fun clearNavigationEvent() {
        _navigationEvent.update { null }
    }
}

data class AppState(
    val isAuthenticated: Boolean = false,
    val navigationEvent: NavigationEvent? = null
)

sealed class NavigationEvent {
    object NavigateToLogin : NavigationEvent()
    object NavigateToDashboard : NavigationEvent()
}