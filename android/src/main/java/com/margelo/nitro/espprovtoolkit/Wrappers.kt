package com.margelo.nitro.espprovtoolkit

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothDevice
import android.bluetooth.le.ScanResult
import android.util.Log
import androidx.annotation.RequiresPermission
import com.espressif.provisioning.ESPConstants.SecurityType
import com.espressif.provisioning.ESPConstants.TransportType
import com.espressif.provisioning.ESPDevice
import com.espressif.provisioning.ESPProvisionManager
import com.espressif.provisioning.listeners.BleScanListener
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.withContext
import java.util.concurrent.atomic.AtomicBoolean
import android.os.Handler
import android.os.Looper
import com.espressif.provisioning.ESPConstants
import com.espressif.provisioning.WiFiAccessPoint
import com.espressif.provisioning.listeners.WiFiScanListener
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import java.util.ArrayList
import kotlin.coroutines.suspendCoroutine
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import org.greenrobot.eventbus.EventBus
import org.greenrobot.eventbus.Subscribe
import org.greenrobot.eventbus.ThreadMode
import com.espressif.provisioning.DeviceConnectionEvent
import com.espressif.provisioning.listeners.ProvisionListener
import com.espressif.provisioning.listeners.ResponseListener
import com.facebook.react.bridge.ReactApplicationContext

class Wrappers {
  companion object {
    const val TAG = "EspAsyncWrappers"
    // Handling Android State variable
    private var reactContext: ReactApplicationContext? = null
    fun setContext(context: ReactApplicationContext) {
      reactContext = context
    }

    fun getContext(): ReactApplicationContext? {
      return reactContext
    }

    class EspBleMetadata{
      var deviceName: String = ""
      var bleDevice: BluetoothDevice? = null
      var serviceUuid: String? = null
    }

    interface EventListener{
       fun onEvent(event : DeviceConnectionEvent)
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
    suspend fun searchBle(devicePrefix : String?): List<EspBleMetadata>{

      // First check android context
      if(getContext() == null){
        throw IllegalStateException("Android State cannot be null.")
      }
      // List to hold found devices
      val devices = mutableListOf<EspBleMetadata>()
      // A channel so that the callback can send values to this coro
      val deviceChannel = Channel<EspBleMetadata>(Channel.BUFFERED)
      // An atomic bool so that we do not do double operations
      val scanCompleted = AtomicBoolean(false)
      var scanError : Exception? = null

      val bleListener = object : BleScanListener {
        override fun scanStartFailed() {
          Log.e(TAG,"BLE search failed to start.")
          if(!scanCompleted.getAndSet(true)){
            scanError = Exception("BLE search failed to start.")
            deviceChannel.close(scanError)
          }
        }

        @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
        override fun onPeripheralFound(device: BluetoothDevice?, scanResult: ScanResult?) {
          if(!scanCompleted.get()){
            if (scanResult != null) {
              val serviceUuid = scanResult.scanRecord?.serviceUuids?.getOrNull(0)?.toString()
              val espMetadata = EspBleMetadata()
              espMetadata.deviceName = scanResult.scanRecord?.deviceName ?: "Unnamed Device"
              espMetadata.bleDevice = device
              espMetadata.serviceUuid = serviceUuid
              deviceChannel.trySend(espMetadata)
            }
          }
        }

        override fun scanCompleted() {
          if(!scanCompleted.getAndSet(true)){
            deviceChannel.close()
          }
        }

        override fun onFailure(e: java.lang.Exception?) {
          if(!scanCompleted.getAndSet(true)){
            scanError = e
            deviceChannel.close(e)
          }
        }
      }
      // Must switch to Main thread for BLE operations
      withContext(Dispatchers.Main) {
        ESPProvisionManager.getInstance(getContext()).searchBleEspDevices(bleListener)
      }

      // Get the results from the channel
      try {
        for (espMetadata in deviceChannel){
          if (espMetadata.deviceName.startsWith(devicePrefix ?: "" )) {
            // BLE device, service uuid should be valid.
            if(espMetadata.serviceUuid != null && espMetadata.bleDevice != null){
              devices.add(espMetadata)
            }
          }
        }
      } finally {
        // If somehow we did not stop the scan via callback, make sure we do.
        if(!scanCompleted.getAndSet(true)){
          withContext(Dispatchers.Main) {
            ESPProvisionManager.getInstance(getContext())
              .stopBleScan()
          }
        }
      }
      scanError?.let { throw it }
      return devices.distinctBy { it.deviceName to it.serviceUuid }
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
    fun stopBleSearch() {
      // Run on Main thread using handler instead of coroutine context
      Handler(Looper.getMainLooper()).post {
        ESPProvisionManager.getInstance(getContext()).stopBleScan()
      }
    }

    suspend fun searchSoftap(devicePrefix: String?): List<WiFiAccessPoint>
    = suspendCancellableCoroutine { continuation ->
      // First check android context
      val context = getContext() ?: run {
        continuation.resumeWithException(IllegalStateException("Android Context cannot be null."))
        return@suspendCancellableCoroutine
      }

      // List to hold found devices
      val devices = mutableListOf<WiFiAccessPoint>()

      val softapListener = object : WiFiScanListener {
        override fun onWifiListReceived(wifiList: ArrayList<WiFiAccessPoint>?) {
          // Process the found WiFi networks
          wifiList?.let { accessPoints ->
            for (ap in accessPoints) {
              // If devicePrefix is specified, only add matching devices
              if (ap.wifiName.startsWith(devicePrefix ?: "") && ap.wifiName.isNotBlank() ) {
                devices.add(ap)
              }
            }
            devices.distinctBy { it.wifiName to it.security }
          }
          // Resume the coroutine with the list of devices
          if (continuation.isActive) {
            continuation.resume(devices)
          }
        }

        override fun onWiFiScanFailed(e: java.lang.Exception?) {
          // Resume with exception if the scan fails
          if (continuation.isActive) {
            continuation.resumeWithException(e ?: Exception("WiFi search failed for unknown reason"))
          }
        }
      }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          ESPProvisionManager.getInstance(context).searchWiFiEspDevices(softapListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }
    // Update this function to run on the main thread
    suspend fun createDeviceNoScan(
      deviceName: String,
      transport: TransportType,
      security: SecurityType,
      proofOfPossession: String?,
      softApPassword: String?,
      username: String?
    ): ESPDevice = withContext(Dispatchers.Main) {
      // Create the device on the main thread
      val device = ESPProvisionManager.getInstance(getContext()).createESPDevice(transport, security)

      // These property assignments should be fine on the main thread too
      device.proofOfPossession = proofOfPossession
      device.deviceName = deviceName
      device.wifiDevice = WiFiAccessPoint()
      device.wifiDevice.wifiName = deviceName
      device.wifiDevice.password = softApPassword
      device.userName = username

      return@withContext device
    }

    @SuppressLint("MissingPermission")
    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.BLUETOOTH_ADMIN, Manifest.permission.BLUETOOTH])
    suspend fun createDevice(deviceName : String,
                             transport : TransportType,
                             security : SecurityType,
                             proofOfPossession : String?,
                             softApPassword : String?,
                             username : String?): ESPDevice {

      // To match ios behaviour, perform BLE scan if transport is BLE
      if(transport == TransportType.TRANSPORT_BLE){
        val devices = searchBle(null)
        // find our BLE metadata
        val bleMetadata = devices.find { it.deviceName == deviceName }
        bleMetadata?.let {
          // create and populate the device with fun args
          val device = createDeviceNoScan(deviceName, transport,
            security,proofOfPossession,softApPassword,username)
          device.bluetoothDevice = bleMetadata.bleDevice
          device.primaryServiceUuid = bleMetadata.serviceUuid
          // return our new device
          return device
        } ?: run { // if null, throw
          throw PTException(PTExtendedError.ESP_DEVICE_NOT_FOUND)
        }
      }
      // We do not need to scan for SoftAP.
      val device = createDeviceNoScan(deviceName,transport,security,
        proofOfPossession,softApPassword,username)
      return  device
    }

    suspend fun scanWifiNetworks(device: ESPDevice): ArrayList<WiFiAccessPoint>
    = suspendCancellableCoroutine  { continuation ->

      val softapListener = object : WiFiScanListener {
        override fun onWifiListReceived(wifiList: ArrayList<WiFiAccessPoint>?) {

          // Resume the coroutine with the list of devices
          if (continuation.isActive) {
            continuation.resume(wifiList ?: ArrayList())
          }
        }

        override fun onWiFiScanFailed(e: java.lang.Exception?) {
          // Resume with exception if the scan fails
          if (continuation.isActive) {
            continuation.resumeWithException(e ?: Exception("WiFi scan failed for unknown reason"))
          }
        }
      }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          device.scanNetworks(softapListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }

    @SuppressLint("MissingPermission")
    suspend fun connectEspDevice(espDevice: ESPDevice): PTSessionStatus
    = suspendCancellableCoroutine  { continuation ->

      // Callback Object set up
      val connListener = object : EventListener {
        @Subscribe(threadMode = ThreadMode.ASYNC)
        override fun onEvent(event: DeviceConnectionEvent) {
          // Make sure cont is still active and not resumed earlier
          if(continuation.isActive){
            // clean up the event registry
            EventBus.getDefault().unregister(this)
            // dispatch and return
            when(event.eventType){
              ESPConstants.EVENT_DEVICE_CONNECTED-> continuation.resume(PTSessionStatus.CONNECTED)
              ESPConstants.EVENT_DEVICE_DISCONNECTED -> continuation.resume(PTSessionStatus.DISCONNECTED)
              else ->  continuation.resume(PTSessionStatus.CHECK_MANUALLY)
            }
          }
        }
      }

      // Using suspendCancellableCoroutine to handle cancellation
      continuation.invokeOnCancellation {
        // unregister the event callback obj
        EventBus.getDefault().unregister(connListener)
      }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          espDevice.connectToDevice()
          EventBus.getDefault().register(connListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }

    suspend fun initSessionEspDevice(espDevice: ESPDevice): PTSessionStatus
      = suspendCancellableCoroutine  { continuation ->

        // Set up the callback object
        val respListener = object : ResponseListener{
          override fun onSuccess(returnData: ByteArray?) {
            if(continuation.isActive){
              continuation.resume(PTSessionStatus.CONNECTED)
            }
          }

          override fun onFailure(e: java.lang.Exception?) {
            if(continuation.isActive){
              // Throw our custom type by checking against known error messages
              e?.let { continuation.resumeWithException(it) }
                ?: run { continuation.resume(PTSessionStatus.DISCONNECTED) }
            }
          }
        }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          espDevice.initSession(respListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }

    suspend fun provisionEspDevice(espDevice: ESPDevice,
                                   ssid : String, password : String): Unit
      = suspendCancellableCoroutine  { continuation ->

        val provListener = object : ProvisionListener{
          override fun createSessionFailed(e: java.lang.Exception?) {
            if(continuation.isActive){
              e?.let { continuation.resumeWithException(it) }
                ?: run { continuation.resumeWithException(
                  PTException(PTExtendedError.ESP_NATIVE_UNKNOWN_ERROR))}
            }
          }

          override fun wifiConfigSent() {
            Log.i(TAG,"Provisioning config sent.")
          }

          override fun wifiConfigFailed(e: java.lang.Exception?) {
            if(continuation.isActive){
              e?.let { continuation.resumeWithException(it) }
                ?: run { continuation.resumeWithException(
                  PTException(PTExtendedError.ESP_NATIVE_UNKNOWN_ERROR))}
            }
          }

          override fun wifiConfigApplied() {
            Log.i(TAG,"Provisioning config applied.")
          }

          override fun wifiConfigApplyFailed(e: java.lang.Exception?) {
            if(continuation.isActive){
              e?.let { continuation.resumeWithException(it) }
                ?: run { continuation.resumeWithException(
                  PTException(PTExtendedError.ESP_NATIVE_UNKNOWN_ERROR))}
            }
          }

          override fun provisioningFailedFromDevice(failureReason: ESPConstants.ProvisionFailureReason?) {
            if (!continuation.isActive){ // guard - didn't want to indent everything
              return
            }
            failureReason?. let {
              val err = when(failureReason){
                ESPConstants.ProvisionFailureReason.DEVICE_DISCONNECTED
                  -> PTExtendedError.PROV_WIFI_STATUS_DISCONNECTED

                ESPConstants.ProvisionFailureReason.AUTH_FAILED
                  -> PTExtendedError.PROV_WIFI_STATUS_AUTH_ERROR

                ESPConstants.ProvisionFailureReason.NETWORK_NOT_FOUND
                  -> PTExtendedError.PROV_WIFI_STATUS_NETWORK_NOT_FOUND

                ESPConstants.ProvisionFailureReason.UNKNOWN
                  -> PTExtendedError.PROV_WIFI_STATUS_UNKNOWN_ERROR

              }
              continuation.resumeWithException(PTException(err)) // throw
            } ?: run {
              continuation.resumeWithException(PTException(PTExtendedError.ESP_NATIVE_UNKNOWN_ERROR))
            }
          }

          override fun deviceProvisioningSuccess() {
            if(continuation.isActive){
              continuation.resume(Unit)
            }
          }

          override fun onProvisioningFailed(e: java.lang.Exception?) {
            if(continuation.isActive){
              e?.let { continuation.resumeWithException(it) }
                ?: run { continuation.resumeWithException(
                  PTException(PTExtendedError.ESP_NATIVE_UNKNOWN_ERROR))}
            }
          }
        }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          espDevice.provision(ssid,password,provListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }

    suspend fun sendDataToEspDevice(espDevice: ESPDevice, path : String, data : ByteArray): ByteArray?
      = suspendCancellableCoroutine  { continuation ->

      // Set up the callback object
      val respListener = object : ResponseListener{
        override fun onSuccess(returnData: ByteArray?) {
          if(continuation.isActive){
            continuation.resume(data)
          }
        }

        override fun onFailure(e: java.lang.Exception?) {
          if(continuation.isActive){
            // Throw our custom type by checking against known error messages
            e?.let { continuation.resumeWithException(it) }
          }
        }
      }

      // Launch on Main dispatcher since ESP operations require the main thread
      CoroutineScope(Dispatchers.Main).launch {
        try {
          espDevice.sendDataToCustomEndPoint(path,data,respListener)
        } catch (e: Exception) {
          // Handle any exceptions during the start of scanning
          if (continuation.isActive) {
            continuation.resumeWithException(e)
          }
        }
      }
    }
  }
}
