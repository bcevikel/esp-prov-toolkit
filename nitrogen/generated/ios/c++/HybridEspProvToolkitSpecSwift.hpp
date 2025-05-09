///
/// HybridEspProvToolkitSpecSwift.hpp
/// This file was generated by nitrogen. DO NOT MODIFY THIS FILE.
/// https://github.com/mrousavy/nitro
/// Copyright © 2025 Marc Rousavy @ Margelo
///

#pragma once

#include "HybridEspProvToolkitSpec.hpp"

// Forward declaration of `HybridEspProvToolkitSpec_cxx` to properly resolve imports.
namespace EspProvToolkit { class HybridEspProvToolkitSpec_cxx; }

// Forward declaration of `PTSearchResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTSearchResult; }
// Forward declaration of `PTTransport` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTTransport; }
// Forward declaration of `PTSecurity` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTSecurity; }
// Forward declaration of `PTResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTResult; }
// Forward declaration of `PTDeviceResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTDeviceResult; }
// Forward declaration of `PTDevice` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTDevice; }
// Forward declaration of `PTWifiScanResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTWifiScanResult; }
// Forward declaration of `PTWifiEntry` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTWifiEntry; }
// Forward declaration of `PTSessionResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTSessionResult; }
// Forward declaration of `PTSessionStatus` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTSessionStatus; }
// Forward declaration of `PTProvisionResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTProvisionResult; }
// Forward declaration of `PTProvisionStatus` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTProvisionStatus; }
// Forward declaration of `PTBooleanResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTBooleanResult; }
// Forward declaration of `PTStringResult` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { struct PTStringResult; }
// Forward declaration of `PTLocationAccess` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTLocationAccess; }
// Forward declaration of `PTError` to properly resolve imports.
namespace margelo::nitro::espprovtoolkit { enum class PTError; }

#include <NitroModules/Promise.hpp>
#include "PTSearchResult.hpp"
#include <optional>
#include <vector>
#include <string>
#include "PTTransport.hpp"
#include "PTSecurity.hpp"
#include "PTResult.hpp"
#include "PTDeviceResult.hpp"
#include "PTDevice.hpp"
#include "PTWifiScanResult.hpp"
#include "PTWifiEntry.hpp"
#include "PTSessionResult.hpp"
#include "PTSessionStatus.hpp"
#include "PTProvisionResult.hpp"
#include "PTProvisionStatus.hpp"
#include "PTBooleanResult.hpp"
#include "PTStringResult.hpp"
#include <functional>
#include "PTLocationAccess.hpp"
#include "PTError.hpp"

#include "EspProvToolkit-Swift-Cxx-Umbrella.hpp"

namespace margelo::nitro::espprovtoolkit {

  /**
   * The C++ part of HybridEspProvToolkitSpec_cxx.swift.
   *
   * HybridEspProvToolkitSpecSwift (C++) accesses HybridEspProvToolkitSpec_cxx (Swift), and might
   * contain some additional bridging code for C++ <> Swift interop.
   *
   * Since this obviously introduces an overhead, I hope at some point in
   * the future, HybridEspProvToolkitSpec_cxx can directly inherit from the C++ class HybridEspProvToolkitSpec
   * to simplify the whole structure and memory management.
   */
  class HybridEspProvToolkitSpecSwift: public virtual HybridEspProvToolkitSpec {
  public:
    // Constructor from a Swift instance
    explicit HybridEspProvToolkitSpecSwift(const EspProvToolkit::HybridEspProvToolkitSpec_cxx& swiftPart):
      HybridObject(HybridEspProvToolkitSpec::TAG),
      _swiftPart(swiftPart) { }

  public:
    // Get the Swift part
    inline EspProvToolkit::HybridEspProvToolkitSpec_cxx& getSwiftPart() noexcept {
      return _swiftPart;
    }

  public:
    // Get memory pressure
    inline size_t getExternalMemorySize() noexcept override {
      return _swiftPart.getMemorySize();
    }

  public:
    // Properties
    

  public:
    // Methods
    inline std::shared_ptr<Promise<PTSearchResult>> searchForESPDevices(const std::string& devicePrefix, PTTransport transport, PTSecurity security) override {
      auto __result = _swiftPart.searchForESPDevices(devicePrefix, static_cast<int>(transport), static_cast<int>(security));
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline void stopSearchingForESPDevices() override {
      auto __result = _swiftPart.stopSearchingForESPDevices();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline std::shared_ptr<Promise<PTResult>> createESPDevice(const std::string& deviceName, PTTransport transport, PTSecurity security, const std::optional<std::string>& proofOfPossession, const std::optional<std::string>& softAPPassword, const std::optional<std::string>& username) override {
      auto __result = _swiftPart.createESPDevice(deviceName, static_cast<int>(transport), static_cast<int>(security), proofOfPossession, softAPPassword, username);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTDeviceResult getESPDevice(const std::string& deviceName) override {
      auto __result = _swiftPart.getESPDevice(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline bool doesESPDeviceExist(const std::string& deviceName) override {
      auto __result = _swiftPart.doesESPDeviceExist(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<PTWifiScanResult>> scanWifiListOfESPDevice(const std::string& deviceName) override {
      auto __result = _swiftPart.scanWifiListOfESPDevice(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<PTSessionResult>> connectToESPDevice(const std::string& deviceName) override {
      auto __result = _swiftPart.connectToESPDevice(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTResult disconnectFromESPDevice(const std::string& deviceName) override {
      auto __result = _swiftPart.disconnectFromESPDevice(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<PTProvisionResult>> provisionESPDevice(const std::string& deviceName, const std::string& ssid, const std::string& password) override {
      auto __result = _swiftPart.provisionESPDevice(deviceName, ssid, password);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTBooleanResult isESPDeviceSessionEstablished(const std::string& deviceName) override {
      auto __result = _swiftPart.isESPDeviceSessionEstablished(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline std::shared_ptr<Promise<PTStringResult>> sendDataToESPDevice(const std::string& deviceName, const std::string& path, const std::string& data) override {
      auto __result = _swiftPart.sendDataToESPDevice(deviceName, path, data);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTStringResult getIPv4AddressOfESPDevice(const std::string& deviceName) override {
      auto __result = _swiftPart.getIPv4AddressOfESPDevice(deviceName);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTStringResult getCurrentNetworkSSID() override {
      auto __result = _swiftPart.getCurrentNetworkSSID();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline void requestLocationPermission() override {
      auto __result = _swiftPart.requestLocationPermission();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
    }
    inline double registerLocationStatusCallback(const std::function<std::shared_ptr<Promise<bool>>(PTLocationAccess /* level */)>& callback) override {
      auto __result = _swiftPart.registerLocationStatusCallback(callback);
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline bool removeLocationStatusCallback(double id) override {
      auto __result = _swiftPart.removeLocationStatusCallback(std::forward<decltype(id)>(id));
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline PTLocationAccess getCurrentLocationStatus() override {
      auto __result = _swiftPart.getCurrentLocationStatus();
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }
    inline double nativeErrorToNumber(PTError error) override {
      auto __result = _swiftPart.nativeErrorToNumber(static_cast<int>(error));
      if (__result.hasError()) [[unlikely]] {
        std::rethrow_exception(__result.error());
      }
      auto __value = std::move(__result.value());
      return __value;
    }

  private:
    EspProvToolkit::HybridEspProvToolkitSpec_cxx _swiftPart;
  };

} // namespace margelo::nitro::espprovtoolkit
