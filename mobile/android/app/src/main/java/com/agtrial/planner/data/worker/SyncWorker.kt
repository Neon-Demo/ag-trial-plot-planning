package com.agtrial.planner.data.worker

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.agtrial.planner.domain.repository.ObservationRepository
import com.agtrial.planner.domain.repository.SyncRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.coroutines.flow.first
import timber.log.Timber

/**
 * Worker that performs background synchronization of offline data.
 * It syncs pending observations and images when network is available.
 */
@HiltWorker
class SyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted workerParams: WorkerParameters,
    private val syncRepository: SyncRepository,
    private val observationRepository: ObservationRepository
) : CoroutineWorker(appContext, workerParams) {
    
    override suspend fun doWork(): Result {
        try {
            Timber.d("Starting background sync")
            
            // Check if we have any pending data that needs to be synced
            val pendingObservations = observationRepository.getPendingSyncObservations().first()
            val pendingCount = pendingObservations.size
            
            if (pendingCount == 0) {
                Timber.d("No pending data to sync")
                return Result.success()
            }
            
            Timber.d("Found $pendingCount observations to sync")
            
            // Perform the actual sync
            val syncResult = syncRepository.syncAllPendingData()
            
            return if (syncResult.isSuccess) {
                Timber.d("Background sync completed successfully")
                Result.success()
            } else {
                val error = syncResult.exceptionOrNull()
                Timber.e(error, "Background sync failed")
                // Retry based on the error type
                if (isRetryableError(error)) {
                    Result.retry()
                } else {
                    Result.failure()
                }
            }
        } catch (e: Exception) {
            Timber.e(e, "Unexpected error during background sync")
            return Result.failure()
        }
    }
    
    private fun isRetryableError(error: Throwable?): Boolean {
        // Network errors, timeouts, and server errors are retryable
        // Authentication errors, client errors are not
        return error is java.io.IOException || 
                error is java.net.SocketTimeoutException ||
                error?.message?.contains("5") == true // HTTP 5xx errors
    }
}