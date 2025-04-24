//
//  Utils.swift
//  EspProvToolkit
//
//  Created by Berk Cevikel on 16.04.2025.
//

import Foundation
import ESPProvision
import CoreLocation

// We will map each error type from JS types to native types with convinience ctors

// ESP_PT_WifiScanError
// ESP_PT_ThreadScanError
// ESP_PT_SessionError
// ESP_PT_CSSError
// ESP_PT_ProvisionError



extension PTSecurity {
  init (from security : ESPSecurity){
    switch security {
    case .unsecure:
      self = PTSecurity.security0
    case .secure:
      self = PTSecurity.security1
    case .secure2:
      self = PTSecurity.security2
    }
  }
}

extension ESPSecurity{
  init(from security : PTSecurity){
    switch security {
    case .security0:
      self = ESPSecurity.unsecure
    case .security1:
      self = ESPSecurity.secure
    case .security2:
      self = ESPSecurity.secure2
    default:
      self = ESPSecurity.secure
    }
  }
}

extension PTTransport{
  init(from transport : ESPTransport){
    switch transport {
    case .ble:
      self = PTTransport.transportBle
    case .softap:
      self = PTTransport.transportSoftap
    }
  }
}

extension ESPTransport{
  init(from transport : PTTransport){
    switch transport {
    case .transportBle:
      self = ESPTransport.ble
    case .transportSoftap:
      self = ESPTransport.softap
    default:
      self = ESPTransport.softap
    }
  }
}


extension PTError {
  init(from cssError: ESPDeviceCSSError) {
    self = PTError(rawValue: Int32(cssError.code))!

  }
  
  init(from sessionError: ESPSessionError){
    self = PTError(rawValue: Int32(sessionError.code))!
  }
  
  init(from provErr : ESPProvisionError){
    self = PTError(rawValue : Int32(provErr.code))!
  }
  
  init(from wifiErr : ESPWiFiScanError){
    self = PTError(rawValue : Int32(wifiErr.code))!
  }
  
  init(from rtimeErr : ESPRuntimeError){
    self = PTError(rawValue : Int32(rtimeErr.code))!
  }
}

extension PTWifiEntry{
  init(from wifiNetwork : ESPWifiNetwork){
    self = PTWifiEntry(ssid: wifiNetwork.ssid,
                           rssi: Double(wifiNetwork.rssi),
                           auth: Double(wifiNetwork.auth.rawValue),
                           bssid: wifiNetwork.bssid.toHexString(),
                           channel: Double(wifiNetwork.channel))
  }
}



extension PTSessionStatus{
  init(from sessionStatus : ESPSessionStatus){
    switch sessionStatus {
    case .connected:
      self = PTSessionStatus.connected
    case .disconnected:
      self = PTSessionStatus.disconnected
    case .failedToConnect:
      self = PTSessionStatus.disconnected

    }
  }
}

extension PTProvisionStatus{
  init(from provStatus : ESPProvisionStatus){
    switch provStatus {
    case .success:
      self = PTProvisionStatus.success
    case .failure:
      self = PTProvisionStatus.success
    case .configApplied:
      self = PTProvisionStatus.configApplied
    }
  }
}


