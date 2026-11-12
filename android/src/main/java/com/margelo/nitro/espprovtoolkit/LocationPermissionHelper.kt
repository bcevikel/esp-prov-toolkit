package com.margelo.nitro.espprovtoolkit

import android.content.Context
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.core.Promise
import android.os.Handler
import android.os.Looper

typealias LocationStatusCallback = (level: PTLocationAccess) -> Promise<Boolean>

class LocationPermissionHelper(val context: ReactApplicationContext) {

    private var cbCount: Int = 0
    private val callbacks: MutableMap<Int, LocationStatusCallback> = mutableMapOf()
    private val mainHandler = Handler(Looper.getMainLooper())

    // Remembers that this library has shown the system prompt once. Android itself cannot
    // tell "never asked" from "denied for good": in both cases the permission is not granted
    // and shouldShowRequestPermissionRationale() is false.
    private val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private val lcObserver = object : DefaultLifecycleObserver {
        override fun onResume(owner: LifecycleOwner) {
            handleOnResume()
        }
    }

    init {
        // Register lifecycle observer on main thread
        // Activity reference is not stored — only used transiently here
        mainHandler.post {
            (context.currentActivity as? AppCompatActivity)
                ?.lifecycle
                ?.addObserver(lcObserver)
        }
    }

    private fun getActivity(): AppCompatActivity {
        return context.currentActivity as? AppCompatActivity
            ?: throw IllegalStateException(
                "Current activity is not an AppCompatActivity. Found: ${context.currentActivity?.javaClass?.name}"
            )
    }

    fun registerCallback(callback: LocationStatusCallback): Int {
        val curId = cbCount
        cbCount += 1
        callbacks[curId] = callback
        return curId
    }

    fun removeCallback(id: Int): Boolean {
        if (callbacks.containsKey(id)) {
            callbacks.remove(id)
            return true
        }
        return false
    }

    fun getCurrentPermission(): PTLocationAccess {
        val status = context.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
        if (status == PackageManager.PERMISSION_GRANTED) {
            return PTLocationAccess.GRANTED
        }
        // Same contract as iOS: NOT_DETERMINED until the user has been asked once, DENIED
        // after that. Before, a fresh install reported DENIED straight away, so callers
        // that only ask on NOT_DETERMINED never showed the system prompt.
        if (!prefs.getBoolean(KEY_LOCATION_REQUESTED, false)) {
            return PTLocationAccess.NOT_DETERMINED
        }
        return PTLocationAccess.DENIED
    }

    fun requestPermission() {
        // Ask once, like iOS: after the first answer a request does nothing. Callers tend to
        // request again while the prompt is still up or right after it closes (the app goes
        // to the background and back), which showed the prompt a second time.
        if (getCurrentPermission() != PTLocationAccess.NOT_DETERMINED) {
            return
        }
        val activity = getActivity()
        prefs.edit().putBoolean(KEY_LOCATION_REQUESTED, true).apply()
        activity.requestPermissions(
            arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
            Constants.LOCATION_REQUEST_CODE
        )
    }

    private fun handleOnResume() {
        val curState = getCurrentPermission()
        for (cb in callbacks.values) {
            cb(curState)
        }
    }

    private companion object {
        const val PREFS_NAME = "esp_prov_toolkit"
        const val KEY_LOCATION_REQUESTED = "location_permission_requested"
    }
}