package com.agtrial.planner.presentation.dashboard

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.agtrial.planner.presentation.components.DashboardCard
import com.agtrial.planner.presentation.components.NetworkWarningBanner

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onLogout: () -> Unit,
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("AG Trial Planner") },
                actions = {
                    IconButton(onClick = onLogout) {
                        Icon(
                            imageVector = Icons.Default.ExitToApp,
                            contentDescription = "Logout"
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            // User info section
            uiState.user?.let { user ->
                Text(
                    text = "Welcome, ${user.displayName}",
                    style = MaterialTheme.typography.headlineSmall
                )
                
                Text(
                    text = "Role: ${user.role.displayName}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                user.organizations?.firstOrNull()?.let { org ->
                    Text(
                        text = "Organization: ${org.name}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                }
            }
            
            // Offline warning if needed
            if (!uiState.isOnline) {
                Spacer(modifier = Modifier.height(16.dp))
                NetworkWarningBanner()
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Quick stats or cards
            Text(
                text = "Your Dashboard",
                style = MaterialTheme.typography.titleLarge
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Dashboard cards - will vary based on user role
            DashboardCard(
                title = "Active Trials",
                count = uiState.activeTrialCount,
                description = "View and manage your active agricultural trials",
                onClick = { /* Navigate to trials */ }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            DashboardCard(
                title = "Scheduled Observations",
                count = uiState.pendingObservationCount,
                description = "Upcoming observations that need to be collected",
                onClick = { /* Navigate to observations */ }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            DashboardCard(
                title = "Field Navigation",
                description = "Navigate to plots for data collection",
                actionLabel = "Start Navigation",
                onClick = { /* Navigate to field navigation */ }
            )
            
            // More cards would be added here based on user role
            if (uiState.user?.role?.name == "ADMIN" || uiState.user?.role?.name == "RESEARCHER") {
                Spacer(modifier = Modifier.height(16.dp))
                
                DashboardCard(
                    title = "Create New Trial",
                    description = "Set up a new agricultural trial",
                    actionLabel = "Create Trial",
                    onClick = { /* Navigate to create trial */ }
                )
            }
            
            if (uiState.user?.role?.name == "ADMIN") {
                Spacer(modifier = Modifier.height(16.dp))
                
                DashboardCard(
                    title = "User Management",
                    count = uiState.userCount,
                    description = "Manage users and permissions",
                    onClick = { /* Navigate to user management */ }
                )
            }
        }
    }
}