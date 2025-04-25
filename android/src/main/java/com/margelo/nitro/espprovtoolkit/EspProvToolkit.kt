package com.margelo.nitro.espprovtoolkit

import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise

@DoNotStrip
class EspProvToolkit : HybridEspProvToolkitSpec() {

  override fun searchForESPDevices(
    devicePrefix: String,
    transport: PTTransport,
    security: PTSecurity
  ): Promise<PTSearchResult> {
    TODO("Not yet implemented")
  }

  override fun stopSearchingForESPDevices() {
    TODO("Not yet implemented")
  }

  override fun createESPDevice(
    deviceName: String,
    transport: PTTransport,
    security: PTSecurity,
    proofOfPossession: String?,
    softAPPassword: String?,
    username: String?
  ): Promise<PTResult> {
    TODO("Not yet implemented")
  }

  override fun getESPDevice(deviceName: String): PTDeviceResult {
    TODO("Not yet implemented")
  }

  override fun doesESPDeviceExist(deviceName: String): Boolean {
    TODO("Not yet implemented")
  }

  override fun scanWifiListOfESPDevice(deviceName: String): Promise<PTWifiScanResult> {
    TODO("Not yet implemented")
  }

  override fun connectToESPDevice(deviceName: String): Promise<PTSessionResult> {
    TODO("Not yet implemented")
  }

  override fun disconnectFromESPDevice(deviceName: String): PTResult {
    TODO("Not yet implemented")
  }

  override fun createSessionWithESPDevice(deviceName: String): Promise<PTSessionResult> {
    TODO("Not yet implemented")
  }

  override fun provisionESPDevice(
    deviceName: String,
    ssid: String,
    password: String
  ): Promise<PTProvisionResult> {
    TODO("Not yet implemented")
  }

  override fun isESPDeviceSessionEstablished(deviceName: String): PTBooleanResult {
    TODO("Not yet implemented")
  }

  override fun sendDataToESPDevice(
    deviceName: String,
    path: String,
    data: String
  ): Promise<PTStringResult> {
    TODO("Not yet implemented")
  }

  override fun getIPv4AddressOfESPDevice(deviceName: String): PTStringResult {
    TODO("Not yet implemented")
  }

  override fun getCurrentNetworkSSID(): PTStringResult {
    TODO("Not yet implemented")
  }

  override fun requestLocationPermission() {
    TODO("Not yet implemented")
  }

  override fun registerLocationStatusCallback(callback: (level: PTLocationAccess) -> Promise<Boolean>): Long {
    TODO("Not yet implemented")
  }

  override fun removeLocationStatusCallback(id: Long): Boolean {
    TODO("Not yet implemented")
  }

  override fun getCurrentLocationStatus(): PTLocationAccess {
    TODO("Not yet implemented")
  }
}
