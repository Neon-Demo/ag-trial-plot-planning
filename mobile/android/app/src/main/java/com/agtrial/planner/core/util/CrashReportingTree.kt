package com.agtrial.planner.core.util

import android.util.Log
import timber.log.Timber

/**
 * A custom Timber tree for production that only logs important errors
 * and would integrate with a crash reporting service like Firebase Crashlytics.
 */
class CrashReportingTree : Timber.Tree() {
    
    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        if (priority == Log.VERBOSE || priority == Log.DEBUG || priority == Log.INFO) {
            return
        }
        
        // In a real application, we would report to a crash reporting service here
        // For example:
        // FirebaseCrashlytics.getInstance().log(message)
        
        if (t != null && (priority == Log.ERROR || priority == Log.ASSERT)) {
            // FirebaseCrashlytics.getInstance().recordException(t)
            
            // For now, just log to Android's built-in logger
            Log.e(tag, message, t)
        }
    }
}