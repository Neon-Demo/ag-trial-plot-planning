package com.agtrial.planner.domain.repository

import com.agtrial.planner.domain.model.AuthUser
import com.agtrial.planner.domain.model.UserOrganization
import com.agtrial.planner.domain.model.UserRole
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for authentication-related operations.
 */
interface AuthRepository {
    // Session management
    suspend fun hasValidSession(): Boolean
    fun getCurrentUser(): Flow<AuthUser?>
    suspend fun refreshTokenIfNeeded(): Result<Boolean>
    suspend fun logout(): Result<Unit>
    
    // Authentication methods
    suspend fun loginWithEmailPassword(email: String, password: String): Result<AuthUser>
    suspend fun loginWithGoogle(idToken: String): Result<AuthUser>
    suspend fun loginWithMicrosoft(idToken: String): Result<AuthUser>
    suspend fun loginWithDemo(role: UserRole): Result<AuthUser>
    
    // Organization selection
    suspend fun selectOrganization(id: String): Result<Boolean>
    fun getCurrentOrganization(): Flow<UserOrganization?>
    
    // Token management
    suspend fun getAccessToken(): String?
    
    // Offline support
    suspend fun canAuthenticateOffline(): Boolean
    suspend fun authenticateOffline(): Result<AuthUser>
}