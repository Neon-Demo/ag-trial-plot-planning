package com.agtrial.planner.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.agtrial.planner.domain.model.AuthUser
import com.agtrial.planner.domain.repository.AuthRepository
import com.agtrial.planner.domain.util.NetworkMonitor
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val networkMonitor: NetworkMonitor
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState.asStateFlow()
    
    init {
        // Load user info
        viewModelScope.launch {
            authRepository.getCurrentUser().collect { user ->
                _uiState.update { it.copy(user = user) }
            }
        }
        
        // Monitor network state
        viewModelScope.launch {
            networkMonitor.isOnline.collect { isOnline ->
                _uiState.update { it.copy(isOnline = isOnline) }
            }
        }
        
        // In a real app, we would load these from repositories
        loadMockData()
    }
    
    private fun loadMockData() {
        // Mock data for demonstration purposes
        _uiState.update {
            it.copy(
                activeTrialCount = 3,
                pendingObservationCount = 12,
                userCount = 15
            )
        }
    }
}

data class DashboardUiState(
    val user: AuthUser? = null,
    val isOnline: Boolean = true,
    val activeTrialCount: Int = 0,
    val pendingObservationCount: Int = 0,
    val userCount: Int = 0
)