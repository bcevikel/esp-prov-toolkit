package com.margelo.nitro.espprovtoolkit

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
        if (getActivity().shouldShowRequestPermissionRationale(android.Manifest.permission.ACCESS_FINE_LOCATION)) {
            return PTLocationAccess.NOT_DETERMINED
        }
        return PTLocationAccess.DENIED
    }

    fun requestPermission() {
        getActivity().requestPermissions(
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
}