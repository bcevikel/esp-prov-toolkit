package com.margelo.nitro.espprovtoolkit
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.DefaultLifecycleObserver
import com.facebook.react.bridge.ReactApplicationContext
import androidx.lifecycle.LifecycleOwner
import com.margelo.nitro.core.Promise
import android.os.Handler
import android.os.Looper
typealias LocationStatusCallback = (level: PTLocationAccess) -> Promise<Boolean>

class LocationPermissionHelper(val context : ReactApplicationContext){

  private val activity: AppCompatActivity
  private var cbCount : Int = 0
  private val callbacks : MutableMap<Int,LocationStatusCallback> = mutableMapOf()
  private val mainHandler = Handler(Looper.getMainLooper())

  init {
    // handle getting AppCompatActivity from ReactContext
    val currentActivity = context.currentActivity
    activity = currentActivity as? AppCompatActivity
      ?: throw IllegalStateException(
        "Current activity is not an AppCompatActivity. Found: ${currentActivity?.javaClass?.name}"
      )
    // create, and register the observer for LC events
    val lcObserver = object : DefaultLifecycleObserver {
      override fun onResume(owner: LifecycleOwner) {
        // call our classes on resume
        handleOnResume()
      }
    }
    // Register observer on main thread
    mainHandler.post {
      activity.lifecycle.addObserver(lcObserver)
    }
  }

  fun registerCallback(callback : LocationStatusCallback): Int {
    val curId = cbCount
    cbCount += 1
    callbacks[curId] = callback
    return curId
  }

  fun removeCallback(id : Int) : Boolean{
    if(callbacks.containsKey(id)){
      callbacks.remove(id)
      return true
    }
    return false
  }

  fun getCurrentPermission() : PTLocationAccess{
    val status = context.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
    // if it is granted, we can safely return
    if(status == PackageManager.PERMISSION_GRANTED){
      return PTLocationAccess.GRANTED
    }
    // if it is not, check with shouldShowRequestPermissionRationale if we can ask again
    if(activity.shouldShowRequestPermissionRationale(android.Manifest.permission.ACCESS_FINE_LOCATION)){
      // if we can show, it means it was denied in the past but we can still ask again
      return PTLocationAccess.NOT_DETERMINED
    }
    // if we cannot show the prompt again, we are denied for sure
    return PTLocationAccess.DENIED
  }

  fun requestPermission() {
    activity.requestPermissions(arrayOf(android.Manifest.permission.ACCESS_FINE_LOCATION),
      Constants.LOCATION_REQUEST_CODE)
  }

  private fun handleOnResume(){
    // get callbacks and call them with cur state
    val curState = getCurrentPermission()
    for (cb in callbacks.values){
      cb(curState)
    }
  }

}
