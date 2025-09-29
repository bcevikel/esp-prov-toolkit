//
//  EspProvAsyncWrappers.swift
//  EspProvToolkit
//
//  Created by Berk Cevikel on 16.04.2025.
//

import Foundation
import ESPProvision



extension ESPProvisionManager {
  
  func createESPDeviceAsync(
          deviceName: String,
          transport: ESPTransport,
          security: ESPSecurity,
          proofOfPossession: String?,
          softAPPassword: String?,
          username: String?) async throws -> ESPDevice {
            
            // Safety check so that resume NEVER gets called more than once.
            var hasResumed = false
            return try await withCheckedThrowingContinuation { continuation in
              self.createESPDevice(deviceName: deviceName,
                                   transport: transport,
                                   security: security,
                                   proofOfPossession: proofOfPossession,
                                   softAPPassword: softAPPassword,
                                   username: username) { espDevice, espError in
                // At this point, the call resolved and we need to resume
                guard !hasResumed else { return }
                hasResumed = true
                if let device = espDevice{
                  continuation.resume(returning: device)
                } else if let error = espError {
                  continuation.resume(throwing: error)
                } else{
                  continuation.resume(throwing: ESPRuntimeError.badClosureArgs)
                }
                
              }
            }
  }
  
  func searchESPDevicesAsync(devicePrefix : String,
                             transport : ESPTransport,
                             security : ESPSecurity = ESPSecurity.secure) async throws -> [ESPDevice] {
    // Safety check so that resume NEVER gets called more than once.
    var hasResumed = false
    return try await withCheckedThrowingContinuation { continuation in
      self.searchESPDevices(devicePrefix: devicePrefix,
                            transport: transport,
                            security: security) { espDevices, espError in
        // At this point, the call resolved and we need to resume
        guard !hasResumed else { return }
        hasResumed = true
        if let devices = espDevices{
          continuation.resume(returning: devices)
        } else if let error = espError {
          continuation.resume(throwing: error)
        } else{
          continuation.resume(throwing: ESPRuntimeError.badClosureArgs)
        }

      }
      
    }
    
  }
}


extension ESPDevice {
  
  func connectAsync() async throws -> ESPSessionStatus {
    // Safety check so that resume NEVER gets called more than once.
    var hasResumed = false
    return try await withCheckedThrowingContinuation { continuation in
      self.connect { espStatus in
        // At this point, the call resolved and we need to resume
        guard !hasResumed else { return }
        hasResumed = true
        switch espStatus{
        case .connected,.disconnected:
          continuation.resume(returning: espStatus)
        case .failedToConnect(let espSessionError):
          continuation.resume(throwing: espSessionError)
        }
      }
    }
  }
  
  func sendDataAsync(path : String, data : Data) async throws -> Data{
    // Safety check so that resume NEVER gets called more than once.
    var hasResumed = false
    return try await withCheckedThrowingContinuation { continuation in
      self.sendData(path: path, data: data) { espData, espError in
        guard !hasResumed else { return }
        hasResumed = true
        
        if let data = espData{
          continuation.resume(returning: data)
        } else if let error = espError {
          continuation.resume(throwing: error)
        } else{
          continuation.resume(throwing: ESPRuntimeError.badClosureArgs)
        }
        
      }
    }
  }
  
  func provisionAsync(ssid: String, passcode: String = "") async throws -> ESPProvisionStatus {
      // Safety check so that resume NEVER gets called more than once.
      var hasResumed = false
      
      return try await withCheckedThrowingContinuation { continuation in

          
          self.provision(ssid: ssid, passPhrase: passcode) { espStatus in
              guard !hasResumed else { return }
              
              switch espStatus {
              case .configApplied:
                hasResumed = false
                // no op
                break
                  
              case .success:
                  hasResumed = true
                  continuation.resume(returning: espStatus)
                  
              case .failure(let espProvError):
                  
                  hasResumed = true
                  continuation.resume(throwing: espProvError)
              }
          }
      }
  }
  
  func scanWifiListAsync() async throws -> [ESPWifiNetwork] {
    // Safety check so that resume NEVER gets called more than once.
    var hasResumed = false
    return try await withCheckedThrowingContinuation { continuation in
      self.scanWifiList { wifiNetworks, espError in
        
        guard !hasResumed else { return }
        hasResumed = true
        
        if let networks = wifiNetworks{
          continuation.resume(returning: networks)
        } else if let error = espError {
          continuation.resume(throwing: error)
        } else{
          continuation.resume(throwing: ESPRuntimeError.badClosureArgs)
        }
        
      }
    }
  }
  
  func initialiseSessionAsync(sessionPath : String?) async throws -> ESPSessionStatus {
    // Safety check so that resume NEVER gets called more than once.
    var hasResumed = false
    return try await withCheckedThrowingContinuation { continuation in

      self.initialiseSession(sessionPath: sessionPath) { espStatus in
        
        guard !hasResumed else { return }
        hasResumed = true
        switch espStatus {
        case .connected, .disconnected:
          continuation.resume(returning: espStatus)
        case .failedToConnect(let sessionError):
          continuation.resume(throwing: sessionError)
        }
      }
    }
  }
  
}
