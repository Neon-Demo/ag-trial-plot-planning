package com.agtrial.planner.presentation.util

import android.content.Context
import android.content.res.Configuration
import android.os.PowerManager
import android.view.WindowManager
import androidx.activity.ComponentActivity
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages field mode settings for the app, which optimizes the UI and device
 * settings for outdoor field use (brightness, touch sensitivity, etc.)
 */
@Singleton
class FieldModeManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "field_mode_prefs")
    
    // DataStore keys
    private val fieldModeEnabledKey = booleanPreferencesKey("field_mode_enabled")
    private val highContrastModeKey = booleanPreferencesKey("high_contrast_mode")
    private val largeTouchTargetsKey = booleanPreferencesKey("large_touch_targets")
    private val preventScreenTimeoutKey = booleanPreferencesKey("prevent_screen_timeout")
    
    // PowerManager for wake lock
    private val powerManager = context.getSystemService(Context.POWER_SERVICE) as PowerManager
    private var wakeLock: PowerManager.WakeLock? = null
    
    // Field mode state
    val isFieldModeEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[fieldModeEnabledKey] ?: false
    }
    
    val isHighContrastModeEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[highContrastModeKey] ?: false
    }
    
    val areLargeTouchTargetsEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[largeTouchTargetsKey] ?: false
    }
    
    val isPreventScreenTimeoutEnabled: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[preventScreenTimeoutKey] ?: false
    }
    
    /**
     * Apply field mode settings to an activity
     */
    suspend fun applyFieldModeToActivity(activity: ComponentActivity) {
        // Apply settings based on current preferences
        val preventTimeout = context.dataStore.data.map { 
            it[preventScreenTimeoutKey] ?: false 
        }.map { enabled ->
            if (enabled) {
                // Keep screen on
                activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                
                // Acquire wake lock if needed
                if (wakeLock == null || wakeLock?.isHeld != true) {
                    wakeLock = powerManager.newWakeLock(
                        PowerManager.PARTIAL_WAKE_LOCK,
                        "AgTrialPlanner:FieldModeWakeLock"
                    ).apply {
                        acquire(10*60*1000L /*10 minutes*/)
                    }
                }
            } else {
                // Remove keep screen on flag
                activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                
                // Release wake lock if held
                if (wakeLock?.isHeld == true) {
                    wakeLock?.release()
                }
            }
        }
        
        // Apply high contrast mode
        val highContrast = context.dataStore.data.map {
            it[highContrastModeKey] ?: false
        }.map { enabled ->
            // In a real app, we'd apply a custom theme or settings here
            // For now, this is just a placeholder
        }
    }
    
    /**
     * Set field mode enabled/disabled
     */
    suspend fun setFieldModeEnabled(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[fieldModeEnabledKey] = enabled
        }
    }
    
    /**
     * Set high contrast mode enabled/disabled
     */
    suspend fun setHighContrastMode(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[highContrastModeKey] = enabled
        }
    }
    
    /**
     * Set large touch targets enabled/disabled
     */
    suspend fun setLargeTouchTargets(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[largeTouchTargetsKey] = enabled
        }
    }
    
    /**
     * Set prevent screen timeout enabled/disabled
     */
    suspend fun setPreventScreenTimeout(enabled: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[preventScreenTimeoutKey] = enabled
        }
    }
    
    /**
     * Check if the device is currently in a dark environment
     */
    fun isInDarkEnvironment(activity: ComponentActivity): Boolean {
        val currentNightMode = activity.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        
        // In a real app, we might also use light sensor data to determine if
        // we're in direct sunlight or a dark environment
        return currentNightMode == Configuration.UI_MODE_NIGHT_YES
    }
    
    /**
     * Clean up resources when no longer needed
     */
    fun cleanup() {
        if (wakeLock?.isHeld == true) {
            wakeLock?.release()
        }
    }
}