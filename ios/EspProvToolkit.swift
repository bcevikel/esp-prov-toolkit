import NitroModules
import ESPProvision
import SystemConfiguration.CaptiveNetwork


class EspProvToolkit: HybridEspProvToolkitSpec {
  // Static dict to store EspDevice instances
  private static var devices : [String : ESPDevice]  = [:];
  
  static private func storeDeviceEntry(_ device : ESPDevice, withkey key: String){
    devices[key] = device;
  }
  
  // Due to a force unwrapping in EspProvision, we need to keep track if we are doing BLE Scan,
  // because if you call stop search while you are not searching, it will crash.
  static private var isBLEScanActive : Bool = false;
  
  static private func getDeviceEntry(forKey key: String) throws -> ESPDevice{
    guard let device = devices[key] else {
      throw ESPRuntimeError.doesNotExistLocally
    }
    return device
  }
  
  func searchForESPDevices(devicePrefix: String, transport: PTTransport, security: PTSecurity) throws -> NitroModules.Promise<PTSearchResult> {
    return Promise.async{
      do{
        // activate scan bool
        EspProvToolkit.isBLEScanActive = true
        // get the devices from the search
        let devices = try await ESPProvisionManager.shared.searchESPDevicesAsync(devicePrefix: devicePrefix,
                                                                                 transport: ESPTransport(from: transport),
                                                                                 security: ESPSecurity(from: security) )
        var deviceNames : [String] = []
        // populate our local cache, and a list of strings for returning
        for device in devices {
          deviceNames.append(device.name)
          EspProvToolkit.storeDeviceEntry(device, withkey: device.name)
        }
        
        return PTSearchResult(success: true, deviceNames: deviceNames, error: nil)
        
      } catch let error as ESPDeviceCSSError {
        // propagate this error via our return interface
        return PTSearchResult(success: false, deviceNames: nil, error: Double(PTError(from: error).rawValue))
      }
    }
  }
  
  func stopSearchingForESPDevices() throws {
    // Make sure we dont cancel while scan is not active
    guard EspProvToolkit.isBLEScanActive else {
      ESPProvisionManager.shared.stopESPDevicesSearch()
      EspProvToolkit.isBLEScanActive = false
      return
    }
  }
  
  func createESPDevice(deviceName: String, transport: PTTransport, security: PTSecurity, proofOfPossession: String?, softAPPassword: String?, username: String?) throws -> NitroModules.Promise<PTResult> {
    return Promise.async{
      do{
        let device = try await ESPProvisionManager.shared.createESPDeviceAsync(deviceName: deviceName,
                                                                               transport: ESPTransport(from: transport),
                                                                               security: ESPSecurity(from: security),
                                                                               proofOfPossession: proofOfPossession,
                                                                               softAPPassword: softAPPassword,
                                                                               username: username)
        EspProvToolkit.storeDeviceEntry(device, withkey: deviceName)
        return PTResult(success: true, error: nil)
        
      } catch (let error as ESPDeviceCSSError){
        return PTResult(success: false, error: Double(PTError(from: error).rawValue))
      }
      
    }
  }
  
  func doesESPDeviceExist(deviceName: String) throws -> Bool {
    do {
      let _ = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
      return true
    } catch {
      return false
    }
  }
  
  func scanWifiListOfESPDevice(deviceName: String) throws -> NitroModules.Promise<PTWifiScanResult> {
    return Promise.async{
      do{
        let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
        let wifiList = try await device.scanWifiListAsync()
        var jsWifiList : [PTWifiEntry] = []
        // construct the JS interface from the native entries
        for wifiNetwork in wifiList{
          jsWifiList.append(PTWifiEntry(from : wifiNetwork))
        }
        return PTWifiScanResult(success: true, networks: jsWifiList, error: nil)
        
      } catch (let scanError as ESPWiFiScanError){
        return PTWifiScanResult(success: false, networks: nil, error: Double(PTError(from: scanError).rawValue))
      } catch (let rtimeError as ESPRuntimeError){
        return PTWifiScanResult(success: false, networks: nil, error: Double(PTError(from: rtimeError).rawValue))
      }
      
    }
  }
  
  func connectToESPDevice(deviceName: String) throws -> NitroModules.Promise<PTSessionResult> {
    return Promise.async{
      do{
        let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
        let sessionStatus = try await device.connectAsync()
        return PTSessionResult(success: true, status: PTSessionStatus(from: sessionStatus), error: nil)
        
      } catch (ESPSessionError.softAPConnectionFailure){
        // For some reason, the Espressif library throws this error, even if everything is ok
        // So we have to ignore it and return a dont know status.
        return PTSessionResult(success: true, status: PTSessionStatus.checkManually, error: nil)
        
      } catch(let sessionErr as ESPSessionError){
        return PTSessionResult(success: false, status: nil, error: Double(PTError(from: sessionErr).rawValue))
        
      } catch (let rtimeError as ESPRuntimeError){
        return PTSessionResult(success: false, status: nil, error: Double(PTError(from: rtimeError).rawValue))
      }
    }
  }
  
  func disconnectFromESPDevice(deviceName: String) throws -> PTResult {
    do{
      let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
      device.disconnect()
      return PTResult(success: true, error: nil)
      
    } catch(let rtimeError as ESPRuntimeError){
      return PTResult(success: false, error: Double(PTError(from: rtimeError).rawValue))
    }
  }
  
  func createSessionWithESPDevice(deviceName: String) throws -> NitroModules.Promise<PTSessionResult> {
    return Promise.async{
      do{
        let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
        
        let sessionStatus = try await device.initialiseSessionAsync(sessionPath: nil)
        return PTSessionResult(success: true, status: PTSessionStatus(from: sessionStatus), error: nil)
      } catch(let sessionError as ESPSessionError){
        return PTSessionResult(success: false, status: nil, error: Double(PTError(from: sessionError).rawValue))
      } catch(let rtimeError as ESPRuntimeError){
        return PTSessionResult(success: false, status: nil, error: Double(PTError(from: rtimeError).rawValue))
      }    }
  }
  
  func provisionESPDevice(deviceName: String, ssid: String, password: String) throws -> NitroModules.Promise<PTProvisionResult> {
    return Promise.async{
      do{
        let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
        
        let provStatus = try await device.provisionAsync(ssid: ssid, passcode: password)
        return PTProvisionResult(success: true, status: PTProvisionStatus(from: provStatus), error: nil)
      }
      catch(let provError as ESPProvisionError){
        return PTProvisionResult(success: false, status: nil, error: Double(PTError(from: provError).rawValue))
      } catch (let rtimeError as ESPRuntimeError){
        return PTProvisionResult(success: false, status: nil, error: Double(PTError(from: rtimeError).rawValue))
      }
    }
  }
  // fix this, the return struct is not true
  func isESPDeviceSessionEstablished(deviceName: String) throws -> PTBooleanResult {
    do{
      let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
      return PTBooleanResult(success: true, result: device.isSessionEstablished(), error: nil)
    } catch (let rtimeError as ESPRuntimeError){
      return PTBooleanResult(success: false, result: nil, error: Double(PTError(from: rtimeError).rawValue))
    }
  }
  
  func sendDataToESPDevice(deviceName: String, path: String, data: String) throws -> NitroModules.Promise<PTStringResult> {
    return Promise.async{
      do{
        let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName);
        // First check if it's valid base64 data
        guard let decodedData = Data(base64Encoded: data) else {
          throw ESPRuntimeError.badBase64Data
        }
        // Send it to device and get response
        let response = try await device.sendDataAsync(path: path, data: decodedData)
        let resp_base64 = response.base64EncodedString()
        return PTStringResult(success: true, str: resp_base64, error: nil)

      } catch (let sessionError as ESPSessionError){
        return PTStringResult(success: false, str: nil, error: Double(PTError(from : sessionError).rawValue))
      } catch (let rtimeError as ESPRuntimeError){
        return PTStringResult(success: false, str: nil, error: Double(PTError(from: rtimeError).rawValue))
      }
    }
  }
  
  func getIPv4AddressOfESPDevice(deviceName: String) throws -> PTStringResult {
    do{
      let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
      return PTStringResult(success: true, str: device.wifiConnectedIp4Addr(), error: nil)
    } catch {
      return PTStringResult(success: false, str: nil, error: Double(PTError.runtimeUnknownError.rawValue))
    }
  }
  
  func getCurrentNetworkSSID() throws -> PTStringResult {
    if let interfaces = CNCopySupportedInterfaces() as NSArray? {
      for interface in interfaces {
        if let interfaceInfo = CNCopyCurrentNetworkInfo(interface as! CFString) as NSDictionary? {
          if let currentSSID = interfaceInfo[kCNNetworkInfoKeySSID as String] as? String {
            return PTStringResult(success: true, str: currentSSID, error: nil)
          }
        }
      }
    }
    return PTStringResult(success: false, str: nil, error: Double(PTError.runtimeUnknownError.rawValue))
  }
  
  
  func requestLocationPermission() throws {
    LocationHelper.shared.requestLocationPermission()
  }
  
  
  func registerLocationStatusCallback(callback: @escaping (PTLocationAccess) -> NitroModules.Promise<Bool>) throws -> Double {
    return Double(LocationHelper.shared.registerLocationCallback(callback: callback))
  }
  
  func removeLocationStatusCallback(id: Double) throws -> Bool {
    return LocationHelper.shared.removeLocationCallback(id: Int(id))
  }
  
  func nativeErrorToNumber(error: PTError) throws -> Double {
    return Double(error.rawValue)
  }
  
  
  func getCurrentLocationStatus() throws -> PTLocationAccess {
    return LocationHelper.shared.getCurrentLocationAcces()
  }
  
  func getESPDevice(deviceName: String) throws -> PTDeviceResult {
    do {
      let device = try EspProvToolkit.getDeviceEntry(forKey: deviceName)
      
      // Safely handle optional versionInfo
      let versionStr: String?
      if let versionInfo = device.versionInfo {
        let versionData = try? JSONSerialization.data(withJSONObject: versionInfo)
        versionStr = versionData.flatMap { String(data: $0, encoding: .utf8) }
      } else {
        versionStr = nil
      }
      
      // Safely handle optional advertisementData
      let advString: String? = nil
      return PTDeviceResult(
        success: true,
        result: PTDevice(
          name: device.name,
          security: PTSecurity(from: device.security),
          transport: PTTransport(from: device.transport),
          connected: device.isSessionEstablished(),
          username: device.username,
          versionInfo: versionStr,
          capabilities: device.capabilities,
          advertisementData: advString
        )
      )
    } catch {
      return PTDeviceResult(success: false, result: nil)
    }
  }
  
}
