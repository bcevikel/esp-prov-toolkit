package com.margelo.nitro.espprovtoolkit

import android.Manifest
import android.bluetooth.BluetoothDevice
import android.content.Context
import android.net.wifi.WifiManager
import android.util.Log
import androidx.annotation.RequiresPermission
import com.espressif.provisioning.ESPConstants
import com.espressif.provisioning.ESPDevice
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.core.Promise
import com.margelo.nitro.espprovtoolkit.Wrappers

@DoNotStrip
class EspProvToolkit : HybridEspProvToolkitSpec() {
  companion object{
    const val TAG = "EspProvToolkit"
    var locationHelper : LocationPermissionHelper? = null
    var devices : MutableMap<String,ESPDevice> = mutableMapOf()
  }
  private fun storeDevice(device: ESPDevice, key: String){
    devices[key] = device
  }

  private fun getDevice(deviceName: String): ESPDevice{
    return devices[deviceName] ?: throw PTException(PTExtendedError.RUNTIME_DOES_NOT_EXIST_LOCALLY)
  }

  private fun getLocationHelper() : LocationPermissionHelper{
    val ctx = Wrappers.getContext()
      ?: throw IllegalStateException("Wrapper's ReactContext cannot be null.")

    if(locationHelper == null){
      locationHelper = LocationPermissionHelper(ctx)
    }
    return locationHelper as LocationPermissionHelper
  }

  private fun getContext(): ReactApplicationContext{
    return Wrappers.getContext() ?: throw IllegalStateException("Wrapper's ReactContext cannot be null");
  }

  private fun handleExceptions(e: Exception): PTExtendedError{
    return when (e) {
        is PTException -> PTExtendedError.fromCodeOrDefault(e.getCode())
      is SecurityException -> PTExtendedError.ESP_INSUFFICIENT_PERMISSIONS
      else -> {
        // Try to get code from known list of messages
        val errorCode = e.message?.let { PTExtendedError.fromDescription(it) }
        errorCode?.let { return  errorCode }
        Log.e(TAG,"Unhandled exception forwarded to native layer with desc : ${e.message} ")
        throw e
      }
    }
  }

  @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
  override fun searchForESPDevices(
    devicePrefix: String,
    transport: PTTransport,
    security: PTSecurity
  ): Promise<PTSearchResult> {
    return Promise.async {
      val ctx = getContext()
      var deviceNameList : MutableList<String> = mutableListOf()
      try {
        if(transport == PTTransport.TRANSPORT_BLE){
          // Get permissions for BLE scanning
          PermissionsHelper.requestBleScanPerms(ctx)
          // Perform the scan
          val espBleMetadata = Wrappers.searchBle(devicePrefix)
          // construct the devices and add them to local store
          for (metadata in espBleMetadata){
            val espDevice = Wrappers.createDeviceNoScan(metadata.deviceName,
              ConversionHelpers.convertTransport(transport),
              ConversionHelpers.convertSecurity(security),
              null, null, null)
            espDevice.bluetoothDevice = metadata.bleDevice
            espDevice.primaryServiceUuid = metadata.serviceUuid
            // add
            storeDevice(espDevice,espDevice.deviceName)
            deviceNameList.add(espDevice.deviceName)
          }
        }
        else { // SoftAP
          // request perms and perform scan
          PermissionsHelper.requestSoftapScanPerms(ctx)
          val apList = Wrappers.searchSoftap(devicePrefix)
          for (ap in apList){
            // create the devices and store them
            val espDevice = Wrappers.createDeviceNoScan(ap.wifiName, ConversionHelpers.convertTransport(transport),
              ConversionHelpers.convertSecurity(security), null,null,null)
            espDevice.wifiDevice = ap
            // store
            storeDevice(espDevice,espDevice.deviceName)
            deviceNameList.add(espDevice.deviceName)
          }
        }

        // if device list is empty, report error
        if (deviceNameList.isEmpty()) {
          return@async PTSearchResult(false, null, PTExtendedError.ESP_DEVICE_NOT_FOUND.toDouble())
        }

        return@async PTSearchResult(true, deviceNameList.toTypedArray(), null)

      } catch (e : Exception){
        return@async PTSearchResult(false,null,handleExceptions(e).toDouble())
      }
    }
  }

  @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
  override fun stopSearchingForESPDevices() {
    try {
      Wrappers.stopBleSearch()
    } catch(e : Exception){
     val errCode = handleExceptions(e)
      throw PTException(errCode)
    }
  }

  @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
  override fun createESPDevice(
    deviceName: String,
    transport: PTTransport,
    security: PTSecurity,
    proofOfPossession: String?,
    softAPPassword: String?,
    username: String?
  ): Promise<PTResult> {
    return Promise.async {
      try {
        val device = Wrappers.createDevice(deviceName, ConversionHelpers.convertTransport(transport),
          ConversionHelpers.convertSecurity(security),
          proofOfPossession,softAPPassword,username)
        // Store the device in our local store
        storeDevice(device,deviceName)
        return@async PTResult(true,null)
      } catch (e : Exception){
        return@async PTResult(false, handleExceptions(e).toDouble())
      }
    }
  }

  override fun getESPDevice(deviceName: String): PTDeviceResult {
    TODO("Not yet implemented")
  }

  override fun doesESPDeviceExist(deviceName: String): Boolean {
    return devices.containsKey(deviceName)
  }

  override fun scanWifiListOfESPDevice(deviceName: String): Promise<PTWifiScanResult> {
    return Promise.async {
      try {
        val device = getDevice(deviceName)
        val results = Wrappers.scanWifiNetworks(device)
        val jsResults = mutableListOf<PTWifiEntry>()
        // cast the results
        for(result in results){
          val entry = PTWifiEntry(result.wifiName,result.rssi.toDouble(),
            result.security.toDouble(),"",0.0)
          jsResults.add(entry)
        }
        return@async PTWifiScanResult(true,jsResults.toTypedArray(),null)
      } catch (e : Exception){
        return@async PTWifiScanResult(false, null, handleExceptions(e).toDouble())
      }
    }
  }

  override fun connectToESPDevice(deviceName: String): Promise<PTSessionResult> {
   return Promise.async {
     try {
       val device = getDevice(deviceName)
       // first connect, check, then init session
       val connStatus = Wrappers.connectEspDevice(device)
       if(connStatus == PTSessionStatus.DISCONNECTED){
         return@async PTSessionResult(true,PTSessionStatus.DISCONNECTED,null)
       }
       // now init session
       val sessionStatus = Wrappers.initSessionEspDevice(device)
       if(sessionStatus == PTSessionStatus.DISCONNECTED){
         return@async PTSessionResult(true, PTSessionStatus.DISCONNECTED,null)
       }
       // everything OK if we reached here
       return@async PTSessionResult(true,PTSessionStatus.CONNECTED,null)
     } catch (e : Exception){
       return@async PTSessionResult(false,null, handleExceptions(e).toDouble())
     }
   }
  }

  override fun disconnectFromESPDevice(deviceName: String): PTResult {
    try {
        val device = getDevice(deviceName)
        device.disconnectDevice()
        return PTResult(true,null)
    } catch(e : Exception){
      return PTResult(false, handleExceptions(e).toDouble())
    }
  }

  override fun createSessionWithESPDevice(deviceName: String): Promise<PTSessionResult> {
    TODO("Not yet implemented") // candidate for removal
  }

  override fun provisionESPDevice(
    deviceName: String,
    ssid: String,
    password: String
  ): Promise<PTProvisionResult> {
    return Promise.async {
      try {
        val device = getDevice(deviceName)
        val result = Wrappers.provisionEspDevice(device,ssid,password)
        return@async PTProvisionResult(true,result,null)
      } catch (e : Exception){
        return@async  PTProvisionResult(false,null, handleExceptions(e).toDouble())
      }
    }
  }

  override fun isESPDeviceSessionEstablished(deviceName: String): PTBooleanResult {
    try {
      val device = getDevice(deviceName)
      // This is a workaround - the ios version is similiar doesnt actually check conn
      val result = device.deviceCapabilities.isNotEmpty()
      return PTBooleanResult(true,result,null)
    } catch (e : Exception){
      return PTBooleanResult(false,null,handleExceptions(e).toDouble())
    }
  }

  override fun sendDataToESPDevice(
    deviceName: String,
    path: String,
    data: String
  ): Promise<PTStringResult> {
    TODO("Not yet implemented")
  }

  override fun getIPv4AddressOfESPDevice(deviceName: String): PTStringResult { // candidate for removal
    return PTStringResult(false,null,0.0)
  }

  override fun getCurrentNetworkSSID(): PTStringResult {
    val ctx = getContext()
    // Prompt the user for access wifi state permission if possible
    PermissionsHelper.requestWifiStatePerms(ctx)
    // Do the actual query
    try {
      val wifiManager = ctx.getSystemService(Context.WIFI_SERVICE) as WifiManager
      val wifiInfo = wifiManager.connectionInfo
      val ssid = wifiInfo.ssid
      // Remove quotes if present
      val cleanSsid = if (ssid.startsWith("\"") && ssid.endsWith("\"")) {
        ssid.substring(1, ssid.length - 1)
      } else {
        ssid
      }
      return PTStringResult(true,cleanSsid,null)
    }catch (e : Exception){
      return PTStringResult(false,null, handleExceptions(e).toDouble())
    }
  }

  override fun requestLocationPermission() {
      getLocationHelper().requestPermission()
  }

  override fun registerLocationStatusCallback(callback: (level: PTLocationAccess) -> Promise<Boolean>): Double {
    return getLocationHelper().registerCallback(callback).toDouble()
  }

  override fun removeLocationStatusCallback(id: Double): Boolean {
    return getLocationHelper().removeCallback(id.toInt())
  }

  override fun getCurrentLocationStatus(): PTLocationAccess {
      return getLocationHelper().getCurrentPermission()
  }

  override fun nativeErrorToNumber(error: PTError): Double {
    return 0.0
  }
}
