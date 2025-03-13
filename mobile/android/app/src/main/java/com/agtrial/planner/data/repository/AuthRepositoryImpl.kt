package com.agtrial.planner.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.agtrial.planner.data.remote.api.AuthApi
import com.agtrial.planner.data.remote.dto.LoginRequest
import com.agtrial.planner.data.remote.dto.RefreshTokenRequest
import com.agtrial.planner.data.remote.dto.SocialLoginRequest
import com.agtrial.planner.domain.model.AuthUser
import com.agtrial.planner.domain.model.OrganizationRole
import com.agtrial.planner.domain.model.UserOrganization
import com.agtrial.planner.domain.model.UserRole
import com.agtrial.planner.domain.repository.AuthRepository
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import timber.log.Timber
import java.util.Date
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val authApi: AuthApi,
    private val moshi: Moshi
) : AuthRepository {
    
    private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_prefs")
    
    // DataStore keys
    private val accessTokenKey = stringPreferencesKey("access_token")
    private val refreshTokenKey = stringPreferencesKey("refresh_token")
    private val userKey = stringPreferencesKey("user")
    private val organizationKey = stringPreferencesKey("current_organization")
    
    // JSON adapters
    private val userAdapter: JsonAdapter<AuthUser> = moshi.adapter(AuthUser::class.java)
    private val organizationAdapter: JsonAdapter<UserOrganization> = moshi.adapter(UserOrganization::class.java)
    
    // MARK: - Session management
    
    override suspend fun hasValidSession(): Boolean {
        val token = getAccessToken()
        return !token.isNullOrEmpty() && !isTokenExpired(token)
    }
    
    override fun getCurrentUser(): Flow<AuthUser?> {
        return context.dataStore.data.map { preferences ->
            val userJson = preferences[userKey]
            if (userJson != null) {
                try {
                    userAdapter.fromJson(userJson)
                } catch (e: Exception) {
                    Timber.e(e, "Error parsing user JSON")
                    null
                }
            } else {
                null
            }
        }
    }
    
    override suspend fun refreshTokenIfNeeded(): Result<Boolean> {
        val token = getAccessToken()
        val refreshToken = getRefreshToken()
        
        if (token.isNullOrEmpty() || !isTokenExpired(token) || refreshToken.isNullOrEmpty()) {
            return Result.success(false)
        }
        
        return try {
            val request = RefreshTokenRequest(refreshToken)
            val response = authApi.refreshToken(request)
            
            if (response.isSuccessful && response.body() != null) {
                val tokenResponse = response.body()!!
                saveTokens(tokenResponse.accessToken, tokenResponse.refreshToken)
                Result.success(true)
            } else {
                Result.failure(Exception("Failed to refresh token: ${response.message()}"))
            }
        } catch (e: Exception) {
            Timber.e(e, "Error refreshing token")
            Result.failure(e)
        }
    }
    
    override suspend fun logout(): Result<Unit> {
        return try {
            // Clear all saved auth data
            context.dataStore.edit { preferences ->
                preferences.remove(accessTokenKey)
                preferences.remove(refreshTokenKey)
                preferences.remove(userKey)
                preferences.remove(organizationKey)
            }
            Result.success(Unit)
        } catch (e: Exception) {
            Timber.e(e, "Error during logout")
            Result.failure(e)
        }
    }
    
    // MARK: - Authentication methods
    
    override suspend fun loginWithEmailPassword(email: String, password: String): Result<AuthUser> {
        return try {
            val request = LoginRequest(email, password)
            val response = authApi.login(request)
            
            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!
                val user = loginResponse.user
                
                // Save tokens and user
                saveTokens(loginResponse.accessToken, loginResponse.refreshToken)
                saveUser(user)
                
                // If user has only one organization, select it automatically
                if (user.organizations?.size == 1) {
                    saveOrganization(user.organizations.first())
                }
                
                Result.success(user)
            } else {
                Result.failure(Exception("Login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Timber.e(e, "Error during email/password login")
            Result.failure(e)
        }
    }
    
    override suspend fun loginWithGoogle(idToken: String): Result<AuthUser> {
        return try {
            val request = SocialLoginRequest(idToken)
            val response = authApi.googleLogin(request)
            
            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!
                val user = loginResponse.user
                
                // Save tokens and user
                saveTokens(loginResponse.accessToken, loginResponse.refreshToken)
                saveUser(user)
                
                // If user has only one organization, select it automatically
                if (user.organizations?.size == 1) {
                    saveOrganization(user.organizations.first())
                }
                
                Result.success(user)
            } else {
                Result.failure(Exception("Google login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Timber.e(e, "Error during Google login")
            Result.failure(e)
        }
    }
    
    override suspend fun loginWithMicrosoft(idToken: String): Result<AuthUser> {
        return try {
            val request = SocialLoginRequest(idToken)
            val response = authApi.microsoftLogin(request)
            
            if (response.isSuccessful && response.body() != null) {
                val loginResponse = response.body()!!
                val user = loginResponse.user
                
                // Save tokens and user
                saveTokens(loginResponse.accessToken, loginResponse.refreshToken)
                saveUser(user)
                
                // If user has only one organization, select it automatically
                if (user.organizations?.size == 1) {
                    saveOrganization(user.organizations.first())
                }
                
                Result.success(user)
            } else {
                Result.failure(Exception("Microsoft login failed: ${response.message()}"))
            }
        } catch (e: Exception) {
            Timber.e(e, "Error during Microsoft login")
            Result.failure(e)
        }
    }
    
    override suspend fun loginWithDemo(role: UserRole): Result<AuthUser> {
        return try {
            // Create a demo user
            val demoUser = AuthUser.createDemoUser(role)
            
            // Save demo user
            saveUser(demoUser)
            
            // Create and save a demo organization
            demoUser.organizations?.firstOrNull()?.let { 
                saveOrganization(it)
            }
            
            // Create a demo token (will expire in 24 hours)
            val expiry = Date().time + 86400000L // 24 hours in milliseconds
            val demoToken = "demo_token_${role.name.lowercase()}_$expiry"
            saveTokens(demoToken, "demo_refresh_token")
            
            Result.success(demoUser)
        } catch (e: Exception) {
            Timber.e(e, "Error during demo login")
            Result.failure(e)
        }
    }
    
    // MARK: - Organization selection
    
    override suspend fun selectOrganization(id: String): Result<Boolean> {
        try {
            val user = getCurrentUser().first() ?: 
                return Result.failure(Exception("User is not authenticated"))
            
            val organization = user.organizations?.find { it.id == id } ?:
                return Result.failure(Exception("Organization not found"))
            
            saveOrganization(organization)
            return Result.success(true)
        } catch (e: Exception) {
            Timber.e(e, "Error selecting organization")
            return Result.failure(e)
        }
    }
    
    override fun getCurrentOrganization(): Flow<UserOrganization?> {
        return context.dataStore.data.map { preferences ->
            val orgJson = preferences[organizationKey]
            if (orgJson != null) {
                try {
                    organizationAdapter.fromJson(orgJson)
                } catch (e: Exception) {
                    Timber.e(e, "Error parsing organization JSON")
                    null
                }
            } else {
                null
            }
        }
    }
    
    // MARK: - Token management
    
    override suspend fun getAccessToken(): String? {
        return context.dataStore.data.first()[accessTokenKey]
    }
    
    // MARK: - Offline support
    
    override suspend fun canAuthenticateOffline(): Boolean {
        return getCurrentUser().first() != null
    }
    
    override suspend fun authenticateOffline(): Result<AuthUser> {
        val user = getCurrentUser().first() ?: 
            return Result.failure(Exception("No user data available for offline authentication"))
        
        return Result.success(user)
    }
    
    // MARK: - Private helpers
    
    private suspend fun getRefreshToken(): String? {
        return context.dataStore.data.first()[refreshTokenKey]
    }
    
    private suspend fun saveTokens(accessToken: String, refreshToken: String) {
        context.dataStore.edit { preferences ->
            preferences[accessTokenKey] = accessToken
            preferences[refreshTokenKey] = refreshToken
        }
    }
    
    private suspend fun saveUser(user: AuthUser) {
        val userJson = userAdapter.toJson(user)
        context.dataStore.edit { preferences ->
            preferences[userKey] = userJson
        }
    }
    
    private suspend fun saveOrganization(organization: UserOrganization) {
        val orgJson = organizationAdapter.toJson(organization)
        context.dataStore.edit { preferences ->
            preferences[organizationKey] = orgJson
        }
    }
    
    private fun isTokenExpired(token: String): Boolean {
        // JWT token expiration check
        if (token.contains(".") && token.split(".").size == 3) {
            try {
                val parts = token.split(".")
                val payload = android.util.Base64.decode(
                    parts[1].replace("-", "+").replace("_", "/"),
                    android.util.Base64.DEFAULT
                )
                val payloadJson = String(payload)
                val payloadMap = moshi.adapter(Map::class.java).fromJson(payloadJson)
                val exp = (payloadMap?.get("exp") as? Double)?.toLong() ?: 0
                return System.currentTimeMillis() / 1000 > exp
            } catch (e: Exception) {
                Timber.e(e, "Error parsing JWT token")
                return true
            }
        }
        
        // Demo token expiration check
        if (token.startsWith("demo_token_")) {
            val parts = token.split("_")
            if (parts.size == 4) {
                try {
                    val expiryTimestamp = parts[3].toLong()
                    return System.currentTimeMillis() > expiryTimestamp
                } catch (e: Exception) {
                    return true
                }
            }
            return true
        }
        
        // Default to expired if we can't determine
        return true
    }
}