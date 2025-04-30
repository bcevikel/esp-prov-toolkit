package com.margelo.nitro.espprovtoolkit
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.ReactApplicationContext
import android.os.Build

class PermissionsHelper {
  companion object{
    private fun castToActivity(ctx : ReactApplicationContext): AppCompatActivity{
      val currentActivity = ctx.currentActivity
      return currentActivity as? AppCompatActivity
        ?: throw IllegalStateException(
          "Current activity is not an AppCompatActivity. Found: ${currentActivity?.javaClass?.name}"
        )
    }

    private fun doesHavePermission(ctx: ReactApplicationContext, perm: String): Boolean{
      return ctx.checkSelfPermission(perm) == PackageManager.PERMISSION_GRANTED
    }
    private fun doesHavePermission(ctx: ReactApplicationContext, perms: Array<String>): Boolean{
      for(perm in perms){
        if (ctx.checkSelfPermission(perm) == PackageManager.PERMISSION_DENIED){
          return false
        }
      }
      return true
    }

    fun requestWifiStatePerms(ctx : ReactApplicationContext){
      if(doesHavePermission(ctx, android.Manifest.permission.ACCESS_WIFI_STATE)){
        return
      }
      // if not, prompt the user
      val activity = castToActivity(ctx)
      activity.requestPermissions(arrayOf(android.Manifest.permission.ACCESS_WIFI_STATE),
        Constants.WIFI_STATE_REQUEST_CODE)
    }

    fun requestBleScanPerms(ctx : ReactApplicationContext){
      val activity = castToActivity(ctx)
      // For API =< 30, use BLUETOOTH and BLUETOOTH_ADMIN
      if(Build.VERSION.SDK_INT <= 30){
        // lets see if we already have perms
        if(doesHavePermission(ctx,
            arrayOf(android.Manifest.permission.BLUETOOTH,
              android.Manifest.permission.BLUETOOTH_ADMIN))){
          return  // return if we do
        }
        // if we don't, request it
        activity.requestPermissions(arrayOf(android.Manifest.permission.BLUETOOTH,
          android.Manifest.permission.BLUETOOTH_ADMIN), Constants.BLE_SCAN_REQUEST_CODE)
      }
      // For API > 30, use BLUETOOTH_SCAN
      else{
        // don't request if we already have it
        if(doesHavePermission(ctx, android.Manifest.permission.BLUETOOTH_SCAN)){
          return
        }
        activity.requestPermissions(arrayOf(android.Manifest.permission.BLUETOOTH_SCAN), Constants.BLE_SCAN_REQUEST_CODE)
      }
    }

    fun requestSoftapScanPerms(ctx : ReactApplicationContext){
      if(doesHavePermission(ctx,
          arrayOf(android.Manifest.permission.CHANGE_WIFI_STATE,
          android.Manifest.permission.ACCESS_WIFI_STATE))){
        return
      }
      // Do the actual request for permission
      val activity = castToActivity(ctx)
      activity.requestPermissions(arrayOf(android.Manifest.permission.CHANGE_WIFI_STATE,
        android.Manifest.permission.ACCESS_WIFI_STATE), Constants.WIFI_ALL_REQUEST_CODE)
    }

  }
}
