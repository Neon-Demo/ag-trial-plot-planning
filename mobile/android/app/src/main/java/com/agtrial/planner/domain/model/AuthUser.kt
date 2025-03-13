package com.agtrial.planner.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Domain model representing an authenticated user.
 */
@Parcelize
data class AuthUser(
    val id: String,
    val email: String,
    val name: String?,
    val role: UserRole,
    val organizations: List<UserOrganization>?,
    val profileImageUrl: String? = null,
    val isDemo: Boolean = false
) : Parcelable {
    
    // Computed properties
    val displayName: String
        get() = name ?: email.substringBefore("@")
    
    val initials: String
        get() {
            if (name.isNullOrEmpty()) {
                return email.substring(0, 1).uppercase()
            }
            
            val parts = name.split(" ")
            return if (parts.size > 1) {
                val first = parts.first().firstOrNull()?.toString() ?: ""
                val last = parts.last().firstOrNull()?.toString() ?: ""
                (first + last).uppercase()
            } else {
                parts.first().substring(0, 1).uppercase()
            }
        }
    
    companion object {
        // Create a demo user for testing or offline demo mode
        fun createDemoUser(role: UserRole = UserRole.RESEARCHER): AuthUser {
            val demoOrg = UserOrganization(
                id = "demo-org",
                name = "Demo Organization",
                role = OrganizationRole.MEMBER
            )
            
            val username = when (role) {
                UserRole.ADMIN -> "Admin"
                UserRole.RESEARCHER -> "Researcher"
                UserRole.FIELD_TECHNICIAN -> "Field Technician"
            }
            
            return AuthUser(
                id = "demo-user-${role.name.lowercase()}",
                email = "${role.name.lowercase()}@example.com",
                name = "Demo $username",
                role = role,
                organizations = listOf(demoOrg),
                profileImageUrl = null,
                isDemo = true
            )
        }
    }
}

/**
 * Possible user roles in the system.
 */
enum class UserRole {
    ADMIN,
    RESEARCHER,
    FIELD_TECHNICIAN;
    
    val displayName: String
        get() = when (this) {
            ADMIN -> "Administrator"
            RESEARCHER -> "Researcher"
            FIELD_TECHNICIAN -> "Field Technician"
        }
    
    val permissions: List<Permission>
        get() = when (this) {
            ADMIN -> Permission.values().toList()
            RESEARCHER -> listOf(
                Permission.VIEW_TRIALS,
                Permission.CREATE_TRIALS,
                Permission.EDIT_TRIALS,
                Permission.VIEW_OBSERVATIONS,
                Permission.CREATE_OBSERVATIONS,
                Permission.EDIT_OBSERVATIONS,
                Permission.USE_NAVIGATION
            )
            FIELD_TECHNICIAN -> listOf(
                Permission.VIEW_TRIALS,
                Permission.VIEW_OBSERVATIONS,
                Permission.CREATE_OBSERVATIONS,
                Permission.USE_NAVIGATION
            )
        }
    
    fun hasPermission(permission: Permission): Boolean {
        return permission in permissions
    }
}

/**
 * Specific permissions for actions within the app.
 */
enum class Permission {
    VIEW_TRIALS,
    CREATE_TRIALS,
    EDIT_TRIALS,
    DELETE_TRIALS,
    
    VIEW_OBSERVATIONS,
    CREATE_OBSERVATIONS,
    EDIT_OBSERVATIONS,
    
    MANAGE_USERS,
    MANAGE_ORGANIZATIONS,
    
    USE_NAVIGATION,
    MANAGE_SETTINGS
}

/**
 * Represents a user's membership in an organization.
 */
@Parcelize
data class UserOrganization(
    val id: String,
    val name: String,
    val role: OrganizationRole
) : Parcelable

/**
 * Possible roles within an organization.
 */
enum class OrganizationRole {
    ADMIN,
    MEMBER
}