//
//  LocationHelper.swift
//  EspProvToolkit
//
//  Created by Berk Cevikel on 18.04.2025.
//

import Foundation
import CoreLocation
import NitroModules


typealias LocationCallback = (PTLocationAccess) -> Promise<Bool>

class LocationHelper : NSObject, CLLocationManagerDelegate{
  /// Singleton instance
  static let shared = LocationHelper()
  
  /// The managed location manager
  let locationManager = CLLocationManager()

  
  /// Internal state of location services access
  private var acccessState : PTLocationAccess = .notDetermined;
  
  /// A store for callbacks
  private var callbackList : [Int : LocationCallback] = [:]
  private var callbackCount : Int = 0
  
  private override init(){
    super.init()
    locationManager.delegate = self
    locationManager.desiredAccuracy = kCLLocationAccuracyKilometer

  }
  
  func getCurrentLocationAcces() -> PTLocationAccess{
    return acccessState
  }
  
  func registerLocationCallback(callback : @escaping LocationCallback) -> Int{
    callbackCount += 1
    callbackList[callbackCount] = callback
    return callbackCount
  }
  
  func removeLocationCallback(id : Int) -> Bool {
    (callbackList.removeValue(forKey: id) != nil)
  }
  
  func resetLocationCallbacks(){
    callbackList.removeAll()
  }
  
  func requestLocationPermission() {
    switch acccessState {
    case .granted:
      return
    case .denied:
      locationManager.requestWhenInUseAuthorization()
    case .notDetermined:
      locationManager.requestWhenInUseAuthorization()
    }
  }
  
  func startLocationServices(){
    self.locationManager.startUpdatingLocation()

  }
  
  func stopLocationServices(){
    self.locationManager.stopUpdatingLocation()
  }
  
  // MARK: - CLLocationManagerDelegate Methods
    
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
      if let lastLocation = locations.last {
          print("<LocationManager> lastLocation:\(lastLocation.coordinate.latitude), \(lastLocation.coordinate.longitude)")
      }
  }
  
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
      if let error = error as? CLError, error.code == .denied {
          print("<LocationManager> Error Denied: \(error.localizedDescription)")
          manager.stopUpdatingLocation()
      }
  }
  
  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
      let status = manager.authorizationStatus

      // Handle the different authorization statuses
      switch status {
      case .notDetermined:
        acccessState = .notDetermined
      case .restricted, .denied:
        acccessState = .denied
      case .authorizedWhenInUse, .authorizedAlways:
        acccessState = .granted
      @unknown default:
        acccessState = .notDetermined
      }
      
      authStateChangeCallback(newState: acccessState)
  }
  
  func requestLocation(){
    
  }
  
  private func authStateChangeCallback(newState : PTLocationAccess){
    for callback in callbackList.values {
      _ = callback(newState)
    }
  }
  
}
